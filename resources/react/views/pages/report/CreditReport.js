import React, { useEffect, useState, useMemo } from 'react';
import {
    CBadge, CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow,
    CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
    CSpinner, CInputGroup, CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPhone, cilChatBubble } from '@coreui/icons';
import { useToast } from '../../common/toast/ToastContext';
import { getAPICall } from '../../../util/api';
import { getUserData } from '../../../util/session';

const CreditReport = () => {
    const { showToast } = useToast();

    // -------------------------------------------------
    // 1. Current company (from session)
    // -------------------------------------------------
    const companyId = getUserData()?.company_id;
    const companyName = getUserData()?.company_info?.company_name || 'Our Company';
    
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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    // -------------------------------------------------
    // 4. Effects
    // -------------------------------------------------
    useEffect(() => {
        fetchPayments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyId]);

    // -------------------------------------------------
    // 5. Helpers
    // -------------------------------------------------
    const formatCurrency = (value) => `₹${Number(value || 0).toFixed(2)}`;

    // -------------------------------------------------
    // 6. Memoised company-only data
    // -------------------------------------------------
    const companyPayments = useMemo(() => {
        return payments.filter(p => p.company_id === companyId);
    }, [payments, companyId]);

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
                <p className="mt-3 text-muted">Loading credit report...</p>
            </div>
        );
    }

    // -------------------------------------------------
    // 8. Render
    // -------------------------------------------------
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="shadow-sm">
                    <CCardHeader className="bg-light d-flex justify-content-between align-items-center">
                        <div>
                            <strong className="fs-5">Credit Report</strong>
                            <CBadge color="info" className="ms-2">
                                {summaryStats.customerCount} customers
                            </CBadge>
                        </div>
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
                                    <small className="d-block">Total Billed</small>
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
                                        
                                        // Get mobile number from the first project record for this customer
                                        const mobile = recs[0]?.project?.mobile_number || '';

                                        // SMS Body
                                        const smsBody = `Hello ${cust}, your total bill is ${total.toFixed(2)}, paid amount is ${paid.toFixed(2)}, and remaining amount is ${rem.toFixed(2)}. Please pay the remaining amount. - ${companyName}`;

                                        return (
                                            <CTableRow key={cust}>
                                                <CTableDataCell>{idx + 1}</CTableDataCell>
                                                <CTableDataCell>
                                                    {cust}
                                                    {mobile && <div className="small text-muted">{mobile}</div>}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end">₹{total.toFixed(2)}</CTableDataCell>
                                                <CTableDataCell className="text-success fw-bold text-end">₹{paid.toFixed(2)}</CTableDataCell>
                                                <CTableDataCell className="text-danger fw-bold text-end">₹{rem.toFixed(2)}</CTableDataCell>
                                                <CTableDataCell className="text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        {mobile && (
                                                            <>
                                                                <a 
                                                                    href={`tel:${mobile}`}
                                                                    className="btn btn-sm btn-info text-white"
                                                                    title="Call Customer"
                                                                >
                                                                    <CIcon icon={cilPhone} />
                                                                </a>
                                                                <a 
                                                                    href={`sms:${mobile}?body=${encodeURIComponent(smsBody)}`}
                                                                    className="btn btn-sm btn-success text-white"
                                                                    title="Send SMS"
                                                                >
                                                                    <CIcon icon={cilChatBubble} />
                                                                </a>
                                                            </>
                                                        )}
                                                        {!mobile && <span className="text-muted small">No Mobile</span>}
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
    );
};

export default CreditReport;