import React, { useEffect, useState } from 'react';
import { getAPICall, deleteAPICall, put } from '../../../util/api';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react';
import { useToast } from '../../common/toast/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useSpinner } from '../../common/spinner/SpinnerProvider';
import ConfirmationModal from '../../common/ConfirmationModal';

function ModesTable() {
  const [prices, setPrices] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState({
    id: null,
    mode: '',
    price: '',
  });

  // Delete modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showSpinner, hideSpinner } = useSpinner();

  // Fetch all mode-price records
  const fetchPrices = async () => {
    try {
      showSpinner();
      const response = await getAPICall('/api/machine-price');
      setPrices(response);
    } catch (error) {
      console.error('Error fetching prices:', error);
      showToast('danger', 'Error fetching prices');
    } finally {
      hideSpinner();
    }
  };

  // Delete mode
  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      showSpinner();
      await deleteAPICall(`/api/machine-price/${deleteId}`);
      showToast('success', 'Mode deleted successfully');
      setDeleteModalVisible(false);
      await fetchPrices();
    } catch (error) {
      console.error('Error deleting mode:', error);
      showToast('danger', 'Error deleting mode');
    } finally {
      hideSpinner();
    }
  };

  // Open modal for edit
  const handleEdit = (row) => {
    setEditMode({
      id: row.id,
      mode: row.mode,
      price: row.price,
    });
    setVisible(true);
  };

  // Update mode/price
  const handleUpdate = async () => {
    if (!editMode.mode.trim() || !editMode.price) {
      return showToast('danger', 'Mode and Price are required');
    }

    try {
      showSpinner();
      await put(`/api/machine-price/${editMode.id}`, {
        mode: editMode.mode,
        price: editMode.price,
      });
      showToast('success', 'Mode updated successfully');
      setVisible(false);
      await fetchPrices();
    } catch (error) {
      console.error('Error updating mode:', error);
      showToast('danger', 'Failed to update mode');
    } finally {
      hideSpinner();
    }
  };

  // Extract unique modes (by mode name)
  const uniqueModes = Array.from(
    new Map(prices.map((item) => [item.mode, item])).values()
  );

  // Filter by search term
  const filteredModes = uniqueModes.filter((row) =>
    row.mode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Modes List</strong>
          <CButton color="danger" onClick={() => navigate('/addMode')}>
            Add New Mode
          </CButton>
        </CCardHeader>

        <CCardBody>
          {/* 🔍 Search Bar */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormInput
                type="text"
                placeholder="Search by Mode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
          </CRow>

          <div
            className="table-responsive"
            style={{
              width: '100%',
              overflowX: 'auto',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              backgroundColor: '#fff',
            }}
          >
            <CTable hover striped bordered color="light" className="mb-0">
              <CTableHead
                style={{
                  position: 'sticky',
                  top: 0,
                  backgroundColor: '#f8f9fa',
                  zIndex: 10,
                }}
              >
                <CTableRow>
                  <CTableHeaderCell className="text-center align-middle">
                    SR. NO.
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center align-middle">
                    Mode
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center align-middle">
                    Price Per Hour
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center align-middle">
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredModes.length > 0 ? (
                  filteredModes.map((row, index) => (
                    <CTableRow key={row.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{row.mode}</CTableDataCell>
                      <CTableDataCell>{row.price}</CTableDataCell>
                      <CTableDataCell className="d-flex gap-2 justify-content-center">
                        <CButton
                          color="info"
                          size="sm"
                          className="text-white"
                          onClick={() => handleEdit(row)}
                        >
                          Edit
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(row.id)}
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={4} className="text-center">
                      No modes found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Edit Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Edit Mode</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            className="mb-3"
            type="text"
            label="Mode"
            value={editMode.mode}
            onChange={(e) =>
              setEditMode({ ...editMode, mode: e.target.value })
            }
          />
          <CFormInput
            className="mb-3"
            type="number"
            label="Price"
            value={editMode.price}
            onChange={(e) =>
              setEditMode({ ...editMode, price: e.target.value })
            }
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpdate}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>

      <ConfirmationModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onYes={confirmDelete}
        resource="Delete Mode"
        message="Do you want to delete this Mode?"
      />
    </>
  );
}

export default ModesTable;
