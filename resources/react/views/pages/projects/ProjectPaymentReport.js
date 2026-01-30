import React, { useEffect, useState, useMemo } from 'react';
import {
    CBadge, CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow,
    CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
    CSpinner, CInputGroup, CInputGroupText, CModal, CModalHeader, CModalTitle,
    CModalBody, CModalFooter
} from '@coreui/react';
import { CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilAperture, cilHistory, cilMoney, cilCloudDownload } from '@coreui/icons';
import { useToast } from '../../common/toast/ToastContext';
import { getAPICall, postAPICall, put } from '../../../util/api';
import OrderList from './OrderList';
import AdvanceInvoice from './AdvanceInvoice';
import { getUserData } from '../../../util/session';
import html2pdf from 'html2pdf.js';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
    </svg>
);

const ProjectPaymentReport = () => {
    const { showToast } = useToast();

    // -------------------------------------------------
    // 1. Current company (from session)
    // -------------------------------------------------
    const companyId = getUserData()?.company_id;
    if (!companyId) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <p className="text-muted">Unable to determine company. Please log in again.</p>
            </div>
        );
    }

    // -------------------------------------------------
    // 2. State
    // -------------------------------------------------
    const [payments, setPayments] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [showRepaymentModal, setShowRepaymentModal] = useState(false);
    const [repaymentAmount, setRepaymentAmount] = useState('');
    const [projectId, setProjectId] = useState(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [payAmount, setPayAmount] = useState('');
    const [remark, setRemark] = useState('');
    // Advance-payment modal
    const [showAdvanceModal, setShowAdvanceModal] = useState(false);
    const [advanceCustomer, setAdvanceCustomer] = useState('');
    const [advanceAmount, setAdvanceAmount] = useState('');
    const [allCustomers, setAllCustomers] = useState([]);

    const [isClearingAdvance, setIsClearingAdvance] = useState(false);
    const [showAdvanceInvoiceModal, setShowAdvanceInvoiceModal] = useState(false);
    const [additionalAmount, setAdditionalAmount] = useState('');
    const [useAdvance, setUseAdvance] = useState(false);

    const [hours, setHours] = useState('');
    const [projects, setProjects] = useState([]);
    const [projectWiseHours, setProjectWiseHours] = useState([]);

    // Additional charges
    const [showAdditionalChargesModal, setShowAdditionalChargesModal] = useState(false);
    const [selectedPaymentForCharges, setSelectedPaymentForCharges] = useState(null);


    // -------------------------------------------------
    // 3. Data fetching (company-scoped)
    // -------------------------------------------------
    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const resp = await getAPICall(`/api/project-payments?company_id=${companyId}`);
            setPayments(Array.isArray(resp) ? resp : []);
        } catch (err) {
            showToast('danger', 'Error fetching project payments: ' + (err?.message || err));
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMachineHours = async () => {
        setIsLoading(true);
        try {
            const resp = await getAPICall(`/api/project-wise-hours`);
            setProjectWiseHours(resp.project_wise_hours || []);
            console.log('machine hourse', resp.project_wise_hours);
        } catch (err) {
            showToast('danger', 'Error fetching Hours: ' + (err?.message || err));
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllCustomers = async () => {
        try {
            const resp = await getAPICall('/api/projects');
            if (!Array.isArray(resp)) {
                setAllCustomers([]);
                return;
            }

            const unique = {};
            resp.forEach(proj => {
                // ---- filter by company ----
                if (proj.company_id !== companyId) return;

                const name = proj.customer_name?.trim();
                if (!name) return;

                if (!unique[name]) {
                    unique[name] = { name, mobile: proj.mobile_number || '', projects: [] };
                }
                unique[name].projects.push({ id: proj.id, company_id: proj.company_id });
            });
            setAllCustomers(Object.values(unique));
        } catch (err) {
            console.error(err);
            setAllCustomers([]);
        }
    };

    const fetchHistory = async () => {
        if (!projectId) return;
        setIsLoading(true);
        try {
            const resp = await getAPICall(
                `/api/repayments?company_id=${companyId}&project_id=${projectId}`
            );
            setHistoryData(Array.isArray(resp) ? resp : []);
        } catch (err) {
            showToast('danger', 'Error fetching history: ' + (err?.message || err));
        } finally {
            setIsLoading(false);
        }
    };

    // -------------------------------------------------
    // 4. Effects
    // -------------------------------------------------
    useEffect(() => {
        fetchPayments();
        fetchAllCustomers();
        fetchMachineHours()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyId]);

    useEffect(() => {
        if (projectId) fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, companyId]);

    // -------------------------------------------------
    // 5. Helpers
    // -------------------------------------------------
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-GB');
    };

    const formatCurrency = (value) => `₹${Number(value || 0).toFixed(2)}`;

    const formatChargeType = (chargeType) => {
        const chargeTypeMap = {
            'travelling_charge': 'Travelling Charges',
            'service_charge': 'Service Charges',
            'other_charge': 'Other Charges'
        };

        return chargeTypeMap[chargeType] || chargeType;
    };

    // -------------------------------------------------
    // 6. Memoised company-only data
    // -------------------------------------------------
    const companyPayments = useMemo(() => {
        return payments.filter(p => p.company_id === companyId);
    }, [payments, companyId]);


    //memoised project wise data
    const projectHoursMap = useMemo(() => {
        const map = {};
        projectWiseHours.forEach(item => {
            map[Number(item.project_id)] = Number(item.total_hours || 0);
        });
        return map;
    }, [projectWiseHours]);

    const totalWorkingHours = useMemo(() => {
        return projectWiseHours.reduce((sum, item) => {
            return sum + Number(item.total_hours || 0);
        }, 0);
    }, [projectWiseHours]);

    const getCustomerHours = (records) => {
        // records = all payment records of ONE customer

        // 1️⃣ Extract unique project IDs
        const projectIds = [
            ...new Set(
                records
                    .map(r => r.project?.id)
                    .filter(Boolean)
            )
        ];

        // 2️⃣ Sum hours for those projects
        return projectIds.reduce((sum, pid) => {
            return sum + (projectHoursMap[pid] || 0);
        }, 0);
    };

    const groupedCustomers = useMemo(() => {
        const groups = {};
        companyPayments.forEach(p => {
            const cust = p.project?.customer_name || 'Unknown';
            if (!groups[cust]) groups[cust] = [];
            groups[cust].push(p);
        });

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            return Object.fromEntries(
                Object.entries(groups).filter(([c]) => c.toLowerCase().includes(lower))
            );
        }
        return groups;
    }, [companyPayments, searchTerm]);

    const summaryStats = useMemo(() => {
        const customerEntries = Object.values(groupedCustomers);
        const flattened = customerEntries.flat();
        const nonAdvancePayments = flattened.filter(p => !p.is_advance);

        const customerCount = customerEntries.length;
        const totalInvoices = flattened.length;
        const totalBilled = nonAdvancePayments.reduce((sum, p) => sum + Number(p.total || 0), 0);
        const totalPaid = nonAdvancePayments.reduce((sum, p) => sum + Number(p.paid_amount || 0), 0);
        const totalOutstanding = totalBilled - totalPaid;

        return {
            customerCount,
            totalInvoices,
            totalBilled,
            totalPaid,
            totalOutstanding,
        };
    }, [groupedCustomers]);

    // -------------------------------------------------
    // 7. Loading spinner
    // -------------------------------------------------
    if (isLoading && !payments.length) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <CSpinner color="primary" size="lg" />
                <p className="mt-3 text-muted">Loading project payments...</p>
            </div>
        );
    }

    // -------------------------------------------------
    // 8. Payment update (single invoice)
    // -------------------------------------------------
    const callPayment = async () => {
        if (!selectedPayment) return;

        const cashAmt = Number(payAmount) || 0;
        const advAmt = useAdvance ? (Number(advanceAmount) || 0) : 0;
        const totalPay = cashAmt + advAmt;

        // Validation
        const remaining = Number(selectedPayment.total) - Number(selectedPayment.paid_amount);

        if (totalPay <= 0) return showToast('danger', 'Total payment must be greater than 0');
        if (totalPay > remaining + 0.01) return showToast('danger', 'Total amount exceeds remaining balance');
        if (useAdvance && advAmt > advancePaid) return showToast('danger', 'Advance amount exceeds available balance');

        try {
            const payload = {
                company_id: companyId,
                project_id: selectedPayment.project_id,
                invoice_id: selectedPayment.invoice_number, // NEW: filter for strict invoice targeting
                payment: cashAmt,
                advance_used: advAmt,
                payment_mode: 'Cash',
            };

            await postAPICall('/api/repayments', payload);

            showToast('success', 'Payment recorded successfully');
            setShowPaymentModal(false);
            setPayAmount('');
            setRemark('');
            setAdvanceAmount('');
            setUseAdvance(false);
            fetchPayments();
            if (projectId) fetchHistory();
        } catch (e) {
            console.error('Payment update error:', e);
            showToast('danger', 'Failed to update payment: ' + (e?.message || e));
        }
    };




    const getCustomerTotalHours = (customerProjects) => {
        return customerProjects.reduce((sum, proj) => {
            return sum + (projectHoursMap[proj.id] || 0);
        }, 0);
    };




    // -------------------------------------------------
    // 9. Customer list view
    // -------------------------------------------------
    if (!selectedCustomer) {
        return (
            <>
                <CRow>
                    <CCol xs={12}>
                        <CCard className="shadow-sm">
                            <CCardHeader className="bg-light d-flex justify-content-between align-items-center">
                                <div>
                                    <strong className="fs-5">Customers Payment Report</strong>
                                    <CBadge color="info" className="ms-2">
                                        {summaryStats.customerCount} customers
                                    </CBadge>
                                </div>
                                {/* <CButton color="primary" size="sm" onClick={() => setShowAdvanceModal(true)}>
                                    Advance Payment
                                </CButton> */}
                            </CCardHeader>

                            <CCardBody>
                                {/* Search */}
                                <CRow className="mb-2">
                                    <CCol xs={12} md={6}>
                                        <CInputGroup>
                                            <CInputGroupText>Search</CInputGroupText>
                                            <CFormInput
                                                placeholder="Search by customer name..."
                                                value={searchInput}
                                                onChange={e => {
                                                    setSearchInput(e.target.value);
                                                    setSearchTerm(e.target.value);
                                                }}
                                            />
                                        </CInputGroup>
                                    </CCol>
                                    {searchTerm && (
                                        <CCol xs={12} md={3} className="mt-2 mt-md-0">
                                            <CButton
                                                color="light"
                                                size="sm"
                                                onClick={() => {
                                                    setSearchInput('');
                                                    setSearchTerm('');
                                                }}
                                            >
                                                Clear
                                            </CButton>
                                        </CCol>
                                    )}
                                </CRow>

                                {/* Summary cards */}
                                <CRow className="g-2 mb-3">
                                    <CCol xs={6} md={3}>
                                        <div className="rounded p-2 text-center bg-primary text-white shadow-sm">
                                            <small className="d-block">Invoices</small>
                                            <strong className="fs-6">{summaryStats.totalInvoices}</strong>
                                        </div>
                                    </CCol>
                                    <CCol xs={6} md={3}>
                                        <div className="rounded p-2 text-center bg-success text-white shadow-sm">
                                            <small className="d-block">Total Billed ({totalWorkingHours}hrs.)</small>
                                            <strong className="fs-6">{formatCurrency(summaryStats.totalBilled)}</strong>
                                        </div>
                                    </CCol>
                                    <CCol xs={6} md={3}>
                                        <div className="rounded p-2 text-center bg-warning text-dark shadow-sm">
                                            <small className="d-block">Paid</small>
                                            <strong className="fs-6">{formatCurrency(summaryStats.totalPaid)}</strong>
                                        </div>
                                    </CCol>
                                    <CCol xs={6} md={3}>
                                        <div className="rounded p-2 text-center bg-info text-white shadow-sm">
                                            <small className="d-block">Outstanding</small>
                                            <strong className="fs-6">{formatCurrency(summaryStats.totalOutstanding)}</strong>
                                        </div>
                                    </CCol>
                                </CRow>

                                {/* Table */}
                                <div className="table-responsive">
                                    <CTable striped hover bordered>
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell className="text-center align-middle">Sr. No.</CTableHeaderCell>
                                                <CTableHeaderCell className="text-center align-middle">Customer Name</CTableHeaderCell>
                                                <CTableHeaderCell className="text-center align-middle">Hours</CTableHeaderCell>
                                                <CTableHeaderCell className="text-center align-middle">Total</CTableHeaderCell>
                                                <CTableHeaderCell className="text-center align-middle">Paid</CTableHeaderCell>
                                                <CTableHeaderCell className="text-center align-middle">Remaining</CTableHeaderCell>
                                                <CTableHeaderCell className="text-center align-middle">Action</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {Object.entries(groupedCustomers).map(([cust, recs], idx) => {
                                                // Exclude advance payments (is_advance == 1) from calculations
                                                const nonAdvancePayments = recs.filter(p => !p.is_advance);
                                                const total = nonAdvancePayments.reduce((s, p) => s + Number(p.total || 0), 0);
                                                const paid = nonAdvancePayments.reduce((s, p) => s + Number(p.paid_amount || 0), 0);
                                                const rem = total - paid;
                                                const totalHours = getCustomerHours(recs);

                                                return (
                                                    <CTableRow key={cust}>
                                                        <CTableDataCell>{idx + 1}</CTableDataCell>
                                                        <CTableDataCell>{cust}</CTableDataCell>
                                                        <CTableDataCell style={{ color: totalHours < 0 ? 'red' : 'blue', fontWeight: 600 }}>
                                                            {totalHours}</CTableDataCell>
                                                        <CTableDataCell className="text-end">₹{total.toFixed(2)}</CTableDataCell>
                                                        <CTableDataCell className="text-success fw-bold text-end">₹{paid.toFixed(2)}</CTableDataCell>
                                                        <CTableDataCell className="text-danger fw-bold text-end">₹{rem.toFixed(2)}</CTableDataCell>
                                                        <CTableDataCell className="text-center">
                                                            <CButton
                                                                size="sm"
                                                                color="info"
                                                                onClick={() => {
                                                                    setSelectedCustomer(cust);
                                                                    setProjectId(recs[0].project_id);
                                                                }}
                                                            >
                                                                View Invoices
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                );
                                            })}
                                        </CTableBody>
                                    </CTable>
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>

                {/* Advance Payment Modal */}
                <CModal visible={showAdvanceModal} onClose={() => {
                    setShowAdvanceModal(false);
                    setAdvanceCustomer('');
                    setAdvanceAmount('');
                }}>
                    <CModalHeader><CModalTitle>Advance Payment</CModalTitle></CModalHeader>
                    <CModalBody>
                        <div className="mb-3">
                            <label className="form-label">Customer</label>
                            <select className="form-select" value={advanceCustomer} onChange={e => setAdvanceCustomer(e.target.value)}>
                                <option value="">-- Select --</option>
                                {allCustomers.map(c => (
                                    <option key={c.name} value={c.name}>
                                        {c.name} {c.mobile ? `(${c.mobile})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Amount</label>
                            <CFormInput
                                type="number"
                                placeholder="Enter amount"
                                value={advanceAmount}
                                onChange={e => setAdvanceAmount(e.target.value)}
                                min="0"
                            />
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setShowAdvanceModal(false)}>Cancel</CButton>
                        <CButton color="primary" onClick={async () => {
                            if (!advanceCustomer) return showToast('danger', 'Select a customer');
                            const amt = Number(advanceAmount);
                            if (!amt || amt <= 0) return showToast('danger', 'Enter a valid amount');

                            const cust = allCustomers.find(c => c.name === advanceCustomer);
                            if (!cust?.projects?.length) return showToast('danger', 'No project for this customer');

                            const { id: projId, company_id: compId } = cust.projects[0];
                            try {
                                await postAPICall('/api/advance-payment', {
                                    company_id: compId,
                                    project_id: projId,
                                    amount: amt,
                                });
                                showToast('success', 'Advance payment recorded');
                                setShowAdvanceModal(false);
                                setAdvanceCustomer('');
                                setAdvanceAmount('');
                                fetchPayments();
                            } catch (e) {
                                showToast('danger', 'Failed: ' + (e?.message || 'Unknown error'));
                            }
                        }}>
                            Submit
                        </CButton>
                    </CModalFooter>
                </CModal>
            </>
        );
    }

    // -------------------------------------------------
    // 10. Selected customer invoice view
    // -------------------------------------------------
    const customerPayments = groupedCustomers[selectedCustomer] || [];
    // Exclude advance payments (is_advance == 1) from total and paid calculations
    const nonAdvancePayments = customerPayments.filter(p => !p.is_advance);
    const total = nonAdvancePayments.reduce((s, p) => s + Number(p.total || 0), 0);
    const paid = nonAdvancePayments.reduce((s, p) => s + Number(p.paid_amount || 0), 0);
    const remaining = total - paid;

    // Calculate advance paid from repayments where is_advance == 1 and advance_taken == 0
    const advancePaid = (historyData || [])
        .filter(r => r.is_advance && !r.advance_taken)
        .reduce((sum, r) => sum + Number(r.payment || 0), 0);


    const handleRepaymentSubmit = async () => {
        const cashAmt = Number(additionalAmount) || 0;
        const advAmt = useAdvance ? (Number(advanceAmount) || 0) : 0;
        const totalPay = cashAmt + advAmt;

        if (totalPay <= 0) return showToast('danger', 'Total payment must be greater than 0');
        if (totalPay > remaining) return showToast('danger', 'Total amount exceeds remaining balance');

        // Backend Validation Pre-check (Optional but good UX)
        if (useAdvance && advAmt > advancePaid) return showToast('danger', 'Advance amount exceeds available balance');

        try {
            // Updated to use Single Transaction endpoint
            // Payload includes both cash payment and advance used
            const payload = {
                company_id: companyId,
                project_id: projectId,
                invoice_id: null, // This is project-level repayment? Wait, 'repayment/single' in Controller doesn't take invoice_id logic for project level?
                // Wait, ProjectPaymentReport.js logic was: `projectId` is selected (line 479).
                // `handleRepaymentSubmit` sends `{ project_id: projectId }`.
                // The backend `createSingleRepayment` (lines 505-530) took `invoice_id` as required??
                // BUT current `handleRepaymentSubmit` (line 586) sends: `{ project_id: projectId, payment: totalPay }`.
                // It does NOT send `invoice_id`.
                // Let's check `createSingleRepayment` validation again.
                // Line 512: `'invoice_id' => 'required'`. 
                // So the current frontend code `await postAPICall('/api/repayments', ...)` call at line 586 must be hitting `RepaymentController::store` (line 227) or similar?
                // Line 77 routes `/api/repayments` to `store`.
                // Line 72 routes `/api/repayment/single` to `createSingleRepayment`.
                // 
                // The existing code called `/api/repayments` (PLURAL).
                // The `store` method (line 227) handles allocation across invoices. 
                // That is the correct one for "Payment at Project Level" leading to auto-allocation.
                //
                // The NEW Feature "Record Payment" is also at project level (allocating to oldest invoice?).
                // "Record Payment" is inside `ProjectPaymentReport.js`.
                // It seems to be project-level payment.
                //
                // So I should continue using `/api/repayments` (handled by `store`) BUT update `store` to handle `advance_used`?
                // The user said "backend logic ... Update advance payment invoice/record".
                // 
                // I will use `/api/repayments` (PLURAL) and add `advance_used` to payload.

                payment: cashAmt,
                advance_used: advAmt,
                // remark: remark // Add remark if needed, UI doesn't have it in this modal currently, maybe add later or ignore.
            };

            await postAPICall('/api/repayments', payload);

            showToast('success', 'Payment recorded successfully');
            setShowRepaymentModal(false);
            setAdditionalAmount('');
            setAdvanceAmount('');
            setUseAdvance(false);
            fetchPayments();
            fetchHistory();
        } catch (e) {
            console.error('Repayment error:', e);
            showToast('danger', 'Error: ' + (e?.message || e));
        }
    };

    // const handleDownloadHistoryPDF = async () => {
    //     const payment = payments.find(p => p.invoice_number === selectedInvoice);
    //     if (!payment) return;

    //     const filteredHistory = historyData.filter(e => e?.invoice_id === selectedInvoice);
    //     if (filteredHistory.length === 0) {
    //         showToast('warning', 'No history to download');
    //         return;
    //     }

    //     const ci = getUserData()?.company_info;
    //     if (!ci) {
    //         alert('Company information not found. Please log in again.');
    //         return;
    //     }

    //     const customerName = payment.project?.customer_name || 'N/A';
    //     const invoiceType = payment.is_fixed_bid == 1 ? 'FIXED BID INVOICE' : 'INVOICE';
    //     const totalAmount = Number(payment.total || 0).toFixed(2);
    //     const paidAmount = Number(payment.paid_amount || 0).toFixed(2);
    //     const remainingAmount = (Number(payment.total) - Number(payment.paid_amount)).toFixed(2);

    //     // Build history rows
    //     const historyRows = filteredHistory.map((item, index) => `
    //         <tr>
    //             <td style="border: 1px solid #dee2e6; padding: 8px; text-align: center;">${index + 1}</td>
    //             <td style="border: 1px solid #dee2e6; padding: 8px; text-align: center;">
    //                 ${item?.date ? item.date.slice(0, 10).split('-').reverse().join('-') : '-'}
    //             </td>
    //             <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">₹${Number(item.payment).toFixed(2)}</td>
    //             <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">₹${Number(item.remaining).toFixed(2)}</td>
    //         </tr>
    //     `).join('');

    //     const pdfContent = `
    //         <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
    //             <!-- Header Section -->
    //             <div style="border-bottom: 3px solid #0d6efd; padding-bottom: 20px; margin-bottom: 20px;">
    //                 <div style="display: flex; justify-content: space-between; align-items: center;">
    //                     <div style="flex: 1;">
    //                         ${ci.logo ? `<img src="/img/${ci.logo}" alt="Logo" style="max-width: 120px; height: auto;" />` : ''}
    //                     </div>
    //                     <div style="text-align: right; flex: 1;">
    //                         <h2 style="margin: 0; color: #333; font-size: 24px;">${ci.company_name || ''}</h2>
    //                         <p style="margin: 5px 0; color: #666; font-size: 14px;">${ci.land_mark || ''}, ${ci.Tal || ''}, ${ci.Dist || ''}</p>
    //                         <p style="margin: 5px 0; color: #666; font-size: 14px;">Pincode: ${ci.pincode || ''}</p>
    //                         <p style="margin: 5px 0; color: #666; font-size: 14px;">Phone: ${ci.phone_no || ''}</p>
    //                     </div>
    //                 </div>
    //             </div>

    //             <!-- Title -->
    //             <div style="text-align: center; background-color: #0d6efd; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
    //                 <h2 style="margin: 0; color: #fff; font-size: 20px;">PAYMENT HISTORY - ${invoiceType}</h2>
    //             </div>

    //             <!-- Invoice & Customer Details -->
    //             <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
    //                 <div style="flex: 1;">
    //                     <h3 style="color: #333; border-bottom: 2px solid #0d6efd; padding-bottom: 5px; margin-bottom: 10px;">Invoice Details</h3>
    //                     <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${payment.invoice_number}</p>
    //                     <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(payment.created_at)}</p>
    //                     <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
    //                     <p style="margin: 5px 0;"><strong>Paid Amount:</strong> ₹${paidAmount}</p>
    //                     <p style="margin: 5px 0;"><strong>Remaining:</strong> ₹${remainingAmount}</p>
    //                 </div>
    //                 <div style="flex: 1;">
    //                     <h3 style="color: #333; border-bottom: 2px solid #0d6efd; padding-bottom: 5px; margin-bottom: 10px;">Customer Details</h3>
    //                     <p style="margin: 5px 0;"><strong>Customer Name:</strong> ${customerName}</p>
    //                     <p style="margin: 5px 0;"><strong>Mobile:</strong> ${payment.project?.mobile_number || '-'}</p>
    //                     <p style="margin: 5px 0;"><strong>Site:</strong> ${payment.project?.work_place || '-'}</p>
    //                 </div>
    //             </div>

    //             <!-- History Table -->
    //             <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
    //                 <thead>
    //                     <tr style="background-color: #f8f9fa;">
    //                         <th style="border: 1px solid #dee2e6; padding: 10px; text-align: center;">Sr. No.</th>
    //                         <th style="border: 1px solid #dee2e6; padding: 10px; text-align: center;">Date</th>
    //                         <th style="border: 1px solid #dee2e6; padding: 10px; text-align: right;">Paid Amount</th>
    //                         <th style="border: 1px solid #dee2e6; padding: 10px; text-align: right;">Remaining</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     ${historyRows}
    //                 </tbody>
    //             </table>

    //             <!-- Footer -->
    //             <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6; text-align: center; color: #666; font-size: 12px;">
    //                 <p>This is a computer-generated document and is valid without signature.</p>
    //             </div>
    //         </div>
    //     `;

    //     const element = document.createElement('div');
    //     element.innerHTML = pdfContent;

    //     const options = {
    //         margin: [10, 10, 10, 10],
    //         filename: `History-${payment.invoice_number}-${customerName}.pdf`,
    //         image: { type: 'jpeg', quality: 0.98 },
    //         html2canvas: { scale: 2, useCORS: true },
    //         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    //     };

    //     try {
    //         await html2pdf().set(options).from(element).save();
    //         showToast('success', 'History PDF downloaded successfully');
    //     } catch (error) {
    //         console.error('PDF generation error:', error);
    //         showToast('danger', 'Failed to generate PDF');
    //     }
    // };

    const handleDownloadHistoryPDF = async () => {
        const payment = payments.find(p => p.invoice_number === selectedInvoice);
        if (!payment) return;

        const filteredHistory = historyData.filter(e => e?.invoice_id === selectedInvoice);
        if (filteredHistory.length === 0) {
            showToast('warning', 'No history to download');
            return;
        }

        const ci = getUserData()?.company_info;
        if (!ci) {
            alert('Company information not found. Please log in again.');
            return;
        }

        const customerName = payment.project?.customer_name || 'N/A';
        const invoiceType = payment.is_fixed_bid == 1 ? 'FIXED BID INVOICE' : 'INVOICE';
        const totalAmount = Number(payment.total || 0).toFixed(2);
        const paidAmount = Number(payment.paid_amount || 0).toFixed(2);
        const remainingAmount = (Number(payment.total) - Number(payment.paid_amount)).toFixed(2);

        // ✅ Build history rows with corrected remaining calculation
        let cumulativePaid = 0;
        const invoiceTotal = Number(payment.total || 0);

        const historyRows = filteredHistory.map((item, index) => {
            cumulativePaid += Number(item.payment || 0);
            const calculatedRemaining = invoiceTotal - cumulativePaid;

            return `
            <tr>
                <td style="border: 1px solid #dee2e6; padding: 8px; text-align: center;">${index + 1}</td>
                <td style="border: 1px solid #dee2e6; padding: 8px; text-align: center;">
                    ${item?.date ? item.date.slice(0, 10).split('-').reverse().join('-') : '-'}
                </td>
                <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">₹${Number(item.payment).toFixed(2)}</td>
                <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">₹${calculatedRemaining.toFixed(2)}</td>
            </tr>
        `;
        }).join('');

        const pdfContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
            <!-- Header Section -->
            <div style="border-bottom: 3px solid #0d6efd; padding-bottom: 20px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        ${ci.logo ? `<img src="/img/${ci.logo}" alt="Logo" style="max-width: 120px; height: auto;" />` : ''}
                    </div>
                    <div style="text-align: right; flex: 1;">
                        <h2 style="margin: 0; color: #333; font-size: 24px;">${ci.company_name || ''}</h2>
                        <p style="margin: 5px 0; color: #666; font-size: 14px;">${ci.land_mark || ''}, ${ci.Tal || ''}, ${ci.Dist || ''}</p>
                        <p style="margin: 5px 0; color: #666; font-size: 14px;">Pincode: ${ci.pincode || ''}</p>
                        <p style="margin: 5px 0; color: #666; font-size: 14px;">Phone: ${ci.phone_no || ''}</p>
                    </div>
                </div>
            </div>

            <!-- Title -->
            <div style="text-align: center; background-color: #0d6efd; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
                <h2 style="margin: 0; color: #fff; font-size: 20px;">PAYMENT HISTORY - ${invoiceType}</h2>
            </div>

            <!-- Invoice & Customer Details -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                <div style="flex: 1;">
                    <h3 style="color: #333; border-bottom: 2px solid #0d6efd; padding-bottom: 5px; margin-bottom: 10px;">Invoice Details</h3>
                    <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${payment.invoice_number}</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(payment.created_at)}</p>
                    <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
                    <p style="margin: 5px 0;"><strong>Paid Amount:</strong> ₹${paidAmount}</p>
                    <p style="margin: 5px 0;"><strong>Remaining:</strong> ₹${remainingAmount}</p>
                </div>
                <div style="flex: 1;">
                    <h3 style="color: #333; border-bottom: 2px solid #0d6efd; padding-bottom: 5px; margin-bottom: 10px;">Customer Details</h3>
                    <p style="margin: 5px 0;"><strong>Customer Name:</strong> ${customerName}</p>
                    <p style="margin: 5px 0;"><strong>Mobile:</strong> ${payment.project?.mobile_number || '-'}</p>
                    <p style="margin: 5px 0;"><strong>Site:</strong> ${payment.project?.work_place || '-'}</p>
                </div>
            </div>

            <!-- History Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="border: 1px solid #dee2e6; padding: 10px; text-align: center;">Sr. No.</th>
                        <th style="border: 1px solid #dee2e6; padding: 10px; text-align: center;">Date</th>
                        <th style="border: 1px solid #dee2e6; padding: 10px; text-align: right;">Paid Amount</th>
                        <th style="border: 1px solid #dee2e6; padding: 10px; text-align: right;">Remaining</th>
                    </tr>
                </thead>
                <tbody>
                    ${historyRows}
                </tbody>
            </table>

            <!-- Footer -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6; text-align: center; color: #666; font-size: 12px;">
                <p>This is a computer-generated document and is valid without signature.</p>
            </div>
        </div>
    `;

        const element = document.createElement('div');
        element.innerHTML = pdfContent;

        const options = {
            margin: [10, 10, 10, 10],
            filename: `History-${payment.invoice_number}-${customerName}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        try {
            await html2pdf().set(options).from(element).save();
            showToast('success', 'History PDF downloaded successfully');
        } catch (error) {
            console.error('PDF generation error:', error);
            showToast('danger', 'Failed to generate PDF');
        }
    };



    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="shadow-sm">
                        <CCardHeader className="bg-light d-flex justify-content-between align-items-center flex-wrap">
                            <div>
                                <strong className="fs-5">Invoices for {selectedCustomer}</strong>
                                <CBadge color="info" className="ms-2">{customerPayments.length} entries</CBadge>
                            </div>
                            <div className="d-flex gap-2 mt-2 mt-md-0">
                                <CButton color="success" onClick={() => {
                                    setShowRepaymentModal(true);
                                    // Logic to auto-select advance if applicable
                                    const canUseAdvance = advancePaid > 0 && advancePaid <= remaining;
                                    setUseAdvance(canUseAdvance);
                                    setAdditionalAmount('');
                                }}>
                                    Record Payment
                                </CButton>
                                <CButton color="secondary" size="sm" onClick={() => setSelectedCustomer(null)}>
                                    Back
                                </CButton>
                            </div>
                        </CCardHeader>

                        <CCardBody>
                            {/* Summary cards */}
                            <CRow className="g-2 mb-2">
                                {/* <CCol xs={6} md={3}>
                                    <div className="p-2 rounded bg-primary text-center text-white shadow-sm">
                                        <small>Total Payments</small>
                                        <div className="fw-semibold fs-6 mt-1">{customerPayments.length}</div>
                                    </div>
                                </CCol> */}
                                <CCol xs={6} md={3}>
                                    <div className="p-2 rounded bg-primary text-center text-white shadow-sm">
                                        <small>Total</small>
                                        <div className="fw-semibold fs-6 mt-1">₹{total.toFixed(2)}</div>
                                    </div>
                                </CCol>
                                <CCol xs={6} md={3}>
                                    <div className="p-2 rounded bg-success text-center text-white shadow-sm">
                                        <small>Paid</small>
                                        <div className="fw-semibold fs-6 mt-1">₹{paid.toFixed(2)}</div>
                                    </div>
                                </CCol>
                                <CCol xs={6} md={3}>
                                    <div className="p-2 rounded bg-danger text-center text-white shadow-sm">
                                        <small>Remaining</small>
                                        <div className="fw-semibold fs-6 mt-1">₹{remaining.toFixed(2)}</div>
                                    </div>
                                </CCol>
                                <CCol xs={6} md={3}>
                                    <div className="p-2 rounded bg-secondary text-center text-white shadow-sm">
                                        <small>Advance</small>
                                        <div className="fw-semibold fs-6 mt-1">₹{advancePaid.toFixed(2)}</div>
                                    </div>
                                </CCol>
                            </CRow>


                            {/* Invoices table */}
                            <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <CTable hover bordered>
                                    <CTableHead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa' }}>
                                        <CTableRow>
                                            <CTableHeaderCell className="text-center align-middle">Sr. No.</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle">Invoice</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle">Date</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle">Total</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle">Paid</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle" >Remaining</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle">Mode</CTableHeaderCell>
                                            {/* <CTableHeaderCell className="text-center align-middle">Add. Charges</CTableHeaderCell> */}
                                            <CTableHeaderCell className="text-center align-middle">Action</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {customerPayments
                                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                            .map((p, i) => {
                                                const rem = (Number(p.total) - Number(p.paid_amount)).toFixed(2);
                                                return (
                                                    <CTableRow
                                                        key={p.id}
                                                        className={p.is_advance == 1 ? "table-primary" : p.is_fixed_bid == 1 ? "table-warning" : ""} // Bootstrap v5 utility
                                                    >
                                                        <CTableDataCell>{i + 1}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {p.is_advance == 1 ? "Advance Payment" :
                                                                p.invoice_number}
                                                        </CTableDataCell>
                                                        <CTableDataCell className="text-center align-middle">{formatDate(p.created_at)}</CTableDataCell>
                                                        <CTableDataCell className="text-end fw-bold">₹{Number(p.total).toFixed(2)}</CTableDataCell>
                                                        <CTableDataCell className="text-success fw-bold text-end">₹{Number(p.paid_amount).toFixed(2)}</CTableDataCell>
                                                        <CTableDataCell className="text-danger fw-bold text-end">₹{rem}</CTableDataCell>
                                                        <CTableDataCell>{p.payment_mode || '-'}</CTableDataCell>
                                                        {/* <CTableDataCell className="text-center">
                                                            {p.additional_charges_total > 0 ? (
                                                                <CTooltip content={`Paid: ₹${Number(p.additional_charges_paid || 0).toFixed(2)} / Total: ₹${Number(p.additional_charges_total).toFixed(2)}`}>
                                                                    <CBadge color={p.additional_charges_paid >= p.additional_charges_total ? "success" : "warning"}>
                                                                        ₹{Number(p.additional_charges_total).toFixed(2)}
                                                                    </CBadge>
                                                                </CTooltip>
                                                            ) : '-'}
                                                        </CTableDataCell> */}
                                                        <CTableDataCell className="text-center">
                                                            <div className="d-flex justify-content-center gap-1">
                                                                {p.is_advance == 0 && (<CTooltip content="Add Payment" placement="top">
                                                                    <CButton
                                                                        color="success"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setSelectedPayment(p);
                                                                            setShowPaymentModal(true);
                                                                        }}
                                                                    >
                                                                        <CIcon icon={cilMoney} />
                                                                    </CButton>
                                                                </CTooltip>)}

                                                                {p.is_advance == 0 && (<CTooltip content="Payment History" placement="top">
                                                                    <CButton
                                                                        color="info"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setSelectedInvoice(p.invoice_number);
                                                                            setShowHistoryModal(true);
                                                                        }}
                                                                    >
                                                                        <CIcon icon={cilHistory} />
                                                                    </CButton>
                                                                </CTooltip>)}

                                                                <CTooltip content={p.is_advance == 1 ? 'View Advance Invoice' : p.is_fixed_bid == 1 ? 'View Fixed Bid Invoice' : 'View Invoice'} placement="top">
                                                                    <CButton
                                                                        color={p.is_advance == 1 || p.is_fixed_bid == 1 ? 'warning' : 'secondary'}
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            if (p.is_advance == 1 || p.is_fixed_bid == 1) {
                                                                                // Open Advance Invoice modal (reusing for fixed bid for now if structure is same, or just view)
                                                                                // For now, let's treat it same as advance invoice view
                                                                                setSelectedProjectId(p.id);
                                                                                setShowAdvanceInvoiceModal(true);
                                                                            } else {
                                                                                // Normal Invoice
                                                                                setSelectedProjectId(p.id);
                                                                                setShowOrderModal(true);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <EyeIcon />
                                                                    </CButton>
                                                                </CTooltip>
                                                                {/* {p.additional_charges_total > 0 && (
                                                                    <CTooltip content="View Additional Charges" placement="top">
                                                                        <CButton
                                                                            color="warning"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                setSelectedPaymentForCharges(p);
                                                                                setShowAdditionalChargesModal(true);
                                                                            }}
                                                                        >
                                                                            <CIcon icon={cilMoney} />
                                                                        </CButton>
                                                                    </CTooltip>
                                                                )} */}
                                                            </div>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                );
                                            })}
                                    </CTableBody>
                                </CTable>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Advance Invoice Modal */}
            <CModal
                visible={showAdvanceInvoiceModal}
                onClose={() => setShowAdvanceInvoiceModal(false)}
                size="xl"
                backdrop="static"
            >
                <CModalHeader>
                    <CModalTitle>
                        {payments.find(p => p.id === selectedProjectId)?.is_fixed_bid == 1
                            ? 'Fixed Bid Invoice'
                            : 'Advance Invoice'}
                    </CModalTitle>
                </CModalHeader>
                <CModalBody style={{ overflowY: 'visible', padding: 0 }}>
                    <AdvanceInvoice paymentId={selectedProjectId} />
                </CModalBody>
            </CModal>


            {/* Repayment modal */}
            <CModal visible={showRepaymentModal} onClose={() => setShowRepaymentModal(false)}>
                <CModalHeader>
                    <CModalTitle>Add Repayment - {selectedCustomer}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p><strong>Total :</strong> ₹{total.toFixed(2)}</p>

                    <p className="mb-1">
                        <strong>Advance Paid:</strong>{' '}
                        <span className="text-success">₹{advancePaid.toFixed(2)}</span>
                    </p>

                    <p className="mb-1">
                        <strong>Paid :</strong>{' '}
                        <span className="text-success">₹{paid.toFixed(2)}</span>
                    </p>
                    <p className="mb-3">
                        <strong>Remaining :</strong>{' '}
                        <span className="text-danger">₹{remaining.toFixed(2)}</span>
                    </p>

                    <hr />

                    {remaining > 0 ? (
                        <>
                            {advancePaid > 0 && (
                                <div className="mb-3 bg-light p-3 rounded">
                                    <div className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="useAdvanceCheck"
                                            checked={useAdvance}
                                            onChange={(e) => {
                                                setUseAdvance(e.target.checked);
                                                if (!e.target.checked) {
                                                    // clear advance amount when unchecked
                                                    // setAdditionalAmount(''); // Maybe don't clear additional amount?
                                                }
                                            }}
                                        />
                                        <label className="form-check-label fw-semibold" htmlFor="useAdvanceCheck">
                                            Use Advance Payment
                                        </label>
                                    </div>

                                    {useAdvance && (
                                        <div className="mb-2">
                                            <label className="form-label small">Advance to Use (Max: ₹{Math.min(remaining, advancePaid).toFixed(2)})</label>
                                            <CFormInput
                                                type="number"
                                                placeholder="Enter advance amount"
                                                value={advanceAmount} // We need a new state for this? 'advanceAmount' is used for modal. reuse or new?
                                                // Actually 'advanceAmount' state exists at line 63 but used for "Advance Payment Modal".
                                                // Let's use a new variable or reuse slightly carefully?
                                                // Better to introduce a new local state or reuse one if safe. 
                                                // Let's use a new state variable 'advanceToUse' in the component?
                                                // I can't add state here. I should have added it in top level.
                                                // Let me use a temp variable logic in the replacement? No.
                                                // I must ensure the state exists. 
                                                // Existing 'additionalAmount' is used for "Additional Amount" (Cash).
                                                // I need 'advanceUsedAmount'.
                                                // Wait, I can't add state inside this block.
                                                // I need to use 'advanceAmount' (line 63) which is seemingly available?
                                                // 'advanceAmount' is for the OTHER modal "Advance Payment" (line 497).
                                                // using it here might conflict if both modals open? They likely don't.
                                                // Let's use 'advanceAmount' for now but be careful to reset.
                                                onChange={e => {
                                                    let val = parseFloat(e.target.value) || 0;
                                                    const max = Math.min(remaining, advancePaid);
                                                    if (val > max) val = max; // clamp? or just let user type and validate on submit?
                                                    // User experience: clamp is better or visual error. 
                                                    // Let's allow typing but validate? 
                                                    // User said "Do NOT allow value > max usable advance".
                                                    // I'll clamp it on blur or simple check.
                                                    setAdvanceAmount(e.target.value);
                                                }}
                                                onBlur={(e) => {
                                                    let val = parseFloat(e.target.value) || 0;
                                                    const max = Math.min(remaining, advancePaid);
                                                    if (val > max) setAdvanceAmount(max);
                                                }}
                                                min="0"
                                                max={Math.min(remaining, advancePaid)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label">Payment Amount (Cash/Online)</label>
                                <CFormInput
                                    type="number"
                                    placeholder="Enter amount to pay"
                                    value={additionalAmount}
                                    onChange={e => setAdditionalAmount(e.target.value)}
                                    min="0"
                                />
                                {Number(additionalAmount) === 0 && additionalAmount !== '' && !useAdvance && (
                                    <div className="text-danger small mt-1">Payment amount must be greater than 0</div>
                                )}
                            </div>

                            <div className="mt-3 text-end">
                                <div><small>Advance Used:</small> ₹{Number(useAdvance ? advanceAmount : 0).toFixed(2)}</div>
                                <div><small>Cash/Online:</small> ₹{Number(additionalAmount || 0).toFixed(2)}</div>
                                <div className="fw-bold fs-5 mt-1 text-primary">
                                    Total Payment: ₹{((useAdvance ? Number(advanceAmount) : 0) + (Number(additionalAmount) || 0)).toFixed(2)}
                                </div>
                                {(useAdvance ? Number(advanceAmount) : 0) + (Number(additionalAmount) || 0) > remaining && (
                                    <div className="text-danger small mt-1">Total exceeds remaining balance!</div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="alert alert-success text-center">
                            Payment Complete! No outstanding balance.
                        </div>
                    )}

                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => {
                        setShowRepaymentModal(false);
                        setUseAdvance(false);
                        setAdditionalAmount('');
                        setAdvanceAmount('');
                    }}>
                        Cancel
                    </CButton>
                    <CButton
                        color="primary"
                        onClick={handleRepaymentSubmit}
                        disabled={
                            remaining <= 0 ||
                            ((Number(additionalAmount) || 0) + (useAdvance ? (Number(advanceAmount) || 0) : 0) <= 0)
                        }
                    >
                        Submit
                    </CButton>
                </CModalFooter>
            </CModal>


            {/* History modal */}
            {/* <CModal visible={showHistoryModal} onClose={() => setShowHistoryModal(false)} size="lg">
                <CModalHeader>
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <CModalTitle>Payment History</CModalTitle>
                        <CButton
                            color="success"
                            size="sm"
                            className="me-4"
                            onClick={handleDownloadHistoryPDF}
                            title="Download History PDF"
                        >
                            <CIcon icon={cilCloudDownload} className="me-1" />
                            Download PDF
                        </CButton>
                    </div>
                </CModalHeader>
                <CModalBody>
                    {historyData.filter(e => e?.invoice_id === selectedInvoice).length > 0 ? (
                        <div className="table-responsive">
                            <CTable striped hover bordered>
                                <CTableHead color="dark">
                                    <CTableRow>
                                        <CTableHeaderCell>Date</CTableHeaderCell>
                                        <CTableHeaderCell>Paid</CTableHeaderCell>
                                        <CTableHeaderCell>Remaining</CTableHeaderCell>
                                        <CTableHeaderCell>Remark</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {historyData
                                        .filter(e => e?.invoice_id === selectedInvoice)
                                        .map((e, i) => (
                                            <CTableRow key={i}>
                                                <CTableDataCell>
                                                    {e?.date ? e.date.slice(0, 10).split('-').reverse().join('-') : ''}
                                                </CTableDataCell>
                                                <CTableDataCell>₹{e.payment}</CTableDataCell>
                                                <CTableDataCell>₹{e.remaining}</CTableDataCell>
                                                <CTableDataCell>{e.remark}</CTableDataCell>
                                            </CTableRow>
                                        ))}
                                </CTableBody>
                            </CTable>
                        </div>
                    ) : (
                        <div className="text-center py-4 text-muted">
                            <p className="mb-0">No payment history found for this invoice.</p>
                        </div>
                    )}
                </CModalBody>
            </CModal> */}

            {/* History modal */}
            <CModal visible={showHistoryModal} onClose={() => setShowHistoryModal(false)} size="lg">
                <CModalHeader>
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <CModalTitle>Payment History</CModalTitle>
                        <CButton
                            color="success"
                            size="sm"
                            className="me-4"
                            onClick={handleDownloadHistoryPDF}
                            title="Download History PDF"
                        >
                            <CIcon icon={cilCloudDownload} className="me-1" />
                            Download PDF
                        </CButton>
                    </div>
                </CModalHeader>
                <CModalBody>
                    {historyData.filter(e => e?.invoice_id === selectedInvoice).length > 0 ? (
                        <div className="table-responsive">
                            <CTable striped hover bordered>
                                <CTableHead color="dark">
                                    <CTableRow>
                                        <CTableHeaderCell>Date</CTableHeaderCell>
                                        <CTableHeaderCell>Paid</CTableHeaderCell>
                                        <CTableHeaderCell>Remaining</CTableHeaderCell>
                                        <CTableHeaderCell>Remark</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {(() => {
                                        const filteredHistory = historyData.filter(e => e?.invoice_id === selectedInvoice);
                                        const invoiceTotal = filteredHistory[0]?.total || 0;
                                        let cumulativePaid = 0;

                                        return filteredHistory.map((e, i) => {
                                            cumulativePaid += Number(e.payment || 0);
                                            const calculatedRemaining = Number(invoiceTotal) - cumulativePaid;

                                            return (
                                                <CTableRow key={i}>
                                                    <CTableDataCell>
                                                        {e?.date ? e.date.slice(0, 10).split('-').reverse().join('-') : ''}
                                                    </CTableDataCell>
                                                    <CTableDataCell>₹{e.payment}</CTableDataCell>
                                                    <CTableDataCell>₹{calculatedRemaining.toFixed(2)}</CTableDataCell>
                                                    <CTableDataCell>{e.remark}</CTableDataCell>
                                                </CTableRow>
                                            );
                                        });
                                    })()}
                                </CTableBody>
                            </CTable>
                        </div>
                    ) : (
                        <div className="text-center py-4 text-muted">
                            <p className="mb-0">No payment history found for this invoice.</p>
                        </div>
                    )}
                </CModalBody>
            </CModal>


            {/* Make-payment modal */}
            <CModal visible={showPaymentModal} onClose={() => {
                setShowPaymentModal(false);
                setPayAmount('');
                setAdvanceAmount('');
                setUseAdvance(false);
                setRemark('');
            }}>
                <CModalHeader closeButton><CModalTitle>Make Payment</CModalTitle></CModalHeader>
                <CModalBody>
                    {selectedPayment && (
                        <>
                            <p><strong>Invoice:</strong> {selectedPayment.invoice_number}</p>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Total:</span>
                                <strong>₹{Number(selectedPayment.total).toFixed(2)}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Paid:</span>
                                <span className="text-success">₹{Number(selectedPayment.paid_amount).toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Remaining:</span>
                                <span className="text-danger">₹{(Number(selectedPayment.total) - Number(selectedPayment.paid_amount)).toFixed(2)}</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-3">
                                <span>Available Advance:</span>
                                <span className="text-primary fw-bold">₹{advancePaid.toFixed(2)}</span>
                            </div>

                            {(Number(selectedPayment.total) - Number(selectedPayment.paid_amount)) > 0 ? (
                                <>
                                    {advancePaid > 0 && (
                                        <div className="mb-3 bg-light p-3 rounded">
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="useAdvanceCheckInvoice"
                                                    checked={useAdvance}
                                                    onChange={(e) => {
                                                        setUseAdvance(e.target.checked);
                                                        // if (!e.target.checked) setAdvanceAmount('');
                                                    }}
                                                />
                                                <label className="form-check-label fw-semibold" htmlFor="useAdvanceCheckInvoice">
                                                    Use Advance Payment
                                                </label>
                                            </div>

                                            {useAdvance && (
                                                <div className="mb-2">
                                                    <label className="form-label small">Advance to Use</label>
                                                    <CFormInput
                                                        type="number"
                                                        placeholder="Enter advance amount"
                                                        value={advanceAmount}
                                                        onChange={e => {
                                                            const rem = Number(selectedPayment.total) - Number(selectedPayment.paid_amount);
                                                            let val = parseFloat(e.target.value) || 0;
                                                            const max = Math.min(rem, advancePaid);
                                                            // if (val > max) val = max; // Validation on submit preferred or clamp?
                                                            setAdvanceAmount(e.target.value);
                                                        }}
                                                        onBlur={e => {
                                                            const rem = Number(selectedPayment.total) - Number(selectedPayment.paid_amount);
                                                            let val = parseFloat(e.target.value) || 0;
                                                            const max = Math.min(rem, advancePaid);
                                                            if (val > max) setAdvanceAmount(max);
                                                        }}
                                                        min="0"
                                                    />
                                                    <small className="text-muted">Max: ₹{Math.min(Number(selectedPayment.total) - Number(selectedPayment.paid_amount), advancePaid).toFixed(2)}</small>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Amount (Cash/Online)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={payAmount}
                                            onChange={e => setPayAmount(e.target.value)}
                                            min="0"
                                            placeholder="Enter amount"
                                        />
                                        {Number(payAmount) === 0 && payAmount !== '' && !useAdvance && (
                                            <div className="text-danger small mt-1">Payment amount must be greater than 0</div>
                                        )}
                                    </div>

                                    {/* <label className="form-label fw-semibold">Remark</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={remark}
                                        onChange={e => setRemark(e.target.value)}
                                    /> 
                                    // Remark removed from backend store? Or redundant? 
                                    // Store doesn't use 'remark' in Repayment table for invoice logic currently?
                                    // createSingleRepayment used it. My new store logic creates repayment with... no remark/remark?
                                    // My new store logic didn't explicitly include 'remark' in Repayment::create array.
                                    // I should probably add it back if important, but User spec didn't mention it.
                                    // I'll keep it simple.
                                    */}

                                    <div className="mt-2 text-end">
                                        <strong>Total Payment: </strong>
                                        <span className={((useAdvance ? Number(advanceAmount) : 0) + (Number(payAmount) || 0)) > (Number(selectedPayment.total) - Number(selectedPayment.paid_amount)) ? "text-danger" : "text-success"}>
                                            ₹{((useAdvance ? Number(advanceAmount) : 0) + (Number(payAmount) || 0)).toFixed(2)}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="alert alert-success text-center">
                                    Payment Complete! No outstanding balance.
                                </div>
                            )}
                        </>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => {
                        setShowPaymentModal(false);
                        setUseAdvance(false);
                        setPayAmount('');
                        setAdvanceAmount('');
                    }}>Cancel</CButton>
                    <CButton
                        color="success"
                        disabled={
                            (!selectedPayment) ||
                            (Number(selectedPayment.total) - Number(selectedPayment.paid_amount) <= 0) ||
                            ((Number(payAmount) || 0) + (useAdvance ? (Number(advanceAmount) || 0) : 0) <= 0)
                        }
                        onClick={callPayment}
                    >
                        Confirm
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Order list modal */}
            <CModal visible={showOrderModal} onClose={() => setShowOrderModal(false)} size="xl" backdrop="static">
                <CModalHeader><CModalTitle>Invoice</CModalTitle></CModalHeader>
                <CModalBody style={{ overflowY: 'visible', padding: 0 }}>
                    <OrderList projectId={selectedProjectId} inModal={true} />
                </CModalBody>

            </CModal>


            {/* Additional Charges Modal */}
            <CModal
                visible={showAdditionalChargesModal}
                onClose={() => {
                    setShowAdditionalChargesModal(false);
                    setSelectedPaymentForCharges(null);
                }}
                size="lg"
            >
                <CModalHeader>
                    <CModalTitle>Additional Charges - {selectedPaymentForCharges?.invoice_number}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedPaymentForCharges?.additionalCharges && selectedPaymentForCharges.additionalCharges.length > 0 ? (
                        <div className="table-responsive">
                            <CTable striped bordered>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>Charge Type</CTableHeaderCell>
                                        <CTableHeaderCell>Amount</CTableHeaderCell>
                                        <CTableHeaderCell>Paid</CTableHeaderCell>
                                        <CTableHeaderCell>Status</CTableHeaderCell>
                                        <CTableHeaderCell>Remark</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {selectedPaymentForCharges.additionalCharges.map((charge, idx) => (
                                        <CTableRow key={charge.id}>
                                            <CTableDataCell>{formatChargeType(charge.charge_type)}</CTableDataCell>
                                            <CTableDataCell className="text-end">₹{Number(charge.amount).toFixed(2)}</CTableDataCell>
                                            <CTableDataCell className="text-end text-success fw-bold">
                                                ₹{Number(charge.paid_amount || 0).toFixed(2)}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CBadge color={charge.is_paid ? "success" : "warning"}>
                                                    {charge.is_paid ? "Paid" : "Pending"}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell>{charge.remark || '-'}</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </div>
                    ) : (
                        <p className="text-muted text-center">No additional charges</p>
                    )}
                </CModalBody>
            </CModal>
        </>
    );
};

export default ProjectPaymentReport;