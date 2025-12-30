import React, { useEffect, useState } from 'react';
import { getAPICall, deleteAPICall, put, postAPICall } from '../../../util/api';
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
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CFormLabel,
  CRow,
  CCol,
  CSpinner,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/toast/ToastContext';
import { getUserData } from '../../../util/session';
import ConfirmationModal from '../../common/ConfirmationModal';


function MachineriesTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    machine_name: '',
    register_number: '',
    ownership_type: '',
    operator_id: [], // IDs of assigned operators
    mode_id: [], // IDs of assigned modes
  });
  const [editModes, setEditModes] = useState([]); // multiple mode-price pairs for edit
  const [users, setUsers] = useState([]);
  const [prices, setPrices] = useState([]);

  // Delete modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const userData = getUserData();
  const company = userData?.company_info;
  console.log('userData from session:', company);

  const fetchMachineries = async () => {
    try {
      const response = await getAPICall('/api/machine-operators');

      // ✅ Filter the response based on company.company_id
      const filtered = response.filter(
        (item) => item.company_id === company.company_id
      );

      console.log("Filtered Response : ", filtered);

      setRows(filtered);

    } catch (error) {
      console.error('Error fetching machineries:', error);
      showToast('danger', 'Error fetching machineries');
    }
    finally {
      setIsLoading(false);
    }
  };


  const fetchUsers = async () => {
    try {
      const response = await getAPICall('/api/appUsers');
      console.log("All the users from users:", response.data);

      // ✅ Filter users whose type === 2
      const filteredUsers = response.data.filter((user) => user.type === 2);

      console.log("Filtered users (type = 2):", filteredUsers);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching Users:', error);
      showToast('danger', 'Error fetching Users');
    }
  };


  const fetchPrices = async () => {
    try {
      const response = await getAPICall('/api/machine-price');
      console.log('response');
      console.log(response);
      setPrices(response);
    } catch (error) {
      console.error('Error fetching Users:', error);
      showToast('danger', 'Error fetching Users');
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAPICall(`/api/machine-operators/${deleteId}`);
      fetchMachineries();
      showToast('success', 'Machine deleted successfully');
      setDeleteModalVisible(false);
    } catch (error) {
      console.error('Error deleting machinery:', error);
      showToast('danger', 'Error deleting machinery');
    }
  };

  const handleEdit = async (row) => {
    console.log('handle Edit', row);

    // ✅ Initialize machine data
    setEditData({
      id: row.id,
      machine_name: row.machine_name,
      register_number: row.register_number,
      ownership_type: row.ownership_type,
      operator_id: row.operator_id || [],
      mode_id: row.mode_id || [],
    });

    try {
      // ✅ Filter modes using mode_id (not machine_id)
      const selectedModes = (row.mode_id || [])
        .map(id => prices.find(p => String(p.id) === String(id)))
        .filter(Boolean);

      console.log('Selected modes for edit:', selectedModes);

      const existingModes = selectedModes.map((p) => ({
        id: p.id,
        mode: p.mode,
        price: Number(p.price),
      }));

      setEditModes(existingModes);
    } catch (error) {
      console.error('Error preparing machine modes:', error);
      setEditModes([]);
    }

    setVisible(true);
  };


  // Handle price change in edit
  const handlePriceChange = (index, value) => {
    const newModes = [...editModes];
    newModes[index].price = Number(value);
    setEditModes(newModes);
  };

  // Add new mode-price pair in edit
  const handleAddMode = (e) => {
    const selectedMode = e.target.value;
    if (!selectedMode) return;

    // Avoid duplicates
    if (editModes.some(mp => mp.mode === selectedMode)) {
      return;
    }

    const matchingPrice = prices.find(p => p.mode === selectedMode)?.price || 0;

    setEditModes([...editModes, { mode: selectedMode, price: Number(matchingPrice) }]);

    e.target.value = '';
  };

  // Remove mode-price pair in edit
  // ✅ Remove mode only from machine, not from global mode table
  const removeEditModePrice = (index) => {
    const modeToRemove = editModes[index];

    // Remove mode from local edit list
    const newModes = editModes.filter((_, i) => i !== index);
    setEditModes(newModes);

    // Remove mode ID from machine's mode_id list
    setEditData((prev) => ({
      ...prev,
      mode_id: prev.mode_id.filter((id) => String(id) !== String(modeToRemove.id)),
    }));
  };


  const getModeNames = (modeIds) => {
    if (!Array.isArray(modeIds)) return [];
    return modeIds
      .map(id => {
        const mode = prices.find(p => String(p.id) === String(id));
        return mode ? mode.mode : null;
      })
      .filter(Boolean);
  };


  const handleUpdate = async () => {
    if (!editData.machine_name.trim()) return showToast('danger', 'Machine Name is required');
    if (!editData.register_number.trim()) return showToast('danger', 'Registration Number is required');
    if (!editData.ownership_type) return showToast('danger', 'Ownership Type is required');
    // if (editData.operator_id.length === 0) return showToast('danger', 'Please select at least one operator');
    if (editModes.some((m) => !m.mode || !m.price || m.price <= 0))
      return showToast('danger', 'Please fill all mode and price fields correctly');

    try {
      console.log('edit', editData);

      // 1️⃣ Update machine basic details
      await put(`/api/machine-operators/${editData.id}`, {
        machine_name: editData.machine_name,
        register_number: editData.register_number,
        ownership_type: editData.ownership_type,
        operator_id: editData.operator_id,
      });

      // 2️⃣ Track any new mode IDs created during this edit
      const newModeIds = [...(editData.mode_id || [])];

      // 3️⃣ Update or create each mode
      // 3️⃣ Update or link existing modes instead of creating new ones
      for (const modeObj of editModes) {
        // Try to find existing mode in global price list
        const existingMode = prices.find(p => p.mode === modeObj.mode);

        if (existingMode) {
          // ✅ Reuse existing mode, just update price if changed
          if (existingMode.price !== modeObj.price) {
            await put(`/api/machine-price/${existingMode.id}`, {
              ...existingMode,
              price: modeObj.price,
            });
          }

          if (!newModeIds.includes(String(existingMode.id))) {
            newModeIds.push(String(existingMode.id));
          }
        } else {
          // ✅ Only create mode if it doesn't exist globally
          const response = await postAPICall('/api/machine-price', {
            mode: modeObj.mode,
            price: modeObj.price,
          });

          const newModeId = response.data?.id;
          if (newModeId) newModeIds.push(String(newModeId));
        }
      }


      // 4️⃣ Update machine record to include new mode_id array
      await put(`/api/machine-operators/${editData.id}`, {
        mode_id: newModeIds,
      });

      // 5️⃣ Refresh both prices and machineries (no full reload)
      await fetchPrices();
      await fetchMachineries();

      // ✅ Close modal and notify success
      setVisible(false);
      showToast('success', 'Machine updated successfully');
    } catch (error) {
      console.error('Error updating machinery:', error);
      showToast('danger', 'Failed to update machinery');
    }
  };

  const handleAdd = () => {
    navigate('/addMachinery');
  };

  useEffect(() => {
    fetchMachineries();
    fetchUsers();
    fetchPrices();
  }, []);

  // Remove operator from selected list
  const handleRemoveOperator = (operatorId) => {
    setEditData((prev) => ({
      ...prev,
      operator_id: prev.operator_id.filter((id) => String(id) !== String(operatorId)),
    }));
  };

  // Add operator to selected list
  const handleAddOperator = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    setEditData((prev) => {
      if (prev.operator_id.includes(String(selectedId))) {
        return prev; // avoid duplicates
      }
      return {
        ...prev,
        operator_id: [...prev.operator_id, String(selectedId)],
      };
    });

    // reset dropdown
    e.target.value = '';
  };

  // Compute unique modes from prices for the dropdown
  const uniqueModes = [...new Set(prices.map(p => p.mode))];

  // Available modes not already assigned
  const availableModes = uniqueModes.filter(mode => !editModes.some(mp => mp.mode === mode));

  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" size="lg" />
        <p className="mt-3 text-muted">Loading machines...</p>
      </div>
    );
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Machineries List</strong>
          <CButton color="danger" onClick={handleAdd}>
            Add New Machinery
          </CButton>
        </CCardHeader>
        <CCardBody>
          <div className="table-responsive" style={{
            width: '100%',
            overflowX: 'auto',
            overflowY: 'auto',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            backgroundColor: '#fff'
          }}>
            <CTable hover striped bordered color="light" className="mb-0">
              <CTableHead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 10 }}>
                <CTableRow>
                  <CTableHeaderCell className="text-center align-middle">SR. NO.</CTableHeaderCell>
                  <CTableHeaderCell className="text-center align-middle">Machine Name</CTableHeaderCell>
                  <CTableHeaderCell className="text-center align-middle">Reg. Number</CTableHeaderCell>
                  <CTableHeaderCell className="text-center align-middle">Ownership</CTableHeaderCell>
                  <CTableHeaderCell className="text-center align-middle">Operators</CTableHeaderCell>
                  <CTableHeaderCell className="text-center align-middle">Modes</CTableHeaderCell>
                  <CTableHeaderCell className="text-center align-middle">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {rows.length > 0 ? (
                  rows.map((row, index) => (
                    <CTableRow key={row.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{row.machine_name}</CTableDataCell>
                      <CTableDataCell>{row.register_number}</CTableDataCell>
                      <CTableDataCell>{row.ownership_type == "owned" ? "Own" : row.ownership_type == "rented" ? "Rent" : "Lease"}</CTableDataCell>
                      <CTableDataCell>
                        {row?.operator_id?.map((id) => {
                          const op = users.find((u) => String(u.id) === String(id));
                          return <li style={{ listStyleType: 'none' }} key={id}>{op?.name}</li>
                        })}
                      </CTableDataCell>
                      <CTableDataCell>
                        {
                          getModeNames(row.mode_id).map((mode, i) => (
                            <li style={{ listStyleType: 'none' }} key={i}>{mode}</li>
                          ))
                        }
                      </CTableDataCell>


                      <CTableDataCell style={{ minHeight: '100%' }}>
                        <CButton
                          color="info"
                          size="sm"
                          className="me-2 text-white"
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
                    <CTableDataCell colSpan={7} className="text-center">
                      No machineries found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Edit Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Edit Machinery</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {/* Row 1: Machine Info */}
          <div className="row">
            <div className="col-md-4 mb-3">
              <CFormInput
                type="text"
                label="Machine Name"
                value={editData.machine_name || ''}
                onChange={(e) => setEditData({ ...editData, machine_name: e.target.value })}
              />
            </div>
            <div className="col-md-4 mb-3">
              <CFormInput
                type="text"
                label="Reg. Number"
                value={editData.register_number || ''}
                onChange={(e) => setEditData({ ...editData, register_number: e.target.value })}
              />
            </div>
            <div className="col-md-4 mb-3">
              <CFormSelect
                label="Ownership Type"
                value={editData.ownership_type || ''}
                onChange={(e) => setEditData({ ...editData, ownership_type: e.target.value })}
              >
                <option value="">-- Select Ownership Type --</option>
                <option value="owned">Own</option>
                <option value="rented">Rent</option>
                <option value="leased">Lease</option>
              </CFormSelect>
            </div>
          </div>

          {/* ====================== MODES SECTION ====================== */}
          <div className=" position-relative">
            <span
              style={{
                position: "relative",
                top: "3px",
                left: "0",
                backgroundColor: "white",
                paddingRight: "8px",
                color: "#0d6efd",
                fontWeight: "600",
              }}
            >
              Modes detail
            </span>
            <hr
              style={{
                marginTop: "0.5rem",
                border: "none",
                borderTop: "2px solid #0d6efd", // solid blue line
              }}
            />
          </div>

          <div className="row align-items-start">
            {/* Add Mode */}
            <div className="col-md-6 mb-3">
              <CFormSelect
                className="mt-2"
                defaultValue=""
                onChange={handleAddMode}
                label="Add Mode"
              >
                <option value="">-- Select Mode --</option>
                {availableModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </CFormSelect>
            </div>

            {/* Assigned Modes */}
            <div className="col-md-6 mb-3">
              <label className="form-label"><strong>Assigned Modes</strong></label>
              <div
                className="p-2 border rounded bg-light"
                style={{ maxHeight: "250px", overflowY: "auto" }}
              >
                {editModes.length > 0 ? (
                  editModes.map((mp, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center mb-2"
                    >
                      <span>
                        <span
                          style={{
                            display: "inline-block",
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "#0d6efd",
                            marginRight: "8px",
                          }}
                        ></span>
                        {mp.mode} -
                        <span style={{ marginLeft: "10px", fontWeight: "500" }}>
                          ₹{mp.price}
                        </span>
                      </span>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => removeEditModePrice(index)}
                      >
                        Remove
                      </CButton>
                    </div>
                  ))
                ) : (
                  <div className="text-muted">No modes assigned</div>
                )}
              </div>
            </div>
          </div>

          <div className="position-relative">
            <span
              style={{
                position: "relative",
                top: "3px",
                left: "0",
                backgroundColor: "white",
                paddingRight: "8px",
                color: "#0d6efd",
                fontWeight: "600",
              }}
            >
              Operators detail
            </span>
            <hr
              style={{
                marginTop: "0.5rem",
                border: "none",
                borderTop: "2px solid #0d6efd", // solid blue line
              }}
            />
          </div>
          {/* ====================== OPERATORS SECTION ====================== */}
          <div className="row align-items-start">
            {/* Add Operator */}
            <div className="col-md-6 mb-3">
              <CFormSelect
                className="mt-2"
                defaultValue=""
                onChange={handleAddOperator}
                label="Add Operator"
              >
                <option value="">-- Select Operator --</option>
                {users.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </CFormSelect>
            </div>

            {/* Assigned Operators */}
            <div className="col-md-6 mb-3">
              <label className="form-label"><strong>Assigned Operators</strong></label>
              <div
                className="p-2 border rounded bg-light"
                style={{ maxHeight: "250px", overflowY: "auto" }}
              >
                {editData.operator_id.length > 0 ? (
                  editData.operator_id.map((id) => {
                    const op = users.find((u) => String(u.id) === String(id));
                    return (
                      <div
                        key={id}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <span>
                          <span
                            style={{
                              display: "inline-block",
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: "#0d6efd",
                              marginRight: "8px",
                            }}
                          ></span>
                          {op ? op.name : `Operator ID ${id}`}
                        </span>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleRemoveOperator(id)}
                        >
                          Remove
                        </CButton>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-muted">No operators assigned</div>
                )}
              </div>
            </div>
          </div>
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
        resource="Delete Machinery"
        message="Do you want to delete this Machinery?"
      />
    </>
  );
}

export default MachineriesTable;