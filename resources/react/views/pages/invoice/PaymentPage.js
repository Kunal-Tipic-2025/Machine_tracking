import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAPICall, postAPICall, postFormData } from '../../../util/api'; // Assuming the same utility as in Invoice component
import { useToast } from '../../common/toast/ToastContext'; // Assuming ToastContext is available
import { useNavigate } from 'react-router-dom'
import { CButton, CFormSelect, CSpinner } from '@coreui/react';
import { generateMultiLanguagePDF } from './InvoiceMulPdf';
import {
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CTooltip
} from '@coreui/react';
import { FileUpload } from 'tabler-icons-react';
import { getUserData } from '../../../util/session';

const PaymentPage = () => {
    const [save, setsave] = useState(false); // Changed to false since we're viewing payment details
    const [selectedLang, setSelectedLang] = useState('english');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showToast } = useToast(); // Initialize toast for error/success messages
    const { id } = useParams(); // Get the payment ID from the URL
    const [machineLogData, setMachineLogData] = useState([]);
    const [rows, setRows] = useState([]);
    const [response, setresponse] = useState();
    const [isShow, setIsShow] = useState(true);

    // Modal state for "Record Payment"
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [modalAmountPaid, setModalAmountPaid] = useState(0);
    const [modalPaymentMode, setModalPaymentMode] = useState('Cash');

    const TruncatedCell = ({ children, maxLength = 8 }) => {
        const text = String(children || '').trim();
        if (text.length <= maxLength) {
            return <>{text}</>;
        }

        const truncated = text.substring(0, maxLength) + '...';

        return (
            <CTooltip content={text} placement="top">
                <span style={{ cursor: 'pointer' }}>{truncated}</span>
            </CTooltip>
        );
    };

    const userData = getUserData();
    const company = userData?.company_info;

    console.log("User : ", company);
    

    const [formData, setFormData] = useState({
        project_name: '',
        gst_number: '',
        name: '',
        address: '',
        mobile: '',
        date: '',
        items: [],
        selectedMachines: [],
        discount: 0,
        invoiceStatus: '',
        finalAmount: 0,
        totalAmount: 0,
        invoice_number: '',
        status: '',
        deliveryDate: '',
        invoiceType: '',

        amountPaid: 0,
        paymentMode: 'Cash',
        is_advance: false,
    });


    const navigate = useNavigate();

    const fetchPaymentData = async (retryCount = 0) => {
        if (retryCount === 0) setLoading(true);
        try {
            const response = await getAPICall(`/api/project-payments/${id}`);
            if (!response) {
                throw new Error('No data returned from server');
            }
            setresponse(response);
            setCi(response.company);

            // ✅ Initialize amountPaid and paymentMode for ALL invoice types
            setFormData((prev) => ({
                ...prev,
                amountPaid: response.paid_amount || 0, // Use paid_amount from DB
                paymentMode: response.payment_mode || 'Cash',
                is_advance: response.is_advance || false,
                invoice_number: response.invoice_number || 'N/A',
                project_name: response.project?.project_name || 'N/A',
                repayments: response.repayments || [], // ✅ Store repayments
            }));

            // Logic for "Record Payment" button visibility
            if (response?.is_advance || response?.is_fixed_bid) {
                // For advance and fixed bid, we hide the manual record payment button
                setIsShow(false);
                setsave(true);
            } else {
                setIsShow(true);
            }
            showToast('success', 'Payment data loaded successfully');
            setLoading(false);
        } catch (err) {
            console.error(`Error fetching payment data (Attempt ${retryCount + 1}/3):`, err);
            if (retryCount < 3) {
                setTimeout(() => {
                    fetchPaymentData(retryCount + 1);
                }, 1000);
            } else {
                setError('Failed to load payment data');
                showToast('danger', 'Failed to load payment data');
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchPaymentData();
    }, [id]);


    //here now
    const [machineLogs, setMachineLogs] = useState([]);
    const [machines, setmachines] = useState([]);
    const [operators, setOperators] = useState([]);
    const [prices, setPrice] = useState([]);
    const [ci, setCi] = useState(null);

    useEffect(() => {
        const fetchMachineLogs = async () => {
            if (!response?.worklog_ids || response.worklog_ids.length === 0) {
                setMachineLogs([]);
                return;
            }

            try {
                // Fetch all logs in parallel
                const results = await Promise.all(
                    response.worklog_ids.map(async (id) => {
                        const res = await fetch(`/api/machine-logs/${id}`);
                        if (!res.ok) {
                            throw new Error(`Failed to fetch log with id ${id}`);
                        }
                        const data = await res.json();
                        return data;
                    })
                );
                setMachineLogs(results);
            } catch (error) {
                console.error("Error fetching machine logs:", error);
            }
        };

        fetchMachineLogs();
    }, [response?.worklog_ids]);




    const fetchMachineries = async () => {
        try {
            const response = await getAPICall('/api/machine-operators')
            setmachines(response)
            setRows(response || []);
        } catch (error) {
            console.error('Error fetching machineries:', error)
            showToast('danger', 'Error fetching machineries')
        }
    }

    const fetchOperators = () => {
        getAPICall("/api/operatorsByCompanyIdOperator")
            .then((res) => {
                console.log(res);
                setOperators(res || []);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err.message);
                setLoading(false);
            });
    };

    const fetchMachineprice = async () => {
        try {
            const response = await getAPICall('/api/machine-price')
            setPrice(response)
        } catch (error) {
            console.error('Error fetching machineries:', error)
            showToast('danger', 'Error fetching machineries')
        }
    }

    useEffect(() => {
        fetchMachineries();
        fetchOperators();
        fetchMachineprice();
    }, [])
    const handleInputChange = (e, section = null) => {
        const { name, value } = e.target;

        // if (section === 'customer') {
        //     setFormData(prev => ({
        //         ...prev,
        //         customer: { ...prev.customer, [name]: value }
        //     }));
        // } else {
        setFormData(prev => ({ ...prev, [name]: value }));
        // }
    };

    // Record Payment modal handlers
    const openRecordPayment = () => {
        setModalAmountPaid(formData.amountPaid || 0);
        setModalPaymentMode(formData.paymentMode || 'Cash');
        setShowPaymentModal(true);
    };

    const closeRecordPayment = () => {
        setShowPaymentModal(false);
    };

    const saveRecordPayment = () => {
        setFormData(prev => ({
            ...prev,
            amountPaid: Number(modalAmountPaid) || 0,
            paymentMode: modalPaymentMode || 'Cash',
        }));
        setShowPaymentModal(false);
    };

    // const handleMachineLogChange = (id, field, value) => {
    //     setMachineLogData(prev => prev.map(log => {
    //         if (log.id === id) {
    //             const updated = { ...log, [field]: value };

    //             if (field === 'start_reading' || field === 'end_reading') {
    //                 const start = field === 'start_reading' ? parseFloat(value) || 0 : log.start_reading;
    //                 const end = field === 'end_reading' ? parseFloat(value) || 0 : log.end_reading;
    //                 updated.net_reading = Math.max(0, end - start);
    //                 updated.total_price = updated.net_reading * updated.price_per_hour;
    //             }

    //             if (field === 'price_per_hour') {
    //                 updated.total_price = updated.net_reading * (parseFloat(value) || 0);
    //             }

    //             return updated;
    //         }
    //         return log;
    //     }));
    // };

    // const addMachineLog = () => {
    //     const newLog = {
    //         id: machineLogData.length + 1,
    //         work_date: new Date().toISOString().split('T')[0],
    //         machine_name: 'New Machine',
    //         operator_name: 'Operator Name',
    //         start_reading: 0,
    //         end_reading: 0,
    //         net_reading: 0,
    //         mode: 'Standard',
    //         price_per_hour: 1000,
    //         total_price: 0
    //     };
    //     setMachineLogData([...machineLogData, newLog]);
    // };

    // const deleteMachineLog = (id) => {
    //     setMachineLogData(prev => prev.filter(log => log.id !== id));
    // };

    const calculateTotals = () => {
        // const totalAmount = machineLogData.reduce((acc, log) => acc + log.total_price, 0);
        const remainingAmount = response?.total - formData.amountPaid;
        // const totalNetReading = machineLogData.reduce((acc, log) => acc + log.net_reading, 0);
        return { remainingAmount };
    };

    const { remainingAmount } = calculateTotals();



    const handleSave = async () => {

        try {

            const updatedData = {
                paid_amount: formData.amountPaid,  // or whatever field you have
                payment_mode: formData.paymentMode?.trim() || 'Cash'
            };

            const response = await fetch(`/api/project-payments/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error('Failed to update payment');
            }

            const result = await response.json();
            console.log('Payment updated:', result);
            setsave(true);
            setIsShow(false);

            showToast('success', 'Invoice saved successfully');
        } catch (error) {
            console.error(error);
            showToast('error', 'Failed to save invoice');
        }

        const today = new Date().toISOString().split('T')[0];
        const payload = {
            company_id: response.company_id,
            project_id: response.project?.id,
            invoice_id: response?.invoice_number,
            payment: formData?.amountPaid,
            total: response.total,
            remaining: response.total - formData?.amountPaid,
            is_completed: response.total - formData?.amountPaid <= 0,
            date: today,
        };

        try {
            const res = await fetch("/api/repayment/single", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("✅ Repayment created:", data);
        } catch (err) {
            console.error("❌ Error creating repayment:", err);
        }

    };


    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <CSpinner color="primary" size="lg" />
                <p className="mt-3 text-muted">Loading Invoice...</p>
            </div>
        );
    }
    const handleSendWhatsApp = async (lang) => {
        try {
            const latestData = await fetchPaymentData2();
            const pdfBlob = await generateMultiLanguagePDF(
                latestData,
                machineLogs,
                operators,
                rows,
                prices,
                [],
                lang,
                'blob'
            );

            const fileName = `${formData.invoice_number}_${formData.name}.pdf`;
            const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

            const message = `*Invoice from ${ci?.company_name || 'Company'}*\n\n` +
                `Customer Name: ${response.project?.customer_name}\n` +
                `Invoice Number: ${formData.invoice_number}\n` +
                `Total Amount: ₹${response.total}\n` +
                `Amount Paid: ₹${formData.amountPaid || 0}\n` +
                (!latestData.is_advance
                    ? `Remaining: ₹${remainingAmount.toFixed(2)}\n\n`
                    : ''
                ) +
                `Thank you!`;

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Invoice',
                        text: message,
                    });
                    showToast('success', 'Invoice shared successfully');
                } catch (shareError) {
                    if (shareError.name !== 'AbortError') {
                        throw shareError;
                    }
                }
            } else {
                // Fallback: Download file and open WhatsApp
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                const whatsappUrl = `https://wa.me/${formData.mobile}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');

                showToast('info', 'File downloaded. Please attach it to the WhatsApp chat.');
            }

        } catch (err) {
            console.error('WhatsApp share error:', err);
            showToast('danger', 'WhatsApp share failed: ' + err.message);
        }
    };

    // const fetchPaymentData2 = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await getAPICall(`/api/project-payments/${id}`);
    //         if (!response) {
    //             throw new Error('No data returned from server');
    //         }
    //         console.log('payment response', response);

    //         setFormData((prev) => ({
    //             ...prev,
    //             invoice_number: response.invoice_number || 'N/A',
    //             project_name: response.project?.project_name || 'N/A',
    //             gst_number: response.project?.gst_number || 'N/A',
    //             name: response.project?.customer_name || 'N/A',
    //             address: response.project?.work_place || 'N/A',
    //             mobile: response.project?.mobile_number || 'N/A',
    //             date: response.created_at ? response.created_at.slice(0, 10).split('-').reverse().join('-') : '',
    //         }));
    //         //   setGrandTotal(response.total || 0);
    //         //   setTotalAmountWords(numberToWords(response.total || 0));
    //         showToast('success', 'Payment data loaded successfully');
    //     } catch (err) {
    //         console.error('Error fetching payment data:', err);
    //         setError('Failed to load payment data');
    //         showToast('danger', 'Failed to load payment data');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchPaymentData2 = async () => {
        try {
            const response = await getAPICall(`/api/project-payments/${id}`);
            if (!response) throw new Error('No data returned from server');

            console.log('payment response', response);

            const rawDate = response.created_at?.slice(0, 10); // e.g., "2025-11-17"

            const newData = {
                amountPaid: formData.amountPaid || 0,
                paymentMode: response.payment_mode || 'Cash', // ✅ Use response directly
                invoice_number: response.invoice_number || 'N/A',
                project_name: response.project?.project_name || 'N/A',
                gst_number: response.project?.gst_number || 'N/A',
                name: response.project?.customer_name || 'N/A',
                address: response.project?.work_place || 'N/A',
                mobile: response.project?.mobile_number || 'N/A',

                // CRITICAL FIX: Pass ISO date string, NOT formatted DD-MM-YYYY
                date: rawDate || null, // Keep as "2025-11-17" → valid for new Date()

                // Optional: Provide a display-friendly version separately if needed
                // displayDate: rawDate ? rawDate.split('-').reverse().join('-') : '',

                is_advance: response.is_advance ?? false,
                is_fixed_bid: response.is_fixed_bid ?? false, // ✅ Pass Fixed Bid flag
                remark: response.remark || '', // ✅ Pass Remark/Description
                transaction_id: response.transaction_id || '', // ✅ Pass Transaction ID
                totalAmount: response.total || 0, // ✅ Pass Total Amount
            };

            showToast('success', 'Payment data loaded successfully');
            console.log('newData for PDF:', newData);

            return newData;
        } catch (err) {
            console.error('Error fetching payment data:', err);
            setError('Failed to load payment data');
            showToast('danger', 'Failed to load payment data');
            throw err;
        }
    };

    const handleDownload = async (lang) => {

        const latestData = await fetchPaymentData2(); // ✅ wait for data
        // if (!latestData) return;
        try {
            console.log('📋 FINAL formData:', latestData);
            const pdfBlob = await generateMultiLanguagePDF(
                latestData,
                machineLogs,
                operators,
                rows,
                prices,
                [],
                lang,
                'blob'
            );
            if (pdfBlob) {
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${formData.invoice_number}-${formData.name}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                showToast('success', 'PDF downloaded successfully!');
            } else {
                throw new Error('Failed to generate PDF Blob');
            }
        } catch (error) {
            console.error('Error generating/downloading PDF:', error);
            showToast('danger', 'Error downloading PDF: ' + error.message);
        }
    };


    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <style>{`
        @media print {
          .no-print { display: none !important; }
        }
        
        .card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        
        .card-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          transition: all 0.15s ease;
          border: 1px solid transparent;
          cursor: pointer;
          display: inline-block;
          text-align: center;
        }
        
        .btn-primary {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        .btn-primary:hover {
          background-color: #2563eb;
        }
        
        .btn-outline-primary {
          background-color: transparent;
          color: #3b82f6;
          border-color: #3b82f6;
        }
        
        .btn-outline-primary:hover {
          background-color: #3b82f6;
          color: white;
        }
        
        .btn-outline-danger {
          background-color: transparent;
          color: #dc2626;
          border-color: #dc2626;
        }
        
        .btn-outline-danger:hover {
          background-color: #dc2626;
          color: white;
        }
        
        .btn-outline-success {
          background-color: transparent;
          color: #16a34a;
          border-color: #16a34a;
        }
        
        .btn-outline-success:hover {
          background-color: #16a34a;
          color: white;
        }
        
        .form-control {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
        
        .form-control:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }
        
        .table th,
        .table td {
          padding: 0.75rem;
          border: 1px solid #000;
          text-align: left;
        }
        
        .table thead {
          background-color: #f3f4f6;
        }
        
        .table-secondary {
          background-color: #e5e7eb;
        }
        
        .section {
          margin-bottom: 1.5rem;
        }
        
        .border-black {
          border-color: #000;
        }
      `}</style>

            <div className="card" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div className="card-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h5 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                            Invoice #{response.invoice_number}
                        </h5>
                    </div>
                </div>

                <div className="card-body">
                    {/* Customer & Invoice Details */}
                    <div className="section">
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '0.75rem',                    // Reduced gap between columns
                                fontSize: '0.85rem',               // Smaller text
                                lineHeight: '1.3',                 // Tighter line spacing
                            }}
                        >
                            {/* === Customer Info === */}
                            <div style={{ margin: 0 }}>
                                <p style={{ margin: '0 0 0.35rem' }}>
                                    <strong>Customer Name:</strong> {response.project?.customer_name}
                                </p>
                                <p style={{ margin: '0 0 0.35rem' }}>
                                    <strong>Customer Address:</strong> {response.project?.work_place}
                                </p>
                                <p style={{ margin: 0 }}>
                                    <strong>Mobile Number:</strong> {response.project?.mobile_number}
                                </p>
                            </div>

                            {/* === Invoice Info === */}
                            <div style={{ margin: 0 }}>
                                <p style={{ margin: '0 0 0.35rem' }}>
                                    <strong>Invoice Number:</strong> {response.invoice_number}
                                </p>
                                {response.project?.gst_number && (
                                    <p style={{ margin: '0 0 0.35rem' }}>
                                        <strong>GST Number:</strong> {response.project?.gst_number}
                                    </p>
                                )}
                                <p style={{ margin: 0 }}>
                                    <strong>Invoice Date:</strong>{' '}
                                    {response?.created_at
                                        ? response.created_at.slice(0, 10).split('-').reverse().join('-')
                                        : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {machineLogs.length > 0 && (
                        <div className="section">
                            <div
                                className="table-responsive-wrapper"
                                style={{
                                    width: '100%',
                                    overflowX: 'auto',
                                    overflowY: 'hidden',
                                    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
                                    border: '1px solid #dee2e6',
                                    borderRadius: '8px',
                                    backgroundColor: '#fff',
                                    marginBottom: '1rem',
                                }}
                            >
                                {/* Optional: Visual cue for horizontal scroll */}
                                <style jsx>{`
                .table-responsive-wrapper::-webkit-scrollbar {
                    height: 8px;
                }
                .table-responsive-wrapper::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                .table-responsive-wrapper::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }
                .table-responsive-wrapper::-webkit-scrollbar-thumb:hover {
                    background: #a1a1a1;
                }
                
            `}</style>

                                <CTable
                                    bordered
                                    hover
                                    responsive={false} // Disable CoreUI's built-in responsiveness
                                    className="mb-0"
                                    style={{
                                        minWidth: '900px', // Ensures table doesn't collapse
                                        tableLayout: 'fixed',
                                        width: '100%',
                                    }}
                                >
                                    {/* === TABLE HEAD === */}
                                    <CTableHead
                                        className="table-light"
                                        style={{
                                            position: 'sticky',
                                            top: 0,
                                            backgroundColor: '#f8f9fa',
                                            zIndex: 10,
                                            fontSize: '0.85rem',
                                            lineHeight: '1.2',
                                        }}
                                    >
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: '50px', textAlign: 'center' }}>Sr No</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: '100px', textAlign: 'center' }}>Work Date</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: '110px', textAlign: 'center' }}>Machine</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: '100px', textAlign: 'center' }}>Operator</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: '90px', textAlign: 'center' }}>Start</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: '90px', textAlign: 'center' }}>End</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: '90px', textAlign: 'center' }}>Net</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: '80px', textAlign: 'center' }}>Mode</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: '100px', textAlign: 'center' }}>Price/Hr</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: '110px', textAlign: 'center' }}>Total</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>

                                    {/* === TABLE BODY === */}
                                    <CTableBody>
                                        {machineLogs.map((log, idx) => {
                                            const start = Number(log.data?.start_reading ?? 0);
                                            const end = Number(log.data?.end_reading ?? 0);
                                            const net = Math.max(0, end - start);
                                            const price = Number(log.data?.price_per_hour ?? 0);
                                            const total = net * price;

                                            const workDate = response?.created_at
                                                ? response.created_at.slice(0, 10).split('-').reverse().join('-')
                                                : '';

                                            const machine = machines.find(m => String(m.id) === log.data?.machine_id);
                                            const operator = operators.find(o => String(o.id) === log.data?.operator_id);
                                            const mode = prices.find(p => p.id === log.data?.mode_id);

                                            return (
                                                <CTableRow key={log.id}>
                                                    <CTableDataCell className="text-center">{idx + 1}</CTableDataCell>
                                                    <CTableDataCell>{workDate}</CTableDataCell>
                                                    <CTableDataCell>
                                                        <TruncatedCell maxLength={8}>{machine?.machine_name ?? '—'}</TruncatedCell>
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        <TruncatedCell maxLength={8}>{operator?.name ?? '—'}</TruncatedCell>
                                                    </CTableDataCell>
                                                    <CTableDataCell className="text-left">{start}</CTableDataCell>
                                                    <CTableDataCell className="text-left">{end}</CTableDataCell>
                                                    <CTableDataCell className="text-left">{net.toFixed(2)}</CTableDataCell>
                                                    <CTableDataCell>
                                                        <TruncatedCell maxLength={6}>{mode?.mode ?? '—'}</TruncatedCell>
                                                    </CTableDataCell>
                                                    <CTableDataCell className="text-end">{price}</CTableDataCell>
                                                    <CTableDataCell className="text-end fw-semibold">₹{total.toFixed(2)}</CTableDataCell>
                                                </CTableRow>
                                            );
                                        })}

                                        {/* === GRAND TOTAL ROW === */}
                                        <CTableRow className="table-secondary fw-bold">
                                            <CTableDataCell colSpan={6} className="text-end">
                                                Grand Total:
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end">
                                                {machineLogs.reduce((sum, log) => {
                                                    const s = Number(log.data?.start_reading ?? 0);
                                                    const e = Number(log.data?.end_reading ?? 0);
                                                    return sum + Math.max(0, e - s);
                                                }, 0).toFixed(2)}
                                            </CTableDataCell>
                                            <CTableDataCell colSpan={2}></CTableDataCell>
                                            <CTableDataCell className="text-end">₹{response?.total ?? 0}</CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </div>
                        </div>
                    )}

                    {/* Totals and Payment Details */}
                    <div className="section">
                        <CTable borderless className="mb-0" style={{ fontSize: '0.9rem' }}>
                            <CTableBody>
                                {!formData.is_advance && (
                                    <>
                                        <CTableRow className="align-middle">
                                            <CTableDataCell
                                                className="fw-semibold py-1 pe-3"
                                                style={{ width: '45%', minWidth: '140px' }}
                                            >
                                                Total Amount:
                                            </CTableDataCell>
                                            <CTableDataCell className="py-1 text-start">
                                                ₹{response.total}
                                            </CTableDataCell>
                                        </CTableRow>
                                    </>
                                )}

                                <CTableRow className="align-middle">
                                    <CTableDataCell className="fw-semibold py-1 pe-3">
                                        Amount Paid:
                                    </CTableDataCell>
                                    <CTableDataCell className="py-1 align-middle">
                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                            <div className="d-flex flex-column">
                                                <span className="fw-medium">₹{formData.amountPaid || 0}</span>
                                                {/* Breakdown */}
                                                {(() => {
                                                    const advancePaid = formData.repayments
                                                        ?.filter(r => r.from_advance)
                                                        ?.reduce((sum, r) => sum + Number(r.payment), 0) || 0;
                                                    const cashPaid = Math.max(0, (formData.amountPaid || 0) - advancePaid);

                                                    if (advancePaid > 0) {
                                                        return (
                                                            <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                                                {cashPaid > 0 && <div>Direct: ₹{cashPaid}</div>}
                                                                <div>From Advance: ₹{advancePaid}</div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </div>
                                            {isShow && (
                                                <CButton
                                                    color="primary"
                                                    size="sm"
                                                    onClick={openRecordPayment}
                                                    className="d-flex align-items-center justify-content-center px-3"
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        height: '28px',
                                                        lineHeight: '1',
                                                        padding: '0 0.75rem',
                                                    }}
                                                >
                                                    Record Payment
                                                </CButton>
                                            )}
                                        </div>
                                    </CTableDataCell>
                                </CTableRow>
                                {!formData.is_advance && (
                                    <>
                                        <CTableRow className="align-middle">
                                            <CTableDataCell className="fw-semibold py-1 pe-3">
                                                Balance Amount:
                                            </CTableDataCell>
                                            <CTableDataCell className="py-1 text-start text-danger fw-bold">
                                                ₹{remainingAmount.toFixed(2)}
                                            </CTableDataCell>
                                        </CTableRow>
                                    </>
                                )}

                                <CTableRow className="align-middle">
                                    <CTableDataCell className="fw-semibold py-1 pe-3">
                                        Payment Mode:
                                    </CTableDataCell>
                                    <CTableDataCell className="py-1">
                                        <span className="text-muted">{formData.paymentMode || 'N/A'}</span>
                                    </CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </div>

                    <div className="row section mt-2">
                        <div className="col-md-12 text-center">
                            <p>This bill has been computer-generated and is authorized.</p>
                        </div>
                    </div>

                    {/* Record Payment Modal */}
                    {showPaymentModal && (
                        <div>
                            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040 }} onClick={closeRecordPayment} />
                            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 8, width: 'min(95vw, 480px)', zIndex: 1050, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h6 style={{ margin: 0 }}>Record Payment</h6>
                                    <button onClick={closeRecordPayment} style={{ border: 'none', background: 'transparent', fontSize: 20, lineHeight: 1, cursor: 'pointer' }}>×</button>
                                </div>
                                <div style={{ padding: 20 }}>
                                    <div style={{ marginBottom: 12 }}>
                                        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
                                            Amount Paid (Max: ₹{remainingAmount.toFixed(2)})
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={modalAmountPaid}
                                            min="0"
                                            max={remainingAmount}
                                            step="0.01"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const numValue = parseFloat(value) || 0;

                                                // Prevent entering amount > remaining
                                                if (numValue > remainingAmount) {
                                                    // Optionally show toast or inline error
                                                    showToast('danger', `Amount cannot exceed remaining balance of ₹${remainingAmount.toFixed(2)}`);
                                                    return;
                                                }

                                                setModalAmountPaid(value);
                                            }}
                                            placeholder={`0.00 (up to ${remainingAmount.toFixed(2)})`}
                                            style={{
                                                borderColor: modalAmountPaid > remainingAmount ? '#dc3545' : '',
                                            }}
                                        />
                                        {modalAmountPaid > remainingAmount && (
                                            <small style={{ color: '#dc3545', fontSize: '0.8rem' }}>
                                                Amount exceeds remaining balance
                                            </small>
                                        )}
                                    </div>
                                    <div style={{ marginBottom: 12 }}>
                                        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Payment Mode</label>
                                        <select className="form-control" value={modalPaymentMode} onChange={(e) => setModalPaymentMode(e.target.value)}>
                                            <option value="Cash">Cash</option>
                                            <option value="UPI">UPI and Online</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="Bank Transfer">Credit</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ padding: 16, borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                    <CButton color="secondary" variant="outline" onClick={closeRecordPayment}>Cancel</CButton>
                                    <CButton color="success" variant="outline" onClick={saveRecordPayment}>Save Changes</CButton>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="d-flex justify-content-center flex-wrap gap-2">
                        <CButton
                            color="success"
                            variant="outline"
                            onClick={() => { handleSendWhatsApp(selectedLang) }}
                            className="d-print-none flex-fill"
                            disabled={!save}
                            style={{
                                color: save ? '#198754' : '#6c757d',        // Green when enabled, grey when disabled
                                borderColor: save ? '#198754' : '#6c757d',  // Match border
                                cursor: save ? 'pointer' : 'not-allowed',
                                opacity: save ? 1 : 0.7,
                                backgroundColor: save ? 'transparent' : '#e5e7eb',
                                transition: 'all 0.3s ease'                 // Smooth hover transition
                            }}
                            onMouseEnter={(e) => {
                                if (save) {
                                    e.target.style.backgroundColor = '#198754'; // Green background
                                    e.target.style.color = '#fff';              // White text
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (save) {
                                    e.target.style.backgroundColor = 'transparent'; // Reset to outline
                                    e.target.style.color = '#198754';               // Restore green text
                                }
                            }}
                        >
                            Share via WhatsApp
                        </CButton>



                        {isShow && <CButton
                            color="success"
                            variant="outline"
                            onClick={handleSave}
                            className="d-print-none flex-fill"
                        >
                            Save Changes
                        </CButton>}




                        <CButton
                            color="success"
                            variant="outline"
                            onClick={() => handleDownload(selectedLang)}
                            className="d-print-none flex-fill"
                            disabled={!save}
                            style={{
                                color: save ? '#198754' : '#6c757d',        // Green when enabled, grey when disabled
                                borderColor: save ? '#198754' : '#6c757d',  // Match border
                                cursor: save ? 'pointer' : 'not-allowed',
                                opacity: save ? 1 : 0.7,
                                backgroundColor: save ? 'transparent' : '#e5e7eb',
                                transition: 'all 0.3s ease'                 // Smooth hover transition
                            }}
                            onMouseEnter={(e) => {
                                if (save) {
                                    e.target.style.backgroundColor = '#198754'; // Green background
                                    e.target.style.color = '#fff';              // White text
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (save) {
                                    e.target.style.backgroundColor = 'transparent'; // Reset to outline
                                    e.target.style.color = '#198754';               // Restore green text
                                }
                            }}
                        >
                            Download PDF
                        </CButton>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PaymentPage;