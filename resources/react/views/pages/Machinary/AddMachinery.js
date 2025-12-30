import React, { useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { getAPICall, postAPICall } from '../../../util/api';
import { useToast } from '../../common/toast/ToastContext';
import { getUserData } from '../../../util/session';

function AddMachinery() {
  const userData = getUserData();
  const company = userData?.company_info;
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 🔹 Main data for new machine
  const [data, setData] = useState({
    machine_name: '',
    register_number: '',
    ownership_type: '',
    operator_id: [],
    mode_id: [],
    company_id: company?.company_id || null,
  });

  // 🔹 Fetched data
  const [users, setUsers] = useState([]);
  const [availableModes, setAvailableModes] = useState([]); // from /api/machine-price
  const [selectedModes, setSelectedModes] = useState([]);   // user selected

  // 🧩 Fetch Operators
  const fetchUsers = async () => {
    try {
      const response = await getAPICall('/api/appUsers');
      const filteredUsers = response.data.filter((user) => user.type === 2);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching Users:', error);
      showToast('danger', 'Error fetching Users');
    }
  };

  // 🧩 Fetch Modes (machine-price)
  const fetchModes = async () => {
    try {
      const response = await getAPICall('/api/machine-price');
      setAvailableModes(response || []);
    } catch (error) {
      console.error('Error fetching modes:', error);
      showToast('danger', 'Error fetching modes');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchModes();
  }, []);

  // 🧩 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // 🧩 Add Operator
  const handleAddOperator = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    setData((prev) => {
      if (prev.operator_id.includes(String(selectedId))) return prev;
      return { ...prev, operator_id: [...prev.operator_id, String(selectedId)] };
    });

    e.target.value = '';
  };

  // 🧩 Remove Operator
  const handleRemoveOperator = (operatorId) => {
    setData((prev) => ({
      ...prev,
      operator_id: prev.operator_id.filter((id) => String(id) !== String(operatorId)),
    }));
  };

  // 🧩 Add Mode
  const handleAddMode = (e) => {
    const selectedMode = e.target.value;
    if (!selectedMode) return;

    if (selectedModes.some((m) => m.mode === selectedMode)) return;

    const matchingMode = availableModes.find((m) => m.mode === selectedMode);
    if (!matchingMode) return;

    setSelectedModes((prev) => [...prev, matchingMode]);

    setData((prev) => ({
      ...prev,
      mode_id: [...prev.mode_id, String(matchingMode.id)],
    }));

    e.target.value = '';
  };

  // 🧩 Remove Mode
  const handleRemoveMode = (index) => {
    const modeToRemove = selectedModes[index];
    const newList = selectedModes.filter((_, i) => i !== index);
    setSelectedModes(newList);

    setData((prev) => ({
      ...prev,
      mode_id: prev.mode_id.filter((id) => String(id) !== String(modeToRemove.id)),
    }));
  };

  // 🧩 Submit
  const handleSubmit = async () => {
    if (!data.machine_name.trim()) return showToast('danger', 'Machine Name is required');
    if (!data.register_number.trim()) return showToast('danger', 'Registration Number is required');
    if (!data.ownership_type) return showToast('danger', 'Ownership Type is required');
    // if (selectedModes.length === 0) return showToast('danger', 'Please select at least one mode');

    try {
      await postAPICall('/api/machine-operators', {
        machine_name: data.machine_name,
        register_number: data.register_number,
        ownership_type: data.ownership_type,
        operator_id: data.operator_id,
        mode_id: data.mode_id,
        company_id: data.company_id,
      });

      showToast('success', 'Machine added successfully!');
      navigate('/MachineriesTable');
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      showToast('danger', message);
    }
  };

  // 🧩 Mode dropdown
  const uniqueModes = [...new Set(availableModes.map((m) => m.mode))];
  const unassignedModes = uniqueModes.filter(
    (mode) => !selectedModes.some((m) => m.mode === mode)
  );

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Add New Machinery</strong>
      </CCardHeader>
      <CCardBody>
        {/* Machine Info */}
        <CRow>
          <CCol md={4}>
            <CFormLabel>Machine Name</CFormLabel>
            <CFormInput
              name="machine_name"
              placeholder="Enter Machine Name"
              value={data.machine_name}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel>Reg. Number</CFormLabel>
            <CFormInput
              name="register_number"
              placeholder="Enter Registration Number"
              value={data.register_number}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel>Ownership Type</CFormLabel>
            <CFormSelect
              name="ownership_type"
              value={data.ownership_type}
              onChange={handleChange}
            >
              <option value="">-- Select Ownership Type --</option>
              <option value="owned">Own</option>
              <option value="rented">Rent</option>
              <option value="leased">Lease</option>
            </CFormSelect>
          </CCol>
        </CRow>

        {/* ================= MODES SECTION ================= */}
        <div className="position-relative mt-4">
          <span className="fw-bold text-primary">Add Modes</span>
          <hr className="mt-2 border-2 border-primary" />
        </div>

        <CRow className="align-items-start mt-3">
          <CCol md={6}>
            <CFormSelect className="mt-2" defaultValue="" onChange={handleAddMode} label="Add Mode">
              <option value="">-- Select Mode --</option>
              {unassignedModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={6}>
            <label className="form-label">
              <strong>Assigned Modes</strong>
            </label>
            <div
              className="p-2 border rounded bg-light"
              style={{ maxHeight: '250px', overflowY: 'auto' }}
            >
              {selectedModes.length > 0 ? (
                selectedModes.map((mp, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <span>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#0d6efd',
                          marginRight: '8px',
                        }}
                      ></span>
                      {mp.mode} - <span className="fw-semibold">₹{mp.price}</span>
                    </span>
                    <CButton color="danger" size="sm" onClick={() => handleRemoveMode(index)}>
                      Remove
                    </CButton>
                  </div>
                ))
              ) : (
                <div className="text-muted">No modes assigned</div>
              )}
            </div>
          </CCol>
        </CRow>

        {/* ================= OPERATORS SECTION ================= */}
        <div className="position-relative mt-4">
          <span className="fw-bold text-primary">Add Operators</span>
          <hr className="mt-2 border-2 border-primary" />
        </div>

        <CRow className="align-items-start mt-3">
          <CCol md={6}>
            <CFormSelect className="mt-2" defaultValue="" onChange={handleAddOperator} label="Add Operator">
              <option value="">-- Select Operator --</option>
              {users.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={6}>
            <label className="form-label">
              <strong>Assigned Operators</strong>
            </label>
            <div
              className="p-2 border rounded bg-light"
              style={{ maxHeight: '250px', overflowY: 'auto' }}
            >
              {data.operator_id.length > 0 ? (
                data.operator_id.map((id) => {
                  const op = users.find((u) => String(u.id) === String(id));
                  return (
                    <div
                      key={id}
                      className="d-flex justify-content-between align-items-center mb-2"
                    >
                      <span>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: '#0d6efd',
                            marginRight: '8px',
                          }}
                        ></span>
                        {op ? op.name : `Operator ID ${id}`}
                      </span>
                      <CButton color="danger" size="sm" onClick={() => handleRemoveOperator(id)}>
                        Remove
                      </CButton>
                    </div>
                  );
                })
              ) : (
                <div className="text-muted">No operators assigned</div>
              )}
            </div>
          </CCol>
        </CRow>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="mt-4">
          <CButton color="primary" onClick={handleSubmit}>
            Add Machinery
          </CButton>
          <CButton color="secondary" className="ms-2" onClick={() => navigate('/MachineriesTable')}>
            Cancel
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  );
}

export default AddMachinery;
