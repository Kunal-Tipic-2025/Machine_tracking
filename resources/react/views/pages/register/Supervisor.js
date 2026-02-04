import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
  CTooltip
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilMobile, cilPeople, cibAmazonPay, cilMoney, } from '@coreui/icons'
import { getAPICall, register, put, deleteAPICall } from '../../../util/api'
import { getUserData } from '../../../util/session'
import { useToast } from '../../common/toast/ToastContext'
import ConfirmationModal from '../../common/ConfirmationModal'

const SupervisorsList = () => {
  const [supervisors, setSupervisors] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editSupervisor, setEditSupervisor] = useState(null)
  const [validated, setValidated] = useState(false)
  const [companyList, setCompanyList] = useState([])
  const [machines, setMachines] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedMachines, setSelectedMachines] = useState([])
  const [selectedProjects, setSelectedProjects] = useState([])

  // Delete modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Edit modal: track pending machine adds/removes
  const [editMachines, setEditMachines] = useState({ adds: [], removes: [] })

  // Password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validation states
  const [isEmailInvalid, setIsEmailInvalid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileInvalid, setIsMobileInvalid] = useState(false)
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false)
  const [isConfirmPasswordInvalid, setIsConfirmPasswordInvalid] = useState(false)
  const [isTypeInvalid, setTypeIsInvalid] = useState(false)
  const [isCompanyInvalid, setCompanyIsInvalid] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('')

  const [selectedType, setSelectedType] = useState('')
  const [isPaymentInvalid, setIsPaymentInvalid] = useState(false)
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('')

  const [isAddressInvalid, setIsAddressInvalid] = useState(false)
  const [addressErrorMessage, setAddressErrorMessage] = useState('')

  // Form refs
  const nameRef = useRef()
  const emailRef = useRef()
  const mobileRef = useRef()
  const pwdRef = useRef()
  const cPwdRef = useRef()
  const typeRef = useRef()
  const companyRef = useRef()
  const payment = useRef()
  const addressRef = useRef()

  const { showToast } = useToast()
  const user = getUserData()


  let userTypes = []
  if (user.type === 0) {
    userTypes = [
      { label: 'Select User Type ', value: '' },
      { label: 'Super Admin', value: '0' },
      { label: 'Admin', value: '1' },
      { label: 'User', value: '2', disabled: false },
    ]
  } else if (user.type === 1) {
    userTypes = [
      { label: 'Select User Type ', value: '' },
      { label: 'Admin', value: '1' },
      { label: 'Operator', value: '2', disabled: false },
      { label: 'Helper', value: '4', disabled: false },
    ]
  } else {
    userTypes = [
      { label: 'Select User Type ', value: '' },
      { label: 'User', value: '2', disabled: false }
    ]
  }

  // Validation functions
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  const validateMobile = (mobile) => mobile.replace(/\D/g, '').length === 10
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)

  const handleEmailChange = () => {
    const email = emailRef.current?.value || ''
    if (email && !validateEmail(email)) {
      setIsEmailInvalid(true)
      setEmailErrorMessage('Please enter a valid email address')
    } else {
      setIsEmailInvalid(false)
      setEmailErrorMessage('')
    }
  }

  const handleMobileChange = () => {
    const mobile = mobileRef.current?.value || ''
    if (mobile && !validateMobile(mobile)) {
      setIsMobileInvalid(true)
      setMobileErrorMessage('Please enter exactly 10 digits')
    } else {
      setIsMobileInvalid(false)
      setMobileErrorMessage('')
    }
  }

  const handleAddressChange = () => {
    const addressValue = addressRef.current?.value || ''
    if (addressValue.trim().length === 0) {
      setIsAddressInvalid(true)
      setAddressErrorMessage('Please enter Address')
    } else {
      setIsAddressInvalid(false)
      setAddressErrorMessage('')
    }
  }

  const handlePaymentChange = () => {
    const paymentValue = payment.current?.value || ''
    if (selectedType === 2) {
      if (!paymentValue || paymentValue.trim() === '') {
        setIsPaymentInvalid(true)
        setPaymentErrorMessage('Payment per month is required for Operator')
      } else if (parseInt(paymentValue) <= 0) {
        setIsPaymentInvalid(true)
        setPaymentErrorMessage('Payment must be greater than 0')
      } else {
        setIsPaymentInvalid(false)
        setPaymentErrorMessage('')
      }
    } else if (selectedType === 4) {
      if (!paymentValue || paymentValue.trim() === '') {
        setIsPaymentInvalid(true)
        setPaymentErrorMessage('Payment per month is required for Helper')
      } else if (parseInt(paymentValue) <= 0) {
        setIsPaymentInvalid(true)
        setPaymentErrorMessage('Payment must be greater than 0')
      } else {
        setIsPaymentInvalid(false)
        setPaymentErrorMessage('')
      }
    } else {
      setIsPaymentInvalid(false)
      setPaymentErrorMessage('')
    }
  }

  const handlePasswordChange = () => {
    const password = pwdRef.current?.value || ''
    if (password && !validatePassword(password)) {
      setIsPasswordInvalid(true)
      setPasswordErrorMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character')
    } else {
      setIsPasswordInvalid(false)
      setPasswordErrorMessage('')
    }
    if (cPwdRef.current?.value) handleConfirmPasswordChange()
  }

  const handleConfirmPasswordChange = () => {
    const password = pwdRef.current?.value || ''
    const confirmPassword = cPwdRef.current?.value || ''
    if (confirmPassword && password !== confirmPassword) {
      setIsConfirmPasswordInvalid(true)
      setConfirmPasswordErrorMessage('Passwords do not match')
    } else {
      setIsConfirmPasswordInvalid(false)
      setConfirmPasswordErrorMessage('')
    }
  }

  const handleSelect = (_, isCompany = false) => {
    const value = parseInt(isCompany ? companyRef.current.value : typeRef.current.value, 10)
    if (isCompany) {
      setCompanyIsInvalid(!(value > 0))
    } else {
      setTypeIsInvalid(![0, 1, 2, 3, 4].includes(value))
      setSelectedType(value)
    }
  }

  // Fetch machines
  const fetchMachines = async () => {
    try {
      const response = await getAPICall("/api/machine-operators")
      setMachines(response || [])
    } catch (error) {
      console.error("Error fetching machines:", error)
      showToast("danger", "Error fetching machines")
    }
  }

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await getAPICall("/api/myProjects")
      setProjects(response || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  // Fetch companies
  useEffect(() => {
    getAPICall('/api/companies')
      .then((resp) => {
        if (resp?.length) {
          const mappedList = resp.map(itm => ({ label: itm.company_name, value: itm.company_id }))
          if (user.type === 0) {
            setCompanyList(mappedList)
          } else {
            setCompanyList(mappedList.filter(e => e.value === user.company_id))
          }
        }
      })
      .catch(err => showToast('danger', 'Error: ' + err))
  }, [])

  // Fetch supervisors
  const fetchSupervisors = async () => {
    try {
      setIsLoading(true);
      const resp = await getAPICall('/api/appUsers');

      let filteredOperators = [];

      if (resp?.data && Array.isArray(resp.data)) {
        // Filter users belonging to current company
        filteredOperators = resp.data.filter(op =>


          String(op.company_id) === String(user.company_id)
        );
      }

      setSupervisors(filteredOperators);
    } catch (error) {
      console.error('Error fetching operators:', error);
      showToast('danger', 'Error fetching operators: ' + error.message);
      setSupervisors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors()
    fetchMachines()
    fetchProjects()



  }, [])

  const resetForm = () => {
    if (nameRef.current) nameRef.current.value = ""
    if (emailRef.current) emailRef.current.value = ""
    if (mobileRef.current) mobileRef.current.value = ""
    if (pwdRef.current) pwdRef.current.value = ""
    if (cPwdRef.current) cPwdRef.current.value = ""
    if (typeRef.current) typeRef.current.value = ""
    if (companyRef.current) companyRef.current.value = ""
    if (payment.current) payment.current.value = ""
    if (addressRef.current) addressRef.current.value = ""

    setValidated(false)
    setTypeIsInvalid(false)
    setCompanyIsInvalid(false)
    setIsEmailInvalid(false)
    setIsMobileInvalid(false)
    setIsPasswordInvalid(false)
    setIsConfirmPasswordInvalid(false)
    setEmailErrorMessage('')
    setMobileErrorMessage('')
    setPasswordErrorMessage('')
    setConfirmPasswordErrorMessage('')
    setShowPassword(false)
    setShowConfirmPassword(false)
    setSelectedMachines([])
    setSelectedProjects([])
    setSelectedType('')
    setIsPaymentInvalid(false)
    setPaymentErrorMessage('')
    setIsAddressInvalid(false)
    setAddressErrorMessage('')
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const handleDelete = (operatorId) => {
    setDeleteId(operatorId);
    setDeleteModalVisible(true);
  }

  const confirmDelete = async () => {
    try {
      await deleteAPICall(`/api/appUsers/delete/${deleteId.id}`)
      showToast("success", "User deleted successfully.")
      setDeleteModalVisible(false);
      fetchSupervisors()
    } catch (err) {
      console.error("Error deleting user:", err)
      showToast("danger", "Failed to delete user!")
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    setValidated(true);

    handleEmailChange();
    handleMobileChange();
    handlePasswordChange();
    handleConfirmPasswordChange();
    handleSelect(null, false);
    handleSelect(null, true);
    handlePaymentChange();
    handleAddressChange();

    if (
      form.checkValidity() === false ||
      isEmailInvalid ||
      isMobileInvalid ||
      isPasswordInvalid ||
      isConfirmPasswordInvalid ||
      isTypeInvalid ||
      isCompanyInvalid ||
      isPaymentInvalid ||
      isAddressInvalid
    ) {
      showToast("danger", "Please check All Fields before submitting");
      return;
    }

    const supervisorData = {
      name: nameRef.current?.value.trim(),
      email: emailRef.current?.value.trim(),
      mobile: mobileRef.current?.value.trim(),
      password: pwdRef.current?.value,
      password_confirmation: cPwdRef.current?.value,
      type: typeRef.current?.value,
      company_id: companyRef.current?.value,
    };

    if (selectedType === 2 && payment.current?.value) {
      supervisorData.payment_per_hour = payment.current.value;
    }

    if (selectedType === 4 && payment.current?.value) {
      supervisorData.payment_per_hour = payment.current.value;
    }

    if (addressRef.current?.value) {
      supervisorData.address = addressRef.current.value.trim();
    }

    try {
      const resp = await register(supervisorData);
      if (resp.id) {
        const newSupervisorId = resp.id || resp.data?.id;

        // ---------- ASSIGN MACHINES ----------
        if (selectedMachines.length > 0 && newSupervisorId) {
          for (const machineId of selectedMachines) {
            const machine = machines.find((m) => m.id === parseInt(machineId));
            if (machine) {
              const updatedOperatorIds = Array.isArray(machine.operator_id)
                ? [...new Set([...machine.operator_id.map(String), String(newSupervisorId)])]
                : [String(newSupervisorId)];
              await put(`/api/machine-operators/${machineId}`, { operator_id: updatedOperatorIds });
            }
          }
        }

        // ---------- ASSIGN PROJECTS ----------
        if (selectedProjects.length > 0 && newSupervisorId) {
          for (const projectId of selectedProjects) {
            const project = projects.find((p) => p.id === parseInt(projectId));
            if (project) {
              const updatedOperatorIds = Array.isArray(project.operator_id)
                ? [...new Set([...project.operator_id.map(String), String(newSupervisorId)])]
                : [String(newSupervisorId)];
              await put(`/api/projects/${projectId}`, { operator_id: updatedOperatorIds });
            }
          }
        }

        // ---------- SUCCESS TOAST ----------
        const isOperator = supervisorData.type === "2";   // <-- detect Operator
        showToast(
          "success",
          isOperator
            ? "New operator created and assigned successfully"
            : "New supervisor created successfully"
        );

        if (supervisorData.type === "4") { // <-- detect Helper
          showToast(
            "success",
            "New Helper created successfully"
          );
        };


        closeModal();
        fetchSupervisors();
        fetchMachines();
        fetchProjects();
      } else {
        showToast("danger", "Error occurred, please try again later.");
      }
    } catch (error) {
      showToast("danger", error.message);
    }
  };

  // Open edit modal
  const openEditModal = (supervisor) => {
    setEditSupervisor(supervisor)
    setEditModal(true)
    setEditMachines({ adds: [], removes: [] }) // Reset pending changes
  }

  // Queue machine add
  const handleAddMachine = (machineId) => {
    if (!machineId || !editSupervisor) return

    const machine = machines.find((m) => m.id === parseInt(machineId))
    if (!machine) return

    const isAlreadyAssigned = Array.isArray(machine.operator_id) &&
      machine.operator_id.map(String).includes(String(editSupervisor.id))

    if (isAlreadyAssigned) {
      showToast("warning", "Machine already assigned")
      return
    }

    setEditMachines((prev) => ({
      ...prev,
      adds: [...new Set([...prev.adds, machineId])],
      removes: prev.removes.filter((id) => id !== machineId),
    }))
  }

  // Queue machine remove
  const handleRemoveMachine = (machineId) => {
    const machine = machines.find((m) => m.id === parseInt(machineId))
    if (!machine) return

    const isAssigned = Array.isArray(machine.operator_id) &&
      machine.operator_id.map(String).includes(String(editSupervisor.id))

    if (!isAssigned) {
      showToast("warning", "Machine not assigned")
      return
    }

    setEditMachines((prev) => ({
      ...prev,
      removes: [...new Set([...prev.removes, machineId])],
      adds: prev.adds.filter((id) => id !== machineId),
    }))
  }

  // Save all changes (user + machines)
  const MOBILE_REGEX = /^[6-9]\d{9}$/;   // 10 digits, starts with 6-9

  const handleUpdate = async () => {
    if (!editSupervisor) return;

    // -----------------------------------------------------------------
    // 1. Mobile validation
    // -----------------------------------------------------------------
    const cleanMobile = editSupervisor.mobile?.replace(/\D/g, '') ?? '';
    if (!MOBILE_REGEX.test(cleanMobile)) {
      showToast(
        'danger',
        'Please enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.'
      );
      return;
    }

    try {
      // -----------------------------------------------------------------
      // 2. Update user profile
      // -----------------------------------------------------------------
      const payload = {
        id: editSupervisor.id,
        name: editSupervisor.name,
        email: editSupervisor.email,
        mobile: cleanMobile,               // store only digits
        type: editSupervisor.type,
        company_id: editSupervisor.company_id || user.company_id,
        // type: editSupervisor.type,
        company_id: editSupervisor.company_id || user.company_id,
        blocked: editSupervisor.blocked ?? 0,
      };

      // Add payment_per_hour if type is Operator (2)
      if (editSupervisor.type === 2 && editSupervisor.payment) {
        payload.payment_per_hour = editSupervisor.payment;
      }

      if (editSupervisor.type === 4 && editSupervisor.payment) {
        payload.payment_per_hour = editSupervisor.payment;
      }

      const resp = await put(`/api/userUpdated/${editSupervisor.id}`, payload);
      if (!resp?.success) {
        showToast('danger', resp?.message || 'Update failed');
        return;
      }

      // -----------------------------------------------------------------
      // 3. Process machine ADDS & REMOVES in parallel
      // -----------------------------------------------------------------
      const addPromises = editMachines.adds.map(async (machineId) => {
        const machine = machines.find((m) => m.id === parseInt(machineId));
        if (!machine) return;

        const current = Array.isArray(machine.operator_id)
          ? machine.operator_id.map(String)
          : [];

        const updated = [...new Set([...current, String(editSupervisor.id)])];
        await put(`/api/machine-operators/${machineId}`, { operator_id: updated });
      });

      const removePromises = editMachines.removes.map(async (machineId) => {
        const machine = machines.find((m) => m.id === parseInt(machineId));
        if (!machine) return;

        const current = Array.isArray(machine.operator_id)
          ? machine.operator_id.map(String)
          : [];

        const updated = current.filter((id) => id !== String(editSupervisor.id));
        await put(`/api/machine-operators/${machineId}`, { operator_id: updated });
      });

      await Promise.all([...addPromises, ...removePromises]);

      // -----------------------------------------------------------------
      // 4. Success flow
      // -----------------------------------------------------------------
      showToast('success', 'Operators updated successfully');
      setEditModal(false);
      setEditMachines({ adds: [], removes: [] });
      await Promise.all([fetchSupervisors(), fetchMachines()]);
    } catch (error) {
      console.error('Error in handleUpdate:', error);
      showToast('danger', `Error updating operators: ${error.message}`);
    }
  };

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

  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" size="lg" />
        <p className="mt-3 text-muted">Loading Operators...</p>
      </div>
    )
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-column">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={12} lg={12} xl={12}>
            <CCard>
              <CCardHeader className="d-flex justify-content-between align-items-center">
                <strong>Operators List</strong>
                <CButton color="danger" onClick={() => setShowModal(true)} className="text-white">
                  Add New Operator
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
                        <CTableHeaderCell className="text-center align-middle">Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-center align-middle" >Email</CTableHeaderCell>
                        <CTableHeaderCell className="text-center align-middle">Mobile</CTableHeaderCell>
                        <CTableHeaderCell className="text-center align-middle">Address</CTableHeaderCell>
                        <CTableHeaderCell className="text-center align-middle">Type</CTableHeaderCell>
                        <CTableHeaderCell className="text-center align-middle">Payment</CTableHeaderCell>
                        <CTableHeaderCell className="text-center align-middle">Machines</CTableHeaderCell>
                        <CTableHeaderCell className="text-center align-middle">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {supervisors.map((u, index) => {
                        const assignedMachines = machines.filter(
                          (machine) =>
                            Array.isArray(machine.operator_id) &&
                            machine.operator_id.map(String).includes(String(u.id))
                        )

                        console.log("User : ", u);


                        return (
                          <CTableRow key={u.id}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>{u.name}
                            </CTableDataCell>
                            <CTableDataCell>
                              <TruncatedCell>{u.email}</TruncatedCell>
                            </CTableDataCell>
                            <CTableDataCell>{u.mobile}</CTableDataCell>
                            <CTableDataCell>{u.address}</CTableDataCell>
                            <CTableDataCell>
                              {u.type === 0 ? "Super Admin" : u.type === 1 ? "Admin" : u.type === 2 ? "Operator" : "Helper"}
                            </CTableDataCell>
                            <CTableDataCell>{u.payment}</CTableDataCell>
                            <CTableDataCell>
                              <TruncatedCell>{assignedMachines.length > 0
                                ? assignedMachines.map((m) => m.machine_name).join(", ")
                                : "-"}</TruncatedCell>


                            </CTableDataCell>
                            <CTableDataCell className="d-flex gap-2 justify-content-center">
                              <CButton size="sm" color="info" className="text-white" onClick={() => openEditModal(u)}>
                                Edit
                              </CButton>
                              <CButton color="danger" size="sm" onClick={() => handleDelete(u)}>
                                Delete
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        )
                      })}
                    </CTableBody>
                  </CTable>

                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      {/* ADD NEW SUPERVISOR MODAL */}
      <CModal visible={showModal} onClose={closeModal} backdrop="static" keyboard={false} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Add New Operator</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate validated={validated} onSubmit={handleSubmit}>
            <CInputGroup className="mb-4">
              <CInputGroupText><CIcon icon={cibAmazonPay} /></CInputGroupText>
              <CFormSelect
                onChange={(e) => handleSelect(e, true)}
                aria-label="Select Shop / Company"
                ref={companyRef}
                invalid={isCompanyInvalid}
                options={companyList}
                feedbackInvalid="Select Shop / Company"
                disabled
              />
            </CInputGroup>

            <div className={`d-flex ${selectedType === 2 ? 'gap-3' : ''} mb-3 flex-wrap`}>
              {/* User Type Select */}
              <div className={`${selectedType === 2 ? 'flex-fill' : 'w-100'}`}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilPeople} />
                  </CInputGroupText>
                  <CFormSelect
                    onChange={handleSelect}
                    aria-label="Select user type"
                    ref={typeRef}
                    invalid={isTypeInvalid}
                    options={userTypes}
                    feedbackInvalid="Please select a valid option."
                    required
                  />
                </CInputGroup>
              </div>

              {/* Payment (only if selectedType === 2) */}
              {selectedType === 2 && (
                <div className="flex-fill">
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilMoney} />
                    </CInputGroupText>
                    <CFormInput
                      ref={payment}
                      placeholder="Add payment per Month"
                      required
                      invalid={isPaymentInvalid}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        e.target.value = value;
                        handlePaymentChange();
                      }}
                      feedbackInvalid={paymentErrorMessage || "Please provide payment per month."}
                      maxLength="10"
                    />
                  </CInputGroup>
                </div>
              )}

              {/* Payment (only if selectedType === 4) */}
              {selectedType === 4 && (
                <div className="flex-fill mt-4">
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilMoney} />
                    </CInputGroupText>
                    <CFormInput
                      ref={payment}
                      placeholder="Add payment per Month"
                      required
                      invalid={isPaymentInvalid}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        e.target.value = value;
                        handlePaymentChange();
                      }}
                      feedbackInvalid={paymentErrorMessage || "Please provide payment per month."}
                      maxLength="10"
                    />
                  </CInputGroup>
                </div>
              )}

            </div>

            <div className="d-flex gap-3 mb-3">
              <div className="flex-fill">
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    ref={nameRef}
                    type="text"
                    placeholder="Name"
                    required
                    invalid={validated && !nameRef.current?.value}
                    feedbackInvalid="Please provide a valid supervisor name."
                  />
                </CInputGroup>
              </div>

              <div className="flex-fill">
                <CInputGroup>
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    ref={emailRef}
                    type="email"
                    placeholder="Email"
                    required
                    invalid={validated && (isEmailInvalid || !emailRef.current?.value)}
                    onChange={handleEmailChange}
                    feedbackInvalid={emailErrorMessage || "Please provide a valid email."}
                  />
                </CInputGroup>
              </div>
            </div>



            <div className="d-flex gap-3 mb-3">
              <div className="flex-fill">
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilMobile} />
                  </CInputGroupText>
                  <CFormInput
                    ref={mobileRef}
                    placeholder="Mobile (10 digits)"
                    required
                    invalid={isMobileInvalid}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      e.target.value = value;
                      handleMobileChange(e);
                    }}
                    feedbackInvalid={mobileErrorMessage || "Please provide a valid mobile number."}
                    maxLength="10"
                  />
                </CInputGroup>
              </div>

              <div className="flex-fill">
                <CInputGroup>
                  <CInputGroupText>📍</CInputGroupText>
                  <CFormInput
                    ref={addressRef}
                    placeholder="Address"
                    required
                    invalid={isAddressInvalid}
                    onChange={handleAddressChange}
                    feedbackInvalid={addressErrorMessage || "Please provide address."}
                  />
                </CInputGroup>
              </div>
            </div>


            <div className="d-flex flex-wrap gap-3 mb-3">
              {/* New Password */}
              <div className="flex-fill" style={{ position: 'relative' }}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type={showPassword ? "text" : "password"}
                    ref={pwdRef}
                    placeholder="Enter New Password"
                    required
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    style={{
                      paddingRight: '45px',
                      border: isPasswordInvalid ? '1px solid #dc3545' : undefined
                    }}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#6c757d',
                      zIndex: 10,
                      userSelect: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px'
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </div>
                </CInputGroup>
                {isPasswordInvalid && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {passwordErrorMessage || "Please provide a valid password."}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex-fill" style={{ position: 'relative' }}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type={showConfirmPassword ? "text" : "password"}
                    ref={cPwdRef}
                    placeholder="Confirm Password"
                    required
                    onChange={handleConfirmPasswordChange}
                    autoComplete="new-password"
                    style={{
                      paddingRight: '45px',
                      border: isConfirmPasswordInvalid ? '1px solid #dc3545' : undefined
                    }}
                  />
                  <div
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#6c757d',
                      zIndex: 10,
                      userSelect: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px'
                    }}
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </div>
                </CInputGroup>
                {isConfirmPasswordInvalid && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {confirmPasswordErrorMessage || "Please confirm your password."}
                  </div>
                )}
              </div>

            </div>


            {/* ✅ Assign Projects Section */}
            {/* <div className="mb-3">
              <label className="form-label"><strong>Assign Projects (Optional)</strong></label>
              <div className="p-2 border rounded bg-light">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div key={project.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`project-${project.id}`}
                        value={project.id}
                        checked={selectedProjects.includes(String(project.id))}
                        onChange={(e) => {
                          const projectId = e.target.value
                          if (e.target.checked) {
                            setSelectedProjects([...selectedProjects, projectId])
                          } else {
                            setSelectedProjects(selectedProjects.filter(id => id !== projectId))
                          }
                        }}
                      />
                      <label className="form-check-label" htmlFor={`project-${project.id}`}>
                        {project.project_name}
                      </label>
                    </div>
                  ))
                ) : (
                  <div>No projects available</div>
                )}
              </div>
            </div> */}

            {/* ✅ Assign Machines Section */}
            {/* <div className="mb-3">
              <label className="form-label"><strong>Assign Machines (Optional)</strong></label>
              <div className="p-2 border rounded bg-light">
                {machines.length > 0 ? (
                  machines.map((machine) => (
                    <div key={machine.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`machine-${machine.id}`}
                        value={machine.id}
                        checked={selectedMachines.includes(String(machine.id))}
                        onChange={(e) => {
                          const machineId = e.target.value
                          if (e.target.checked) {
                            setSelectedMachines([...selectedMachines, machineId])
                          } else {
                            setSelectedMachines(selectedMachines.filter(id => id !== machineId))
                          }
                        }}
                      />
                      <label className="form-check-label" htmlFor={`machine-${machine.id}`}>
                        {machine.machine_name}
                      </label>
                    </div>
                  ))
                ) : (
                  <div>No machines available</div>
                )}
              </div>
            </div> */}


            {selectedType === 2 && (
              <div className="mb-3">
                <label className="form-label"><strong>Assign Machines (Optional)</strong></label>
                <div className="p-2 border rounded bg-light">
                  {machines.length > 0 ? (
                    machines.map((machine) => (
                      <div key={machine.id} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`machine-${machine.id}`}
                          value={machine.id}
                          checked={selectedMachines.includes(String(machine.id))}
                          onChange={(e) => {
                            const machineId = e.target.value
                            if (e.target.checked) {
                              setSelectedMachines([...selectedMachines, machineId])
                            } else {
                              setSelectedMachines(selectedMachines.filter(id => id !== machineId))
                            }
                          }}
                        />
                        <label className="form-check-label" htmlFor={`machine-${machine.id}`}>
                          {machine.machine_name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div>No machines available</div>
                  )}
                </div>
              </div>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>Cancel</CButton>
          <CButton color="success" onClick={handleSubmit}>Save</CButton>
        </CModalFooter>
      </CModal>

      {/* EDIT SUPERVISOR MODAL */}
      <CModal visible={editModal} onClose={() => setEditModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Edit Operator</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {editSupervisor && (
            <>
              <div className="d-flex gap-3 mb-3">
                <div className="flex-fill">
                  <CFormInput
                    label="Name"
                    value={editSupervisor.name}
                    onChange={(e) => setEditSupervisor({ ...editSupervisor, name: e.target.value })}
                  />
                </div>
                <div className="flex-fill">
                  <CFormInput
                    label="Email"
                    value={editSupervisor.email}
                    onChange={(e) => setEditSupervisor({ ...editSupervisor, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex gap-3 mb-3">
                <div className="flex-fill">
                  <CFormInput
                    label="Mobile"
                    value={editSupervisor.mobile}
                    onChange={(e) => setEditSupervisor({ ...editSupervisor, mobile: e.target.value })}
                    maxLength={10}  // Restrict input to 10 characters
                    pattern="[6-9]\d{9}"  // Regex: Starts with 6-9, followed by exactly 9 digits
                    title="Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9"
                    invalid={editSupervisor.mobile && !/^[6-9]\d{9}$/.test(editSupervisor.mobile.replace(/\D/g, ''))}
                  />
                </div>
                <div className="flex-fill">
                  <CFormSelect
                    label="Type"
                    value={editSupervisor.type}
                    onChange={(e) => setEditSupervisor({ ...editSupervisor, type: parseInt(e.target.value) })}
                    options={userTypes}
                  />
                </div>
              </div>

              {/* Payment Input for Operators and Helpers */}
              {([2, 4].includes(parseInt(editSupervisor.type))) && (
                <div className="mb-3">
                  <CFormInput
                    label="Payment per Month"
                    value={editSupervisor.payment || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setEditSupervisor({ ...editSupervisor, payment: val });
                    }}
                    placeholder="Enter payment amount"
                  />
                </div>
              )}



              {editSupervisor.type === 2 && <div className="mb-2 position-relative">
                <span
                  style={{
                    position: "relative",
                    top: "10px",
                    left: "0",
                    backgroundColor: "white",
                    paddingRight: "8px",
                    color: "#0d6efd",
                    fontWeight: "600",
                  }}
                >
                  Machine
                </span>
                <hr
                  style={{
                    marginTop: "0.5rem",
                    border: "none",
                    borderTop: "2px solid #0d6efd", // solid blue line
                  }}
                />
              </div>}


              {/* Add Machine Dropdown */}
              {editSupervisor.type === 2 && <CFormSelect
                className="mb-3"
                label="Add Machine"
                value=""
                onChange={(e) => {
                  handleAddMachine(e.target.value)
                  e.target.value = ""
                }}
              >
                <option value="">-- Select Machine --</option>
                {machines.map((m) => {
                  const isAssigned = Array.isArray(m.operator_id) && m.operator_id.map(String).includes(String(editSupervisor.id))
                  const isPendingAdd = editMachines.adds.includes(String(m.id))
                  const disabled = isAssigned || isPendingAdd
                  return (
                    <option key={m.id} value={m.id} disabled={disabled}>
                      {m.machine_name} {disabled}
                    </option>
                  )
                })}
              </CFormSelect>}

              {/* Allocated Machines List */}
              {editSupervisor.type === 2 &&
                <div className="mt-4">
                  <label className="form-label"><strong>Allocated Machines</strong></label>

                  <div
                    className="p-2 border rounded bg-light"
                    style={{ maxHeight: "250px", overflowY: "auto" }}
                  >
                    {machines
                      .filter((m) => {
                        const isAssigned =
                          Array.isArray(m.operator_id) &&
                          m.operator_id.map(String).includes(String(editSupervisor.id));

                        const isPendingAdd = editMachines.adds.includes(String(m.id));
                        const isPendingRemove = editMachines.removes.includes(String(m.id));

                        // ✅ Show only machines that are assigned or newly added, not removed
                        return (isAssigned || isPendingAdd) && !isPendingRemove;
                      })
                      .map((m) => {
                        const isPendingAdd = editMachines.adds.includes(String(m.id));

                        return (
                          <div
                            key={m.id}
                            className="d-flex justify-content-between align-items-center mb-2"
                          >
                            <span>
                              • {m.machine_name}
                              {isPendingAdd && (
                                <small className="text-success ms-2"></small>
                              )}
                            </span>

                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => {
                                // 🔹 Instantly remove from frontend view
                                setEditMachines((prev) => ({
                                  ...prev,
                                  removes: [...prev.removes, String(m.id)],
                                  adds: prev.adds.filter((id) => id !== String(m.id)), // if it was newly added, remove from adds too
                                }));
                              }}
                            >
                              Remove
                            </CButton>
                          </div>
                        );
                      })}

                    {/* 🔹 No machines allocated */}
                    {machines.filter((m) => {
                      const isAssigned =
                        Array.isArray(m.operator_id) &&
                        m.operator_id.map(String).includes(String(editSupervisor.id));
                      const isPendingAdd = editMachines.adds.includes(String(m.id));
                      const isPendingRemove = editMachines.removes.includes(String(m.id));

                      return (isAssigned || isPendingAdd) && !isPendingRemove;
                    }).length === 0 && <div className="text-muted">No machines allocated</div>}
                  </div>
                </div>}

            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModal(false)}>Close</CButton>
          <CButton color="success" onClick={handleUpdate}>Save Changes</CButton>
        </CModalFooter>
      </CModal>

      <ConfirmationModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onYes={confirmDelete}
        resource="Delete Operator"
        message="Do you want to delete this Operator?"
      />
    </div>
  )
}

export default SupervisorsList