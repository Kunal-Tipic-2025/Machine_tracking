import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CSpinner, CRow, CCol, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload } from '@coreui/icons';
import { getAPICall } from '../../../util/api';
import html2pdf from 'html2pdf.js';
import { getUserData } from '../../../util/session';
import { generateMultiLanguagePDF } from '../invoice/InvoiceMulPdf';

const AdvanceInvoice = ({ paymentId }) => {
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloadingPDF, setDownloadingPDF] = useState(false);

    useEffect(() => {
        if (paymentId) {
            fetchPayment();
        }
    }, [paymentId]);

    const fetchPayment = async () => {
        try {
            setLoading(true);
            const response = await getAPICall(`/api/project-payments/${paymentId}`);
            setPayment(response);
        } catch (error) {
            console.error('Error fetching advance payment:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-GB');
    };

    const generatePDF = async () => {
        if (!payment) return;

        try {
            setDownloadingPDF(true);
            const ci = getUserData()?.company_info;

            if (!ci) {
                alert('Company information not found. Please log in again.');
                return;
            }

            const invoiceDate = formatDate(payment.created_at);
            const isFixedBid = payment.is_fixed_bid == 1;
            const isAdvance = !isFixedBid; // If not fixed bid, it's advance in this context

            // Map payment data to formData expected by generateMultiLanguagePDF
            const formData = {
                invoice_number: payment.invoice_number,
                date: invoiceDate,
                customer: {
                    name: payment.project?.customer_name || 'N/A',
                    address: payment.project?.work_place || '',
                    mobile: payment.project?.mobile_number || '',
                    gst_number: payment.project?.gst_number || '',
                },
                consignee: {
                    name: ci.company_name,
                    address: `${ci.land_mark || ''}, ${ci.Tal || ''}, ${ci.Dist || ''}, ${ci.pincode || ''}`,
                    phone_no: ci.phone_no,
                    gst_number: ci.gst_number,
                    email_id: ci.email_id,
                },
                totalAmount: payment.total,
                amountPaid: payment.paid_amount,
                finalAmount: payment.total,
                paymentMode: payment.payment_mode || (isFixedBid ? 'Fixed Bid' : 'Advance'),
                transaction_id: payment.transaction_id,
                is_fixed_bid: isFixedBid,
                is_advance: isAdvance,
                remark: payment.remark,
                // For Advance Template specifically
                name: payment.project?.customer_name || 'N/A', // Advance template uses direct props sometimes
                address: payment.project?.work_place || '',
                mobile: payment.project?.mobile_number || '',
                total: payment.total,
            };

            await generateMultiLanguagePDF(
                formData,
                [], // logs
                [], // operators
                [], // rows
                [], // prices
                [], // filteredLogs
                'english', // Default language
                'save' // mode
            );

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloadingPDF(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <CSpinner color="primary" />
            </div>
        );
    }

    if (!payment) {
        return (
            <div className="p-4 text-center">
                <p className="text-muted">No payment data found.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <CCard>
                <CCardHeader className="bg-warning text-dark d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{payment.is_fixed_bid == 1 ? 'Fixed Bid Invoice' : 'Advance Payment Invoice'}</h5>
                    <CButton
                        color="success"
                        size="sm"
                        onClick={generatePDF}
                        disabled={downloadingPDF || !payment}
                    >
                        {downloadingPDF ? (
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
                </CCardHeader>
                <CCardBody>
                    <CRow className="mb-4">
                        <CCol md={6}>
                            <div className="mb-2">
                                <strong>Invoice Number:</strong>{' '}
                                <span className="text-muted">{payment.invoice_number || '-'}</span>
                            </div>
                            <div className="mb-2">
                                <strong>Date:</strong>{' '}
                                <span className="text-muted">{formatDate(payment.created_at)}</span>
                            </div>
                        </CCol>

                        <CCol md={6}>
                            <div className="mb-2">
                                <strong>Payment Mode:</strong>{' '}
                                <span className="text-muted">{payment.payment_mode || (payment.is_fixed_bid == 1 ? 'Fixed Bid' : 'Advance')}</span>
                            </div>

                            {payment.transaction_id && (
                                <div className="mb-2">
                                    <strong>Transaction ID:</strong>{' '}
                                    <span className="text-muted">{payment.transaction_id}</span>
                                </div>
                            )}
                        </CCol>
                    </CRow>


                    <div className="table-responsive">
                        <CTable striped bordered>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>Description</CTableHeaderCell>
                                    <CTableHeaderCell className="text-end">Amount</CTableHeaderCell>
                                    <CTableHeaderCell className="text-end">Remaining</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow>
                                    <CTableDataCell>
                                        <strong>{payment.is_fixed_bid == 1 ? 'Fixed Bid Work' : 'Advance Payment'}</strong>
                                        {payment.remark && (
                                            <div className="text-muted small mt-1">{payment.remark}</div>
                                        )}
                                    </CTableDataCell>
                                    <CTableDataCell className="text-end">
                                        <strong className="text-success">₹{Number(payment.total || 0).toFixed(2)}</strong>
                                    </CTableDataCell>
                                    <CTableDataCell className="text-end">
                                        <strong className="text-danger">₹{(Number(payment.total || 0) - Number(payment.paid_amount || 0)).toFixed(2)}</strong>
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableDataCell colSpan={2}>
                                        <strong>Total Paid Amount</strong>
                                    </CTableDataCell>
                                    <CTableDataCell className="text-end">
                                        <strong className="text-success fs-5">₹{Number(payment.paid_amount || 0).toFixed(2)}</strong>
                                    </CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </div>

                    <div className="mt-4 p-3 bg-light rounded">
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <div className="d-flex align-items-center">
                                    <span className="fw-bold">Payment Mode:</span>
                                    <span className="badge bg-info fs-6 ms-2">{payment.payment_mode || (payment.is_fixed_bid == 1 ? 'Fixed Bid' : 'Advance')}</span>
                                </div>
                            </div>

                            {payment.project && (
                                <div className="col-md-6 mb-2">
                                    <div className="d-flex align-items-center">
                                        <span className="fw-bold">Cust. Name :</span>
                                        <span className="text-muted ms-2">{payment.project.customer_name || '-'}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </CCardBody>
            </CCard>
        </div>
    );
};

export default AdvanceInvoice;
