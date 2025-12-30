import React, { useEffect, useState } from 'react';
import {
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
    CButton, CCard, CCardHeader, CCardBody, CSpinner, CBadge, CAlert,
    CRow, CCol,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilCloudDownload, cilChart
} from '@coreui/icons';
import { getAPICall } from '../../../util/api';
import html2pdf from 'html2pdf.js';
import { getUserData } from '../../../util/session';
import { generateMultiLanguagePDF } from '../invoice/InvoiceMulPdf';

const OrderList = ({ projectId, inModal = false }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [prices, setPrice] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const [downloadingIncome, setDownloadingIncome] = useState(false);
    const [operators, setOperators] = useState([]);
    const [showDateRangeModal, setShowDateRangeModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedIncomeData, setSelectedIncomeData] = useState(null);
    const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(false);
    const [rows, setRows] = useState([]);
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [downloadingInvoicePDF, setDownloadingInvoicePDF] = useState(false);

    const fetchMachineries = async () => {
        try {
            const response = await getAPICall('/api/machine-operators');
            console.log('machineries', response);
            setRows(response || []);
        } catch (error) {
            console.error('Error fetching machineries:', error);
        }
    };

    const fetchLogs = async () => {
        try {
            const response = await getAPICall('/api/machineLog');
            setLogs(response || []);
        } catch (error) {
            console.error('Error fetching machine logs:', error);
        }
    };

    useEffect(() => {
        if (orders?.worklog_ids && logs.length > 0) {
            const matchedLogs = logs.filter(log =>
                orders.worklog_ids.includes(log.id)
            );
            setFilteredLogs(matchedLogs);
            console.log("Filtered Logs:", matchedLogs);
        }
    }, [orders, logs]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getAPICall(`/api/project-payments/${projectId}`);
            console.log(response);
            setOrders(response);
        } catch (error) {
            console.error('Error fetching orders:', error);
            showAlert('Failed to fetch orders', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const fetchOperators = () => {
        getAPICall("/api/operatorsByCompanyIdOperator")
            .then((res) => {
                console.log(res);
                setOperators(res)
            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    useEffect(() => {
        fetchOrders();
    }, [projectId]);

    useEffect(() => {
        fetchLogs();
        fetchOperators()
        fetchMachineries()
        fetchMachineprice();
    }, [])
    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
    };


    const fetchMachineprice = async () => {
        try {
            const response = await getAPICall('/api/machine-price')
            setPrice(response)
        } catch (error) {
            console.error('Error fetching machine price:', error)
        }
    }

    const handleDownloadWorkOrderPDF = async () => {
        if (selectedOrders.length === 0) {
            showAlert('Please select at least one work order to download', 'warning');
            return;
        }

        setDownloadingPDF(true);
        try {
            await generateWorkOrdersPDF(selectedOrders);
            showAlert(`PDF generated successfully for ${selectedOrders.length} work order(s)`, 'success');
            setSelectedOrders([]);
        } catch (error) {
            console.error('Error generating PDF:', error);
            showAlert('Failed to generate PDF. Please try again.', 'danger');
        } finally {
            setDownloadingPDF(false);
        }
    };

    const handleAllProjectsIncomeReportClick = () => {
        setShowDateRangeModal(true);
    };

    const generateInvoicePDF = async () => {
        if (!orders || Object.keys(orders).length === 0) return;

        try {
            setDownloadingInvoicePDF(true);
            const ci = getUserData()?.company_info;

            if (!ci) {
                alert('Company information not found. Please log in again.');
                return;
            }

            const invoiceDate = formatDate(orders.created_at);
            // Map orders data to formData expected by generateMultiLanguagePDF
            const formData = {
                invoice_number: orders.invoice_number,
                date: invoiceDate,
                customer: {
                    name: orders.project?.customer_name || 'N/A',
                    address: orders.project?.work_place || '', // Assuming work_place as address for now, or fetch if available
                    mobile: orders.project?.mobile_number || '',
                    gst_number: orders.project?.gst_number || '', // If available in project
                },
                consignee: {
                    name: ci.company_name,
                    address: `${ci.land_mark || ''}, ${ci.Tal || ''}, ${ci.Dist || ''}, ${ci.pincode || ''}`,
                    phone_no: ci.phone_no,
                    gst_number: ci.gst_number,
                    email_id: ci.email_id,
                },
                totalAmount: orders.total,
                amountPaid: orders.paid_amount,
                finalAmount: orders.total, // Assuming final amount is total
                paymentMode: orders.payment_mode,
                transaction_id: orders.transaction_id,
                is_fixed_bid: orders.is_fixed_bid == 1,
                is_advance: orders.is_advance == 1,
                remark: orders.remark, // For fixed bid/advance
            };

            // Wrap logs to match expected structure { data: log }
            const formattedLogs = filteredLogs.map(log => ({ id: log.id, data: log }));

            await generateMultiLanguagePDF(
                formData,
                formattedLogs, // logs
                operators,
                rows, // machineries
                prices,
                formattedLogs, // filteredLogs
                'english', // Default language
                'save' // mode
            );

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloadingInvoicePDF(false);
        }
    };



    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-GB');
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <CSpinner color="primary" />
            </div>
        );
    }

    if (!orders || Object.keys(orders).length === 0) {
        return (
            <div className="p-4 text-center">
                <p className="text-muted">No invoice data found.</p>
            </div>
        );
    }

    const remaining = orders?.total - orders?.paid_amount;
    const isCompleted = remaining <= 0;

    return (
        <div className="p-4">
            <CCard>
                <CCardHeader className="bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <h5 className="mb-0">Invoice Details</h5>
                        <div className="d-flex align-items-center gap-2">
                            <CBadge
                                color={isCompleted ? "success" : "warning"}
                                className="fs-6 px-3 py-2 rounded-pill"
                            >
                                {isCompleted ? "✔️ Completed" : "⏳ Pending"}
                            </CBadge>
                            <CButton
                                color="success"
                                size="sm"
                                onClick={generateInvoicePDF}
                                disabled={downloadingInvoicePDF || !orders}
                            >
                                {downloadingInvoicePDF ? (
                                    <>
                                        <CSpinner size="sm" className="me-1" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <CIcon icon={cilCloudDownload} className="me-1" />
                                        Download PDF
                                    </>
                                )}
                            </CButton>
                        </div>
                    </div>
                </CCardHeader>
                <CCardBody>
                    {/* Invoice Information Section */}
                    <CRow className="mb-4">
                        <CCol md={6}>
                            <div className="mb-3">
                                <strong>Invoice Number:</strong>
                                <div className="text-muted">{orders.invoice_number || '-'}</div>
                            </div>
                            <div className="mb-3">
                                <strong>Date:</strong>
                                <div className="text-muted">{formatDate(orders.created_at)}</div>
                            </div>
                        </CCol>
                        <CCol md={6}>
                            <div className="mb-3">
                                <strong>Payment Mode:</strong>
                                <div className="text-muted">{orders.payment_mode || '-'}</div>
                            </div>
                            {orders.transaction_id && (
                                <div className="mb-3">
                                    <strong>Transaction ID:</strong>
                                    <div className="text-muted">{orders.transaction_id}</div>
                                </div>
                            )}
                            {orders.project && (
                                <div className="mb-3">
                                    <strong>Customer:</strong>
                                    <div className="text-muted">{orders.project.customer_name || '-'}</div>
                                </div>
                            )}
                        </CCol>
                    </CRow>

                    {/* Action Buttons (only when not in modal) */}
                    {!inModal && (
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                                <div>
                                    {selectedOrders.length > 0 && (
                                        <span className="text-muted small">
                                            {selectedOrders.length} work order(s) selected
                                        </span>
                                    )}
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    <CButton
                                        color="primary"
                                        onClick={handleDownloadWorkOrderPDF}
                                        disabled={selectedOrders.length === 0 || downloadingPDF}
                                        className="d-flex align-items-center"
                                        size="sm"
                                    >
                                        {downloadingPDF ? (
                                            <>
                                                <CSpinner size="sm" className="me-1" />
                                                <span className="d-none d-md-inline">Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CIcon icon={cilCloudDownload} className="me-1" />
                                                <span className="d-none d-sm-inline">Work Order PDF</span>
                                                <span className="d-inline d-sm-none">WO</span>
                                                {selectedOrders.length > 0 && ` (${selectedOrders.length})`}
                                            </>
                                        )}
                                    </CButton>
                                    <CButton
                                        color="success"
                                        onClick={handleAllProjectsIncomeReportClick}
                                        disabled={downloadingIncome}
                                        className="d-flex align-items-center"
                                        size="sm"
                                    >
                                        {downloadingIncome ? (
                                            <>
                                                <CSpinner size="sm" className="me-1" />
                                                <span className="d-none d-md-inline">Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CIcon icon={cilChart} className="me-1" />
                                                <span className="d-none d-sm-inline">Income Report</span>
                                                <span className="d-inline d-sm-none">Income</span>
                                            </>
                                        )}
                                    </CButton>
                                </div>
                            </div>
                        </div>
                    )}

                    {alert.show && (
                        <CAlert color={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: 'success' })}>
                            {alert.message}
                        </CAlert>
                    )}

                    {/* Work Orders Table */}
                    <div
                        className="table-responsive"
                        style={{
                            maxHeight: '70vh',
                            overflowY: 'auto',
                            overflowX: 'auto',
                            borderRadius: '6px',
                        }}
                    >
                        <CTable striped bordered hover className="mb-0">
                            <CTableHead
                                style={{
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 2,
                                    backgroundColor: '#f8f9fa',
                                    boxShadow: '0 2px 3px rgba(0,0,0,0.05)',
                                }}
                            >
                                <CTableRow>
                                    <CTableHeaderCell>Sr no.</CTableHeaderCell>
                                    <CTableHeaderCell>Work Date</CTableHeaderCell>
                                    <CTableHeaderCell>Machine</CTableHeaderCell>
                                    <CTableHeaderCell>Operator</CTableHeaderCell>
                                    <CTableHeaderCell>Start Reading</CTableHeaderCell>
                                    <CTableHeaderCell>End Reading</CTableHeaderCell>
                                    <CTableHeaderCell>Net Reading</CTableHeaderCell>
                                    <CTableHeaderCell>Mode</CTableHeaderCell>
                                    <CTableHeaderCell>Price Per Hour</CTableHeaderCell>
                                    <CTableHeaderCell className="text-end">Total Price</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map((log, index) => (
                                        <CTableRow key={log.id}>
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{log?.work_date || '-'}</CTableDataCell>
                                            <CTableDataCell>{rows.find((r) => String(r.id) === String(log?.machine_id))?.machine_name || 'N/A'}</CTableDataCell>
                                            <CTableDataCell>{operators.find(op => op.id === Number(log?.operator_id))?.name || 'Unknown Operator'}</CTableDataCell>
                                            <CTableDataCell>{log?.start_reading || '-'}</CTableDataCell>
                                            <CTableDataCell>{log?.end_reading || '-'}</CTableDataCell>
                                            <CTableDataCell>{log?.end_reading && log?.start_reading ? (log.end_reading - log.start_reading) : '-'}</CTableDataCell>
                                            <CTableDataCell>{prices.find(p => p.id === Number(log.mode_id))?.mode || '-'}</CTableDataCell>
                                            <CTableDataCell>₹{log?.price_per_hour || '0'}</CTableDataCell>
                                            <CTableDataCell className="text-end">
                                                ₹{log?.end_reading && log?.start_reading && log?.price_per_hour
                                                    ? ((log.end_reading - log.start_reading) * log.price_per_hour).toFixed(2)
                                                    : '0.00'}
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell colSpan={10} className="text-center text-muted py-4">
                                            No work orders found for this invoice.
                                        </CTableDataCell>
                                    </CTableRow>
                                )}
                                {/* Summary Rows */}
                                <CTableRow className="fw-bold bg-light">
                                    <CTableDataCell colSpan={9} className="text-end">
                                        Grand Total
                                    </CTableDataCell>
                                    <CTableDataCell className="text-end">
                                        ₹{Number(orders?.total || 0).toFixed(2)}
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow className="bg-light">
                                    <CTableDataCell colSpan={9} className="text-end">
                                        Paid Amount
                                    </CTableDataCell>
                                    <CTableDataCell className="text-end text-success">
                                        ₹{Number(orders?.paid_amount || 0).toFixed(2)}
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow className="fw-bold bg-light">
                                    <CTableDataCell colSpan={9} className="text-end">
                                        Remaining Amount
                                    </CTableDataCell>
                                    <CTableDataCell className={`text-end ${remaining > 0 ? 'text-danger' : 'text-success'}`}>
                                        ₹{remaining.toFixed(2)}
                                    </CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </div>

                    {/* Payment Summary Card */}
                    <div className="mt-4 p-3 bg-light rounded">
                        <CRow>
                            <CCol md={4}>
                                <div className="d-flex align-items-center mb-2">
                                    <span className="fw-bold me-2">Total Amount:</span>
                                    <span className="fs-5 fw-bold">₹{Number(orders?.total || 0).toFixed(2)}</span>
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="d-flex align-items-center mb-2">
                                    <span className="fw-bold me-2">Paid Amount:</span>
                                    <span className="fs-5 fw-bold text-success">₹{Number(orders?.paid_amount || 0).toFixed(2)}</span>
                                </div>
                            </CCol>
                            <CCol md={4}>
                                <div className="d-flex align-items-center mb-2">
                                    <span className="fw-bold me-2">Remaining:</span>
                                    <span className={`fs-5 fw-bold ${remaining > 0 ? 'text-danger' : 'text-success'}`}>
                                        ₹{remaining.toFixed(2)}
                                    </span>
                                </div>
                            </CCol>
                        </CRow>
                        {orders.payment_mode && (
                            <div className="mt-2 pt-2 border-top">
                                <div className="">
                                    <span className="fw-bold me-2">Payment Mode:</span>
                                    <CBadge color="info" className="fs-6">{orders.payment_mode}</CBadge>
                                </div>
                            </div>
                        )}
                    </div>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default OrderList;