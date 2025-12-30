import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAPICall, put } from '../../../util/api';
import { 
  CButton, CCard, CCardHeader, CCardBody, CCol, CRow, 
  CSpinner, CFormSelect, CModal, CModalHeader, CModalTitle, 
  CModalBody, CModalFooter, CForm, CFormInput, CFormLabel 
} from '@coreui/react';
import { cilSearch, cilPencil, cilWallet } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { gst } from '../../../util/Feilds';

// Helper function to format numbers in Indian numeric system
const formatIndianNumber = (number) => {
  return new Intl.NumberFormat('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(number);
};

const IncomeTable = () => {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [summary, setSummary] = useState({ total_amount: 0, pending_amount: 0 });
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [amountToBePaid, setAmountToBePaid] = useState(''); // Renamed from additionalAmount
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const observer = useRef();

  const perPage = 10; // Fixed perPage for infinite scroll

  // Fetch projects for filtering
  const fetchProjects = useCallback(async () => {
    try {
      const response = await getAPICall('/api/projects');
      setProjects(response || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  }, []);

  // Fetch income data
  const fetchIncomes = useCallback(async (page = 1, reset = false) => {
    setLoading(true);
    try {
      let url = `/api/income?per_page=${perPage}&page=${page}`;
      if (projectId) url += `&project_id=${projectId}`;
      
      const response = await getAPICall(url);
      console.log('API Response:', response); // Debug log to check response
      const newIncomes = response.incomes?.data || [];
      setIncomes(prev => reset ? newIncomes : [...prev, ...newIncomes]);
      setHasMore((response.incomes?.current_page || 1) < (response.incomes?.last_page || 1));
      setSummary(response.summary || { total_amount: 0, pending_amount: 0 });
    } catch (error) {
      console.error('Error fetching incomes:', error);
      setIncomes(prev => reset ? [] : prev);
      setSummary({ total_amount: 0, pending_amount: 0 });
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjects();
    fetchIncomes(1, true); // Initial fetch with reset
  }, [fetchProjects, projectId]); // Refetch when projectId changes

  // Infinite scroll observer
  const lastIncomeElementRef = useCallback(node => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setCurrentPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchIncomes(currentPage);
    }
  }, [currentPage, fetchIncomes]);

  const handleProjectFilterChange = (e) => {
    setProjectId(e.target.value);
    setCurrentPage(1); // Reset to first page
    setIncomes([]); // Clear incomes for new filter
  };

  const handleEdit = (income) => {
    navigate('/projectIncome', { state: { income } });
  };

  const openPaymentModal = (income) => {
    setSelectedIncome(income);
    setAmountToBePaid(''); // Renamed from setAdditionalAmount
    setModalError('');
    setModalVisible(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIncome) return;

    const amountToPay = parseFloat(amountToBePaid) || 0;
    if (amountToPay <= 0) {
      setModalError('Please enter a valid amount');
      return;
    }

    const pending = parseFloat(selectedIncome.pending_amount);
    if (amountToPay > pending) {
      setModalError(`Amount to be paid cannot exceed pending amount of ₹${formatIndianNumber(pending)}`);
      return;
    }

    const newReceivedAmount = parseFloat(selectedIncome.received_amount) + amountToPay;
    const newPendingAmount = pending - amountToPay;

    setModalLoading(true);
    try {
      const response = await put(`/api/income/${selectedIncome.id}`, {
        received_amount: newReceivedAmount.toFixed(2),
        pending_amount: newPendingAmount.toFixed(2)
      });

      if (response.message) {
        setModalVisible(false);
        fetchIncomes(1, true); // Refresh table
      } else {
        setModalError('Error updating payment');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      setModalError('Error updating payment');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <CCard>
        <CCardHeader className="bg-success text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Income Details</h5>
          <CButton color="light" size="sm" onClick={() => fetchIncomes(1, true)}>
            <CIcon icon={cilSearch} className="me-1" />
            Refresh
          </CButton>
        </CCardHeader>
        <CCardBody>
          {/* Filters */}
          <CRow className="mb-3">
            <CCol md={4}>
              <CFormSelect
                value={projectId}
                onChange={handleProjectFilterChange}
              >
                <option value="">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          {/* Summary */}
          <CRow className="mb-3">
            <CCol md={6}>
              <div className="alert alert-info">
                Total Amount With GST: ₹<strong>{formatIndianNumber(parseFloat(summary.total_amount))}</strong>
              </div>
            </CCol>
            <CCol md={6}>
              <div className="alert alert-warning">
                Total Pending Amount: ₹<strong>{formatIndianNumber(parseFloat(summary.pending_amount))}</strong>
              </div>
            </CCol>
          </CRow>

          {loading && incomes.length === 0 ? (
            <div className="text-center py-4">
              <CSpinner />
              <div className="mt-2">Loading income records...</div>
            </div>
          ) : incomes.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-success">
                  <tr>
                    <th style={{ textAlign: 'right' }}>ID</th>
                    <th style={{ textAlign: 'right' }}>Project Name</th>
                    <th style={{ textAlign: 'right' }}>PO No</th>
                    <th style={{ textAlign: 'right' }}>PO Date</th>
                    <th style={{ textAlign: 'right' }}>Invoice No</th>
                    <th style={{ textAlign: 'right' }}>Invoice Date</th>
                    <th style={{ textAlign: 'right' }}>Amount Before GST</th>
                    <th style={{ textAlign: 'right' }}>GST {gst}%</th>
                    <th style={{ textAlign: 'right' }}>Amount With GST</th>
                    <th style={{ textAlign: 'right' }}>Received Amount</th>
                    <th style={{ textAlign: 'right' }}>Pending Amount</th>
                    <th style={{ textAlign: 'right' }}>Sent By</th>
                    <th style={{ textAlign: 'right' }}>Payment Type</th>
                    <th style={{ textAlign: 'right' }}>Transaction ID</th>
                    <th style={{ textAlign: 'right' }}>Received Bank</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((income, index) => (
                    <tr key={income.id} ref={index === incomes.length - 1 ? lastIncomeElementRef : null}>
                      <td style={{ textAlign: 'right' }}>{income.id}</td>
                      <td style={{ textAlign: 'right' }}>{income.project_name || 'N/A'}</td>
                      <td style={{ textAlign: 'right' }}>{income.po_no}</td>
                      <td style={{ textAlign: 'right' }}>{new Date(income.po_date).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>{income.invoice_no}</td>
                      <td style={{ textAlign: 'right' }}>{new Date(income.invoice_date).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>{formatIndianNumber(parseFloat(income.basic_amount))}</td>
                      <td style={{ textAlign: 'right' }}>{formatIndianNumber(parseFloat(income.gst_amount))}</td>
                      <td style={{ textAlign: 'right' }}>{formatIndianNumber(parseFloat(income.billing_amount))}</td>
                      <td style={{ textAlign: 'right' }}>{formatIndianNumber(parseFloat(income.received_amount))}</td>
                      <td style={{ textAlign: 'right' }}>
                        {parseFloat(income.pending_amount) > 0 ? (
                          <span className="badge bg-danger">{formatIndianNumber(parseFloat(income.pending_amount))}</span>
                        ) : (
                          'NA'
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>{income.received_by}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge bg-primary">{income.payment_type.toUpperCase()}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>{income.remark || 'N/A'}</td>
                      <td style={{ textAlign: 'right' }}>{income.receivers_bank}</td>
                      <td style={{ textAlign: 'right' }} className="d-flex gap-2">
                        <CButton
                          color="warning"
                          size="sm"
                          onClick={() => handleEdit(income)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        {parseFloat(income.pending_amount) > 0 && (
                          <CButton
                            color="success"
                            size="sm"
                            onClick={() => openPaymentModal(income)}
                          >
                            <CIcon icon={cilWallet} />
                          </CButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {loading && incomes.length > 0 && (
                <div className="text-center py-4">
                  <CSpinner />
                  <div className="mt-2">Loading more records...</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-muted">No income records found</div>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Payment Update Modal */}
      {selectedIncome && (
        <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <CModalHeader>
            <CModalTitle>Update Payment for Invoice {selectedIncome.invoice_no}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handlePaymentSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="billing_amount">Amount With GST ₹</CFormLabel>
                  <CFormInput
                   
                    step="0.01"
                    value={formatIndianNumber(parseFloat(selectedIncome.billing_amount))}
                    disabled
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="received_amount">Received Amount ₹</CFormLabel>
                  <CFormInput
                  
                    step="0.01"
                    value={formatIndianNumber(parseFloat(selectedIncome.received_amount))}
                    disabled
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="pending_amount">Pending Amount ₹</CFormLabel>
                  <CFormInput
                   
                    step="0.01"
                    value={formatIndianNumber(parseFloat(selectedIncome.pending_amount))}
                    disabled
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="amount_to_be_paid">Amount To Be Paid ₹ *</CFormLabel> {/* Renamed */}
                  <CFormInput
                    type="number"
                    step="0.01"
                    value={amountToBePaid} // Renamed from additionalAmount
                    onChange={(e) => setAmountToBePaid(e.target.value)}
                    placeholder="Enter amount to be paid"
                    required
                  />
                </CCol>
              </CRow>
              {modalError && (
                <CRow>
                  <CCol>
                    <div className="alert alert-danger" role="alert">
                      {modalError}
                    </div>
                  </CCol>
                </CRow>
              )}
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={handlePaymentSubmit} disabled={modalLoading}>
              {modalLoading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                'Update Payment'
              )}
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  );
};

export default IncomeTable;