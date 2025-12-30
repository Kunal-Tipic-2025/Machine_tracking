import React, { useEffect, useState, useCallback, useRef } from "react";
import { getAPICall, post, put, deleteAPICall } from "../../../util/api";
import { 
  CButton, CCard, CCardHeader, CCardBody, CCol, 
  CFormSelect, CFormInput, CInputGroup, CRow, 
  CSpinner, CAlert, CModal, CModalHeader, CModalTitle,
  CModalBody, CModalFooter, CFormTextarea, CBadge,
  CTable, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell, CCollapse
} from '@coreui/react';
import { cilSearch, cilMoney, cilHistory, cilPlus, cilMinus, cilPencil, cilTrash} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { paymentTypes, receiver_bank } from "../../../util/Feilds";

const VendorPaymentReport = () => {
  const [vendorPayments, setVendorPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [description, setDescription] = useState('');
  const [savingPayment, setSavingPayment] = useState(false);

  // Logs Modal State
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedVendorLogs, setSelectedVendorLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Edit Log Modal State
  const [showEditLogModal, setShowEditLogModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [editLogAmount, setEditLogAmount] = useState('');
  const [editLogDate, setEditLogDate] = useState('');
  const [editLogPaidBy, setEditLogPaidBy] = useState('');
  const [editLogPaymentType, setEditLogPaymentType] = useState(''); // Added payment type for edit
  const [editLogDescription, setEditLogDescription] = useState('');
  const [savingLogEdit, setSavingLogEdit] = useState(false);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingLog, setDeletingLog] = useState(null);
  const [deletingLogId, setDeletingLogId] = useState(false);

  // Expandable rows for vendor details
  const [expandedRows, setExpandedRows] = useState({});

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const showTempAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const fetchProjects = useCallback(async (query) => {
    try {
      const response = await getAPICall(`/api/projects?searchQuery=${query}`);
      setProjects(response || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
      setShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchQuery.length > 2) {
        fetchProjects(searchQuery);
      } else {
        setProjects([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchProjects]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-fetch vendor payments when project is selected
  useEffect(() => {
    if (selectedProjectId) {
      fetchVendorPayments();
    } else {
      setVendorPayments([]);
    }
  }, [selectedProjectId]);

  const handleProjectChange = (project) => {
    setSearchQuery(project.project_name);
    setSelectedProjectId(project.id);
    setProjects([]);
    setShowDropdown(false);
    if (inputRef.current) inputRef.current.blur();
  };

  const handleInputFocus = () => {
    if (projects.length > 0) setShowDropdown(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (selectedProjectId && value !== searchQuery) {
      setSelectedProjectId('');
    }
  };

  const syncVendorPayments = async () => {
    if (!selectedProjectId) return;

    setLoading(true);
    try {
      const response = await post(`/api/projects/${selectedProjectId}/sync-vendor-payments`, {});
      
      if (response && (response.message || response.vendor_payments_count !== undefined)) {
        const count = response.vendor_payments_count || 0;
        showTempAlert(
          `Vendor payments synced successfully! Created/Updated ${count} vendor payment records.`, 
          'success'
        );
        fetchVendorPayments(); // Refresh the data
      } else {
        showTempAlert('Sync completed but no data returned', 'warning');
        fetchVendorPayments(); // Still refresh to see if anything changed
      }
    } catch (error) {
      console.error('Sync error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to sync vendor payments';
      showTempAlert(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorPayments = async () => {
    if (!selectedProjectId) {
      showTempAlert('Please select a project', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await getAPICall(`/api/vendor-payments/${selectedProjectId}`);
      
      // Handle both array response and object response with data property
      if (Array.isArray(response)) {
        setVendorPayments(response);
        if (response.length === 0) {
          showTempAlert('No vendor payments found for this project', 'info');
        }
      } else if (response && response.data) {
        setVendorPayments(response.data || []);
        if (response.message) {
          showTempAlert(response.message, 'warning');
        }
      } else {
        setVendorPayments([]);
        showTempAlert('No vendor payments found for this project', 'info');
      }
    } catch (error) {
      console.error('Error fetching vendor payments:', error);
      showTempAlert('Failed to fetch vendor payments', 'danger');
      setVendorPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (vendor) => {
    setSelectedVendor(vendor);
    setPaymentAmount(vendor.balance_amount || '');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaidBy('');
    setPaymentType('cash'); // Set default payment type to cash
    setDescription('');
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedVendor(null);
  };

  const handlePaymentSubmit = async () => {
    if (!paymentAmount || !paymentDate || !paidBy) {
      showTempAlert('Please fill all required fields (Amount, Date, Paid By)', 'danger');
      return;
    }

    if (parseFloat(paymentAmount) <= 0) {
      showTempAlert('Payment amount must be greater than 0', 'danger');
      return;
    }

    if (parseFloat(paymentAmount) > parseFloat(selectedVendor.balance_amount)) {
      showTempAlert('Payment amount cannot exceed balance amount', 'danger');
      return;
    }

    setSavingPayment(true);

    const payload = {
      amount: parseFloat(paymentAmount),
      payment_date: paymentDate,
      paid_by: paidBy,
      payment_type: paymentType || 'cash', // Include payment type in payload
      description: description || ''
    };

    try {
      const response = await post(`/api/vendor-payments/${selectedVendor.id}/pay`, payload);
      
      if (response && (response.message || response.vendor_payment)) {
        showTempAlert('Payment recorded successfully!', 'success');
        closePaymentModal();
        fetchVendorPayments(); // Refresh the data
      } else {
        showTempAlert(response?.error || 'Failed to record payment', 'danger');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to record payment. Please try again.';
      showTempAlert(errorMessage, 'danger');
    } finally {
      setSavingPayment(false);
    }
  };

  const fetchVendorLogs = async (vendorPaymentId) => {
    setLoadingLogs(true);
    try {
      const response = await getAPICall(`/api/vendor-payments/${vendorPaymentId}/logs`);
      setSelectedVendorLogs(response || []);
      setShowLogsModal(true);
      
      if (!response || response.length === 0) {
        // Don't show alert here as the modal will show "no logs found"
        console.log('No payment logs found for vendor payment ID:', vendorPaymentId);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch payment logs';
      showTempAlert(errorMessage, 'danger');
      setSelectedVendorLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Edit Log Functions
  const openEditLogModal = (log) => {
    setEditingLog(log);
    setEditLogAmount(log.amount.toString());
    setEditLogDate(log.payment_date.split('T')[0]); // Format date for input
    setEditLogPaidBy(log.paid_by);
    setEditLogPaymentType(log.payment_type || 'cash'); // Set payment type from log
    setEditLogDescription(log.description || '');
    setShowEditLogModal(true);
  };

  const closeEditLogModal = () => {
    setShowEditLogModal(false);
    setEditingLog(null);
    setEditLogAmount('');
    setEditLogDate('');
    setEditLogPaidBy('');
    setEditLogPaymentType('');
    setEditLogDescription('');
  };

  const handleEditLogSubmit = async () => {
    if (!editLogAmount || !editLogDate || !editLogPaidBy) {
      showTempAlert('Please fill all required fields (Amount, Date, Paid By)', 'danger');
      return;
    }

    if (parseFloat(editLogAmount) <= 0) {
      showTempAlert('Payment amount must be greater than 0', 'danger');
      return;
    }

    setSavingLogEdit(true);

    const payload = {
      amount: parseFloat(editLogAmount),
      payment_date: editLogDate,
      paid_by: editLogPaidBy,
      payment_type: editLogPaymentType || 'cash', // Include payment type in edit payload
      description: editLogDescription || ''
    };

    try {
      const response = await put(`/api/vendor-payment-logs/${editingLog.id}`, payload);
      
      if (response && response.message) {
        showTempAlert('Payment log updated successfully!', 'success');
        closeEditLogModal();
        // Refresh both logs and vendor payments
        fetchVendorLogs(editingLog.vendor_payment_id);
        fetchVendorPayments();
      } else {
        showTempAlert(response?.error || 'Failed to update payment log', 'danger');
      }
    } catch (error) {
      console.error('Edit log error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update payment log. Please try again.';
      showTempAlert(errorMessage, 'danger');
    } finally {
      setSavingLogEdit(false);
    }
  };

  // Delete Log Functions
  const openDeleteConfirm = (log) => {
    setDeletingLog(log);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeletingLog(null);
  };

  const handleDeleteLog = async () => {
    if (!deletingLog) return;

    setDeletingLogId(true);

    try {
      const response = await deleteAPICall(`/api/vendor-payment-logs/${deletingLog.id}`);
      
      if (response && response.message) {
        showTempAlert('Payment log deleted successfully!', 'success');
        closeDeleteConfirm();
        // Refresh both logs and vendor payments
        fetchVendorLogs(deletingLog.vendor_payment_id);
        fetchVendorPayments();
      } else {
        showTempAlert(response?.error || 'Failed to delete payment log', 'danger');
      }
    } catch (error) {
      console.error('Delete log error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to delete payment log. Please try again.';
      showTempAlert(errorMessage, 'danger');
    } finally {
      setDeletingLogId(false);
    }
  };

  const toggleRowExpansion = (vendorId) => {
    setExpandedRows(prev => ({
      ...prev,
      [vendorId]: !prev[vendorId]
    }));
  };

  const getPaymentStatus = (vendor) => {
    const total = parseFloat(vendor.total_amount || 0);
    const paid = parseFloat(vendor.paid_amount || 0);
    
    if (paid === 0) return { text: 'Unpaid', color: 'danger' };
    if (paid >= total) return { text: 'Paid', color: 'success' };
    return { text: 'Partial', color: 'warning' };
  };

  // Helper function to get payment type label
  const getPaymentTypeLabel = (paymentTypeValue) => {
    if (!paymentTypeValue) return 'Cash'; // Default display
    const paymentType = paymentTypes.find(type => type.value === paymentTypeValue);
    return paymentType ? paymentType.label : paymentTypeValue;
  };

  return (
    <div className="container-fluid py-2">
      <CCard>
        <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Vendor Payment Management</h5>
          {selectedProjectId && (
            <CButton 
              color="light" 
              size="sm"
              onClick={syncVendorPayments}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CSpinner size="sm" className="me-2" /> Syncing...
                </>
              ) : (
                <>
                  <CIcon icon={cilMoney} className="me-2" /> Sync Payments
                </>
              )}
            </CButton>
          )}
        </CCardHeader>
        <CCardBody>
          {showAlert && (
            <CAlert color={alertType} dismissible onClose={() => setShowAlert(false)}>
              {alertMessage}
            </CAlert>
          )}

          {/* Project Selection */}
          <CRow className="mb-4">
            <CCol md={12}>
              <div className="position-relative" ref={dropdownRef}>
                <CInputGroup>
                  <CFormInput
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder="Search and select a project to view vendor payments..."
                    className="border"
                    autoComplete="off"
                  />
                  <CIcon 
                    icon={cilSearch} 
                    className="position-absolute" 
                    style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 5, color: '#6c757d' }} 
                  />
                </CInputGroup>

                {showDropdown && projects.length > 0 && (
                  <div className="dropdown-menu show w-100" style={{ maxHeight: '200px', overflowY: 'auto', position: 'absolute', zIndex: 1000, marginTop: '2px' }}>
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="dropdown-item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleProjectChange(project)}
                      >
                        {project.project_name}
                      </div>
                    ))}
                  </div>
                )}
                {selectedProjectId && (
                  <div className="text-success mt-1 small">
                    ✓ Selected: {searchQuery}
                  </div>
                )}
              </div>
            </CCol>
          </CRow>

          {/* Loading indicator */}
          {loading && (
            <div className="text-center py-4">
              <CSpinner />
              <p className="mt-2">Loading vendor payments...</p>
            </div>
          )}

          {/* Vendor Payments Table */}
          {!loading && vendorPayments.length > 0 && (
            <div className="table-responsive">
              <CTable striped hover>
                <CTableHead color="primary">
                  <CTableRow>
                    <CTableHeaderCell>Vendor Name</CTableHeaderCell>
                    <CTableHeaderCell>Total Amount</CTableHeaderCell>
                    <CTableHeaderCell>Paid Amount</CTableHeaderCell>
                    <CTableHeaderCell>Balance Amount</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {vendorPayments.map((vendor) => {
                    const status = getPaymentStatus(vendor);
                    const isExpanded = expandedRows[vendor.id];
                    return (
                      <React.Fragment key={vendor.id}>
                        <CTableRow>
                          <CTableDataCell>
                            {vendor.vendor ? vendor.vendor.name : 'Unknown Vendor'}
                          </CTableDataCell>
                          <CTableDataCell>₹{parseFloat(vendor.total_amount || 0).toFixed(2)}</CTableDataCell>
                          <CTableDataCell>₹{parseFloat(vendor.paid_amount || 0).toFixed(2)}</CTableDataCell>
                          <CTableDataCell>₹{parseFloat(vendor.balance_amount || 0).toFixed(2)}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={status.color}>{status.text}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-2">
                              <CButton
                                color="success"
                                size="sm"
                                onClick={() => openPaymentModal(vendor)}
                                disabled={parseFloat(vendor.balance_amount || 0) <= 0}
                              >
                                <CIcon icon={cilMoney} className="me-1" />
                                Pay
                              </CButton>
                              <CButton
                                color="info"
                                size="sm"
                                onClick={() => fetchVendorLogs(vendor.id)}
                              >
                                <CIcon icon={cilHistory} className="me-1" />
                                Logs
                              </CButton>
                              <CButton
                                color="secondary"
                                size="sm"
                                onClick={() => toggleRowExpansion(vendor.id)}
                                title={isExpanded ? "Hide Details" : "Show Details"}
                              >
                                <CIcon icon={isExpanded ? cilMinus: cilPlus} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                        
                        {/* Expanded Row for Vendor Details */}
                        {isExpanded && (
                          <CTableRow>
                            <CTableDataCell colSpan="7">
                              <div className="p-3 bg-light">
                                <h6>Vendor Details</h6>
                                <CRow>
                                  <CCol md={4}>
                                    <p><strong>Name:</strong> {vendor.vendor?.name || 'N/A'}</p>
                                  </CCol>
                                  <CCol md={4}>
                                    <p><strong>Mobile:</strong> {vendor.vendor?.mobile || 'N/A'}</p>
                                  </CCol>
                                  <CCol md={4}>
                                    <p><strong>Address:</strong> {vendor.vendor?.address || 'N/A'}</p>
                                  </CCol>
                                </CRow>
                                <CRow>
                                  <CCol md={4}>
                                    <p><strong>Bank Name:</strong> {vendor.vendor?.bank_name || 'N/A'}</p>
                                  </CCol>
                                  <CCol md={4}>
                                    <p><strong>Account No:</strong> {vendor.vendor?.account_number || 'N/A'}</p>
                                  </CCol>
                                  <CCol md={4}>
                                    <p><strong>IFSC Code:</strong> {vendor.vendor?.ifsc_code || 'N/A'}</p>
                                  </CCol>
                                </CRow>
                                {/* Third row - only show if any of these fields have data */}
                                {(vendor.vendor?.gst_no || vendor.vendor?.adhar_number || vendor.vendor?.pan_number) && (
                                  <CRow>
                                    {vendor.vendor?.gst_no && (
                                      <CCol md={4}>
                                        <p><strong>GST No:</strong> {vendor.vendor.gst_no}</p>
                                      </CCol>
                                    )}
                                    {vendor.vendor?.adhar_number && (
                                      <CCol md={4}>
                                        <p><strong>Aadhar No:</strong> {vendor.vendor.adhar_number}</p>
                                      </CCol>
                                    )}
                                    {vendor.vendor?.pan_number && (
                                      <CCol md={4}>
                                        <p><strong>PAN No:</strong> {vendor.vendor.pan_number}</p>
                                      </CCol>
                                    )}
                                  </CRow>
                                )}
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </CTableBody>
              </CTable>
            </div>
          )}

          {/* No Data / Empty State */}
          {!loading && vendorPayments.length === 0 && selectedProjectId && (
            <div className="text-center py-5">
              <div className="mb-4">
                <CIcon icon={cilMoney} size="3xl" className="text-muted mb-3" />
                <h5 className="text-muted">No vendor payments found</h5>
                <p className="text-muted mb-4">
                  This could mean:
                  <br />• No budgets have been created for this project
                  <br />• Budgets exist but vendor payments need to be synced
                  <br />• No operators are assigned to work on this project
                </p>
              </div>
              
              <div className="d-flex justify-content-center gap-3">
                <CButton 
                  color="warning" 
                  onClick={syncVendorPayments}
                  disabled={loading}
                >
                  <CIcon icon={cilMoney} className="me-2" />
                  Sync Vendor Payments
                </CButton>
              </div>
            </div>
          )}

          {/* No Project Selected State */}
          {!selectedProjectId && !loading && (
            <div className="text-center py-5">
              <CIcon icon={cilSearch} size="3xl" className="text-muted mb-3" />
              <h5 className="text-muted">Select a project to get started</h5>
              <p className="text-muted">
                Search and select a project from the dropdown above to view vendor payments.
              </p>
            </div>
          )}

          {/* Payment Modal */}
          <CModal visible={showPaymentModal} onClose={closePaymentModal} backdrop="static" size="lg">
            <CModalHeader onClose={closePaymentModal}>
              <CModalTitle>Record Payment</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {selectedVendor && (
                <div>
                  <div className="mb-3 p-3 bg-light rounded">
                    <h6>Vendor: {selectedVendor.vendor?.name || 'Unknown'}</h6>
                    <p className="mb-1">Total Amount: ₹{parseFloat(selectedVendor.total_amount || 0).toFixed(2)}</p>
                    <p className="mb-1">Paid Amount: ₹{parseFloat(selectedVendor.paid_amount || 0).toFixed(2)}</p>
                    <p className="mb-0">Balance Amount: ₹{parseFloat(selectedVendor.balance_amount || 0).toFixed(2)}</p>
                  </div>

                  <CRow>
                    <CCol md={6}>
                      <div className="mb-3">
                        <label className="form-label">Payment Amount *</label>
                        <CFormInput
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="Enter payment amount"
                          step="0.01"
                          max={selectedVendor.balance_amount}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div className="mb-3">
                        <label className="form-label">Payment Date *</label>
                        <CFormInput
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                        />
                      </div>
                    </CCol>
                  </CRow>

                  <CRow>
                    <CCol md={6}>
                      <div className="mb-3">
                        <label className="form-label">Paid By *</label>
                        <CFormSelect
                          value={paidBy}
                          onChange={(e) => setPaidBy(e.target.value)}
                        >
                          <option value="">Select Payment By</option>
                          {receiver_bank.map((bank) => (
                            <option key={bank.value} value={bank.value}>{bank.label}</option>
                          ))}
                        </CFormSelect>
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div className="mb-3">
                        <label className="form-label">Payment Type *</label>
                        <CFormSelect
                          value={paymentType}
                          onChange={(e) => setPaymentType(e.target.value)}
                        >
                          {paymentTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </CFormSelect>
                      </div>
                    </CCol>
                  </CRow>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <CFormTextarea
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter payment description (optional)"
                    />
                  </div>
                </div>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={closePaymentModal}>
                Cancel
              </CButton>
              <CButton color="primary" disabled={savingPayment} onClick={handlePaymentSubmit}>
                {savingPayment ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Recording...
                  </>
                ) : (
                  'Record Payment'
                )}
              </CButton>
            </CModalFooter>
          </CModal>

          {/* Logs Modal */}
          <CModal visible={showLogsModal} onClose={() => setShowLogsModal(false)} size="xl">
            <CModalHeader onClose={() => setShowLogsModal(false)}>
              <CModalTitle>Payment Logs</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {loadingLogs ? (
                <div className="text-center py-4">
                  <CSpinner />
                  <p className="mt-2">Loading payment logs...</p>
                </div>
              ) : selectedVendorLogs.length > 0 ? (
                <div className="table-responsive">
                  <CTable striped>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Date</CTableHeaderCell>
                        <CTableHeaderCell>Amount</CTableHeaderCell>
                        <CTableHeaderCell>Paid By</CTableHeaderCell>
                        <CTableHeaderCell>Payment Type</CTableHeaderCell>
                        <CTableHeaderCell>Description</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {selectedVendorLogs.map((log) => (
                        <CTableRow key={log.id}>
                          <CTableDataCell>
                            {new Date(log.payment_date).toLocaleDateString()}
                          </CTableDataCell>
                          <CTableDataCell>₹{parseFloat(log.amount).toFixed(2)}</CTableDataCell>
                          <CTableDataCell>{log.paid_by}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="info">
                              {getPaymentTypeLabel(log.payment_type)}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{log.description || '-'}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-2">
                              <CButton
                                color="warning"
                                size="sm"
                                onClick={() => openEditLogModal(log)}
                                title="Edit Payment Log"
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              {/* <CButton
                                color="danger"
                                size="sm"
                                onClick={() => openDeleteConfirm(log)}
                                title="Delete Payment Log"
                              >
                                <CIcon icon={cilTrash} />
                              </CButton> */}
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              ) : (
                <div className="text-center py-4">
                  <h6 className="text-muted">No payment logs found</h6>
                </div>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setShowLogsModal(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>

          {/* Edit Log Modal */}
          <CModal visible={showEditLogModal} onClose={closeEditLogModal} backdrop="static" size="lg">
            <CModalHeader onClose={closeEditLogModal}>
              <CModalTitle>Edit Payment Log</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {editingLog && (
                <div>
                  <div className="mb-3 p-3 bg-light rounded">
                    <h6>Editing Payment Log</h6>
                    <p className="mb-0">
                      Original Amount: ₹{parseFloat(editingLog.amount).toFixed(2)} on {new Date(editingLog.payment_date).toLocaleDateString()}
                      <br />
                      Original Payment Type: {getPaymentTypeLabel(editingLog.payment_type)}
                    </p>
                  </div>

                  <CRow>
                    <CCol md={6}>
                      <div className="mb-3">
                        <label className="form-label">Payment Amount *</label>
                        <CFormInput
                          type="number"
                          value={editLogAmount}
                          onChange={(e) => setEditLogAmount(e.target.value)}
                          placeholder="Enter payment amount"
                          step="0.01"
                          min="0.01"
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div className="mb-3">
                        <label className="form-label">Payment Date *</label>
                        <CFormInput
                          type="date"
                          value={editLogDate}
                          onChange={(e) => setEditLogDate(e.target.value)}
                        />
                      </div>
                    </CCol>
                  </CRow>

                  <CRow>
                    <CCol md={6}>
                      <div className="mb-3">
                        <label className="form-label">Paid By *</label>
                        <CFormSelect
                          value={editLogPaidBy}
                          onChange={(e) => setEditLogPaidBy(e.target.value)}
                        >
                          <option value="">Select Payment By</option>
                          {receiver_bank.map((bank) => (
                            <option key={bank.value} value={bank.value}>{bank.label}</option>
                          ))}
                        </CFormSelect>
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div className="mb-3">
                        <label className="form-label">Payment Type *</label>
                        <CFormSelect
                          value={editLogPaymentType}
                          onChange={(e) => setEditLogPaymentType(e.target.value)}
                        >
                          {paymentTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </CFormSelect>
                      </div>
                    </CCol>
                  </CRow>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <CFormTextarea
                      rows="3"
                      value={editLogDescription}
                      onChange={(e) => setEditLogDescription(e.target.value)}
                      placeholder="Enter payment description (optional)"
                    />
                  </div>
                </div>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={closeEditLogModal}>
                Cancel
              </CButton>
              <CButton color="primary" disabled={savingLogEdit} onClick={handleEditLogSubmit}>
                {savingLogEdit ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Updating...
                  </>
                ) : (
                  'Update Log'
                )}
              </CButton>
            </CModalFooter>
          </CModal>

          {/* Delete Confirmation Modal */}
          <CModal visible={showDeleteConfirm} onClose={closeDeleteConfirm} backdrop="static">
            <CModalHeader onClose={closeDeleteConfirm}>
              <CModalTitle>Confirm Delete</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {deletingLog && (
                <div>
                  <p><strong>Are you sure you want to delete this payment log?</strong></p>
                  <div className="p-3 bg-light rounded">
                    <p className="mb-1"><strong>Amount:</strong> ₹{parseFloat(deletingLog.amount).toFixed(2)}</p>
                    <p className="mb-1"><strong>Date:</strong> {new Date(deletingLog.payment_date).toLocaleDateString()}</p>
                    <p className="mb-1"><strong>Paid By:</strong> {deletingLog.paid_by}</p>
                    <p className="mb-1"><strong>Payment Type:</strong> {getPaymentTypeLabel(deletingLog.payment_type)}</p>
                    <p className="mb-0"><strong>Description:</strong> {deletingLog.description || 'N/A'}</p>
                  </div>
                  <div className="alert alert-warning mt-3">
                    <small><strong>Warning:</strong> This action cannot be undone. The vendor payment totals will be recalculated automatically.</small>
                  </div>
                </div>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={closeDeleteConfirm}>
                Cancel
              </CButton>
              <CButton color="danger" disabled={deletingLogId} onClick={handleDeleteLog}>
                {deletingLogId ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete Log'
                )}
              </CButton>
            </CModalFooter>
          </CModal>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default VendorPaymentReport;