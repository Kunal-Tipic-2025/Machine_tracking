
import React, { useEffect, useRef, useState } from 'react';
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
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
  CFormCheck,
} from '@coreui/react';
import { getAPICall, post, postFormData } from '../../../util/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/toast/ToastContext';
import { useTranslation } from 'react-i18next';
import Select from "react-select";
import i18n from 'i18next';
import { paymentTypes, receiver_bank } from '../../../util/Feilds';
import { getUserData } from '../../../util/session';

const NewExpense = () => {
  const inputRefs = useRef({});
  const [validated, setValidated] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [customerName, setCustomerName] = useState({ name: '', id: null });
  const [machines, setMachines] = useState([]);
  const [projects, setProjects] = useState([]); // Added projects state
  const [users, setUsers] = useState([]);
  // console.log(customerName);

  const [operators, setOperators] = useState([]);
  const [isOperatorExpense, setIsOperatorExpense] = useState(false);


 const companyId = getUserData()?.company_id;


  const fetchMachineries = async () => {

    // Safety: If no company ID, show error and exit
    if (!companyId) {
      showToast('danger', 'Unable to determine company. Please log in again.');
      setMachines([]);
      return;
    }

    try {
      // 1. Send company_id in query string
      const response = await getAPICall(`/api/machine-operators?company_id=${companyId}`);

      // 2. Client-side filter as defense-in-depth
      const filtered = Array.isArray(response)
        ? response.filter(machine => machine.company_id === companyId)
        : [];

      setMachines(filtered);
    } catch (error) {
      console.error('Error fetching machineries:', error);
      showToast('danger', 'Error fetching machineries: ' + (error?.message || ''));
      setMachines([]);
    }
  };

  const fetchProjects = async () => {
    const companyId = getUserData()?.company_id;
    if (!companyId) return;
    try {
      const response = await getAPICall(`/api/projects?company_id=${companyId}`);
      setProjects(response || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };


  const fetchUsers = async () => {
    try {
      const response = await getAPICall('/api/operatorsByCompanyIdOperator')
      setUsers(response)
    } catch (error) {
      console.error('Error fetching Users:', error)
      showToast('danger', 'Error fetching Users')
    }
  }

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation("global");
  const user = getUserData();
  const [state, setState] = useState({
    project_id: '', // ✅ Changed from customer_id to project_id
    name: '',
    desc: '',
    expense_id: undefined,
    typeNotSet: true,
    qty: 1,
    price: 0,
    total_price: 0,
    expense_date: new Date().toISOString().split('T')[0],
    contact: '',
    payment_by: '',
    payment_type: '',
    pending_amount: '',
    show: true,
    isGst: false,
    company_id: user?.company_id || '',
    photoAvailable: true,
    photo_url: null,
    photo_remark: '',
    operator_id: '',

    // New Fields in form 
    bank_name: '',
    acc_number: '',
    ifsc: '',
    aadhar: '',
    pan: '',
    transaction_id: '',
    machine_id: '',
    customer_id: '', // Added customer_id
  });

  const getCurrentLanguage = () => {
    const storedLang = localStorage.getItem('i18nextLng');
    const i18nLang = i18n.language;
    const finalLang = storedLang || i18nLang || 'en';
    return finalLang;
  };

  const getDisplayName = (item, lng = null) => {
    const currentLang = lng || getCurrentLanguage();
    return currentLang === 'mr' ? (item.localName || item.name) : item.name;
  };

  const fetchExpenseTypes = async () => {
    try {
      const response = await getAPICall('/api/expenseType');
      setExpenseTypes(response.filter((p) => p.show === 1));
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    }
  };

  useEffect(() => {
    fetchExpenseTypes();
    fetchMachineries();
    fetchProjects(); // Fetch projects
    fetchUsers();
    fetchOperators();
    // Auto-set company_id from session if available
    const user = getUserData();
    if (user?.company_id) {
      setState((prev) => ({ ...prev, company_id: user.company_id }));
    }
  }, []);

  useEffect(() => {
    fetchExpenseTypes();
  }, [i18n.language]);


  useEffect(() => {
    if (!isOperatorExpense) return;

    const user = getUserData();

    // type === 2 → operator logged in
    if (user?.type === 2 || user?.type === 4) {
      setState(prev => ({
        ...prev,
        operator_id: user.id
      }));
    }
  }, [isOperatorExpense]);

  const fetchOperators = async () => {
    try {
      const companyId = getUserData()?.company_id;
      const response = await getAPICall(`/api/operatorsAnsHelperByCompanyIdOperator`);
      console.log('setOperator', operators);
      setOperators(response || []);
    } catch (err) {
      showToast('danger', 'Error fetching operators');
    }
  };

  // const calculateFinalAmount = (item) => {
  //   const qtyNum = parseFloat(item.qty) || 0;
  //   const priceNum = parseFloat(item.price) || 0;
  //   let total = qtyNum * priceNum;

  //   if (item.isGst) {
  //     total = total * 1.18;
  //   }

  //   item.total_price = Math.round(total);
  // };

  const calculateFinalAmount = (item) => {
    const qtyNum = parseFloat(item.qty) || 0;
    const priceNum = parseFloat(item.price) || 0;
    item.total_price = Math.round(qtyNum * priceNum);
  };

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;

  //   setState((prev) => {
  //     let updated = { ...prev };

  //     if (type === "checkbox" && name === "isGst") {
  //       updated.isGst = checked;
  //       calculateFinalAmount(updated);
  //     } else if (name === "price" || name === "qty") {
  //       updated[name] = value;
  //       calculateFinalAmount(updated);
  //     } else if (name === "expense_id") {
  //       updated[name] = value;
  //       updated.typeNotSet = !value;
  //     } else if (name === "name") {
  //       const regex = /^[a-zA-Z0-9\u0900-\u097F ]*$/;
  //       if (regex.test(value)) {
  //         updated[name] = value;
  //       }
  //     } else {
  //       updated[name] = value;
  //     }

  //     return updated;
  //   });
  // };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setState((prev) => {
      const updated = { ...prev };



      if (type === "checkbox" && name === "isGst") {
        // ✅ Only store boolean, no calculation
        updated.isGst = checked;
        return updated;
      }

      if (name === "price" || name === "qty") {
        updated[name] = value;
        // ✅ Recalculate total WITHOUT GST
        calculateFinalAmount(updated);
        return updated;
      }

      if (name === "expense_id") {
        updated.expense_id = value;
        updated.typeNotSet = !value;
        return updated;
      }

      if (name === "name") {
        const regex = /^[a-zA-Z0-9\u0900-\u097F ]*$/;
        if (regex.test(value)) updated.name = value;
        return updated;
      }


      if (name === "photoAvailable") {
        updated.photoAvailable = checked;
        if (checked) {
          updated.photo_remark = ""; // clear remark if photo ON
        } else {
          updated.photo_url = null; // clear file if photo OFF
        }
        return updated;
      }

      if (type === "file" && name === "photo_url") {
        updated.photo_url = files[0] || null;
        return updated;
      }

      updated[name] = type === "checkbox" ? checked : value;
      return updated;


      updated[name] = value;
      return updated;
    });
  };





  const searchProject = async (value) => {
    if (value.length > 0) {
      try {
        const projects = await getAPICall(`/api/projects?searchQuery=${value}`);
        if (projects?.length) {
          setCustomerSuggestions(projects);
        } else {
          setCustomerSuggestions([]);
        }
      } catch (error) {
        showToast('danger', 'Error fetching projects: ' + error);
      }
    } else {
      setCustomerSuggestions([]);
    }
  };

  const handleCustomerNameChange = (e) => {
    const value = e.target.value;
    setCustomerName({ name: value, id: null });
    searchProject(value);
  };

  const handleCustomerSelect = (project) => {
    console.log("project");
    console.log(project);
    setCustomerName({ name: project.customer_name, id: project.id });
    setState((prev) => ({ ...prev, project_id: project.id, company_id: project.company_id, name: project.customer_name })); // ✅ Changed from customer_id to project_id
    setCustomerSuggestions([]);
  };

  const addToExpensesList = () => {
    if (state.expense_id && state.price > 0 && state.qty > 0 && state.project_id) { // ✅ Changed from customer_id to project_id
      const expenseType = expenseTypes.find(type => type.id === parseInt(state.expense_id));
      const currentLang = getCurrentLanguage();

      const newExpense = {
        ...state,
        expense_type_name: expenseType ? getDisplayName(expenseType, currentLang) : 'Unknown',
        customer_name: customerName.name,
        id: Date.now()
      };

      if (editingExpense) {
        const updatedList = expensesList.map(expense =>
          expense.id === editingExpense.id ? { ...newExpense, id: editingExpense.id } : expense
        );
        setExpensesList(updatedList);
        showToast('success', t("MSG.expense_updated_successfully"));
        setEditingExpense(null);
      } else {
        setExpensesList([...expensesList, newExpense]);
        showToast('success', t("MSG.expense_added_to_list"));
      }

      handleClear();
    } else {
      setState((old) => ({ ...old, typeNotSet: old.expense_id === undefined }));
      showToast('danger', t("MSG.fill_required_fields"));
    }
  };

  const editExpenseFromList = (expense) => {
    setState({
      project_id: expense.project_id, // ✅ Changed from customer_id to project_id
      company_id: expense.company_id, // ✅ Changed from customer_id to project_id
      name: expense.name,
      desc: expense.desc || '',
      expense_id: expense.expense_id,
      typeNotSet: false,
      qty: expense.qty,
      price: expense.price,
      total_price: expense.total_price,
      expense_date: expense.expense_date,
      contact: expense.contact,
      payment_by: expense.payment_by,
      payment_type: expense.payment_type,
      pending_amount: expense.pending_amount,
      show: expense.show,
      isGst: expense.isGst,
    });
    setCustomerName({ name: expense.customer_name, id: expense.project_id }); // ✅ Changed from customer_id to project_id
    setEditingExpense(expense);
    setValidated(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('info', t("MSG.expense_loaded_for_editing"));
  };

  const cancelEdit = () => {
    setEditingExpense(null);
    handleClear();
    showToast('info', t("MSG.edit_cancelled"));
  };

  const removeFromExpensesList = (id) => {
    const updatedList = expensesList.filter((expense) => expense.id !== id);
    setExpensesList(updatedList);
    if (editingExpense && editingExpense.id === id) {
      setEditingExpense(null);
      handleClear();
    }
    showToast('info', t("MSG.expense_removed_from_list"));
  };

  //   const handleSubmit = async (event) => {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);

  //     const formData = new FormData();

  // // Add normal fields
  // formData.append("project_id", state.project_id);
  // formData.append("name", state.name);
  // formData.append("desc", state.desc || "");
  // formData.append("expense_id", state.expense_id);
  // formData.append("typeNotSet", state.typeNotSet ? 1 : 0);
  // formData.append("qty", state.qty);
  // formData.append("price", state.price);
  // formData.append("total_price", state.total_price);
  // formData.append("expense_date", state.expense_date);
  // formData.append("contact", state.contact);
  // formData.append("payment_by", state.payment_by);
  // formData.append("payment_type", state.payment_type);
  // formData.append("pending_amount", state.pending_amount);
  // formData.append("show", state.show ? 1 : 0);
  // formData.append("isGst", state.isGst ? 1 : 0);
  // formData.append("photoAvailable", state.photoAvailable ? 1 : 0);
  // formData.append("photo_remark", state.photo_remark);

  // // Add file if selected (assuming you have it in state or input ref)
  // if (state.photo_url instanceof File) {
  //   formData.append("photo_url", state.photo_url);
  // }

  //     if (state.expense_id && state.price > 0 && state.qty > 0 && state.project_id) { // ✅ Changed from customer_id to project_id
  //       try {
  //         const resp = await postFormData('/api/expense', formData );
  //         if (resp) {
  //           showToast('success', t("MSG.new_expense_added_successfully_msg"));
  //         } else {
  //           showToast('danger', t("MSG.error_occured_please_try_again_later_msg"));
  //         }
  //         handleClear();
  //       } catch (error) {
  //         showToast('danger', 'Error occurred ' + error);
  //       }
  //     } else {
  //       setState((old) => ({ ...old, typeNotSet: old.expense_id === undefined }));
  //     }
  //   };

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    // Backend requires company_id
    if (!companyId) {
      showToast("danger", "Company is required for expense submission.");
      return;
    }


    const formData = new FormData();
    console.log("state");
    console.log(state);

    // Append only active/visible fields
    formData.append("company_id", companyId);
    if (state.project_id) formData.append("project_id", state.project_id);
    if (state.expense_id) formData.append("expense_id", state.expense_id);
    if (state.desc) formData.append("desc", state.desc);
    formData.append("price", state.price);
    formData.append("qty", state.qty);
    formData.append("total_price", state.total_price);
    formData.append("expense_date", state.expense_date);
    if (state.show !== undefined) formData.append("show", state.show ? 1 : 0);
    // Always send isGst as 0/1 to satisfy NOT NULL DB constraint
    formData.append("isGst", state.isGst ? 1 : 0);
    if (state.machine_id) formData.append("machine_id", state.machine_id);
    // Always send photoAvailable as 0/1 to satisfy NOT NULL DB constraint
    formData.append("photoAvailable", state.photoAvailable ? 1 : 0);
    if (state.customer_id) formData.append("customer_id", state.customer_id); // Append customer_id


    // Add file only if selected (UI for photo is currently commented out)
    if (state.photo_url instanceof File) formData.append("photo_url", state.photo_url);

    if (isOperatorExpense && !state.operator_id) {
      showToast('danger', 'Operator is required');
      return;
    }
    if (isOperatorExpense) {
      formData.append('operator_id', state.operator_id);
    }

    const isValidNormalExpense =
      !isOperatorExpense &&
      state.expense_id &&
      state.price > 0 &&
      state.qty > 0;

    const isValidOperatorExpense =
      isOperatorExpense &&
      state.expense_id &&
      state.total_price > 0 &&
      state.operator_id;


    if (isValidNormalExpense || isValidOperatorExpense) {
      try {
        const resp = await postFormData("/api/expense", formData);
        console.log("response", resp);
        if (resp) {
          showToast("success", t("MSG.new_expense_added_successfully_msg"));
        } else {
          showToast("danger", t("MSG.error_occured_please_try_again_later_msg"));
        }
        handleClear();
      } catch (error) {
        showToast("danger", "Error occurred " + error);
      }
    } else {
      setState((old) => ({ ...old, typeNotSet: old.expense_id === undefined }));
    }
  };


  const roundToTwoDecimals = (value) => {
    return Number((Math.round(value * 100) / 100).toFixed(2));
  };

  const submitAllExpenses = async () => {
    if (expensesList.length === 0) {
      showToast('warning', t("MSG.add_atleast_one_expense"));
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmitAllExpenses = async () => {
    try {
      const promises = expensesList.map(expense => {
        const { id, expense_type_name, customer_name, ...expenseData } = expense;
        return post('/api/expense', expenseData);
      });

      const results = await Promise.all(promises);
      const successCount = results.filter(result => result).length;

      if (successCount === expensesList.length) {
        const successMsg = t("MSG.expenses_submitted_successfully", { count: successCount })
          || `${successCount} expenses submitted successfully`;
        showToast('success', successMsg);
        setExpensesList([]);
        setEditingExpense(null);
      } else {
        const warningMsg = t("MSG.partial_expenses_submitted", { successCount, totalCount: expensesList.length })
          || `${successCount} out of ${expensesList.length} expenses submitted`;
        showToast('warning', warningMsg);
      }
    } catch (error) {
      const errorMsg = t("MSG.error_occurred") || "Error occurred";
      showToast('danger', `${errorMsg}: ${error}`);
    }

    setShowConfirmModal(false);
  };

  const getTotalAmount = () => {
    const total = expensesList.reduce((sum, item) => {
      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + qty * price;
    }, 0);

    return Number(total.toFixed(2));
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const today = new Date().toISOString().split('T')[0];

  const handleClear = async () => {
    setState({
      project_id: '', // ✅ Changed from customer_id to project_id
      // company_id: '',
      name: '',
      desc: '',
      expense_id: '',
      open: false,
      qty: 1,
      price: 0,
      total_price: 0,
      expense_date: today,
      contact: '',
      payment_by: '',
      payment_type: '',
      pending_amount: '',
      show: true,
      typeNotSet: false,
      isGst: false,
      photo_remark: '',

      // New Fields
      bank_name: '',
      acc_number: '',
      ifsc: '',
      transaction_id: '',
      customer_id: '', // Reset customer_id

    });
    setCustomerName({ name: '', id: null });
    setCustomerSuggestions([]);
    setValidated(false);
  };

  const lng = getCurrentLanguage();



  setTimeout(() => {
    console.log("Machines", machines);
  }, 2000)
  // Prepare options for react-select
  const options = expenseTypes.map(type => ({
    value: type.id,
    expense_category: type.expense_category,
    label: getDisplayName(type, lng),
  }));

  // Handle selection
  // const handleChange = (selectedOption) => {
  //   setState(prev => ({
  //     ...prev,
  //     expense_id: selectedOption ? selectedOption.value : "",
  //   }));
  // };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <strong>
                  {editingExpense ? t("LABELS.edit_expense") : t("LABELS.new_expense")}
                  {editingExpense && (
                    <span className="ms-2 badge bg-warning text-dark">
                      {t("LABELS.editing_mode")}
                    </span>
                  )}
                </strong>
                <CButton
                  color="danger"
                  size="sm"
                  onClick={() => window.location.href = "/#/expense/new-type"}
                >
                  {t("LABELS.new_expense_type")}
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <CForm noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="row">
                  {/* <div className="col-sm-3" style={{ position: 'relative' }}>
                    <CFormLabel htmlFor="project_id"><b>{t("LABELS.project_name")}</b></CFormLabel>
                    <CFormInput
                      type="text"
                      id="project_id"
                      placeholder={t("LABELS.enter_project_name")}
                      name="customerName"
                      value={customerName.name}
                      onChange={handleCustomerNameChange}
                      autoComplete="off"
                      required
                      feedbackInvalid={t("MSG.customer_name_validation")}
                    />
                    {customerSuggestions.length > 0 && (
                      <ul className="suggestions-list" style={{
                        position: 'absolute',
                        zIndex: 1000,
                        background: 'white',
                        border: '1px solid #ccc',
                        listStyle: 'none',
                        padding: 0,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        width: '100%'
                      }}>
                        {customerSuggestions.map((project) => (
                          <li
                            key={project.id}
                            onClick={() => handleCustomerSelect(project)}
                            style={{
                              padding: '8px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #eee'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                            onMouseLeave={(e) => e.target.style.background = 'white'}
                          >
                            {project?.project_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div> */}


                  <div className="col-sm-4">
                    <div className="">
                      <CFormLabel htmlFor="expense_id"><b>{t("LABELS.expense_type")}</b></CFormLabel>
                      {/* <CFormSelect
                        aria-label={t("MSG.select_expense_type_msg")}
                        value={state.expense_id}
                        id="expense_id"
                        name="expense_id"
                        onChange={handleChange}
                        required
                        feedbackInvalid={t("MSG.select_expense_type_validation")}
                      >
                        <option value="">{t("MSG.select_expense_type_msg")}</option>
                        {expenseTypes.map((type) => {
                          const displayName = getDisplayName(type, lng);
                          return (
                            <option key={type.id} value={type.id}>
                              {displayName}
                            </option>
                          );
                        })}
                      </CFormSelect> */}
                      <Select //working here
                        id="expense_id"
                        name="expense_id"
                        value={
                          options.find(opt => String(opt.value) === String(state.expense_id)) || null
                        }
                        // onChange={(selectedOption) => {
                        //   const category = String(selectedOption?.expense_category || '').toLowerCase();
                        //   const labelText = String(selectedOption?.label || '').toLowerCase();
                        //   const isMachineRelated = category.includes('machine') || labelText.includes('machine') || category.includes('मशीन') || labelText.includes('मशीन');
                        //   setState(prev => ({
                        //     ...prev,
                        //     expense_id: selectedOption ? selectedOption.value : "",
                        //     open: isMachineRelated
                        //   }));
                        // }}
                        onChange={(selectedOption) => {
                          console.log('selectedOption', selectedOption);
                          const category = String(selectedOption?.label || '').toLowerCase();

                          const isOperator = category === 'operator' || 'helper';
                          const isMachineRelated = category.includes('machine');

                          setIsOperatorExpense(isOperator);

                          setState(prev => ({
                            ...prev,
                            expense_id: selectedOption ? selectedOption.value : "",
                            open: isMachineRelated,
                            customer_id: '',     // reset customer
                            project_id: '',
                            operator_id: ''      // reset operator
                          }));
                        }}

                        options={options}
                        placeholder={t("MSG.select_expense_type_msg")}
                        isClearable
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "0.5rem",
                            borderColor: "#ced4da",
                            minHeight: "38px",
                          }),
                        }}
                      />
                    </div>
                  </div>

                  {state.open && (
                    <div className="col-sm-4">
                      <div className="">
                        <CFormLabel htmlFor="machine_id">
                          <b>{t("LABELS.machine")}</b>
                        </CFormLabel>
                        <Select
                          id="machine_id"
                          name="machine_id"
                          value={
                            machines
                              .map(m => ({ value: m.id, label: m.machine_name }))
                              .find(opt => String(opt.value) === String(state.machine_id)) || null
                          }
                          onChange={(selectedOption) =>
                            setState(prev => ({
                              ...prev,
                              machine_id: selectedOption ? selectedOption.value : ""
                            }))
                          }
                          options={machines.map(m => ({
                            value: m.id,
                            label: m.machine_name
                          }))}
                          placeholder="Select Machine"
                          isClearable
                          isSearchable
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderRadius: "0.5rem",
                              borderColor: "#ced4da",
                              minHeight: "38px",
                            }),
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-sm-4">
                    {isOperatorExpense ? (
                      <>
                        <CFormLabel><b>{t("LABELS.operator_helper_name")}</b></CFormLabel>

                        <Select
                          value={
                            operators
                              .map(o => ({ value: o.id, label: o.name }))
                              .find(opt => String(opt.value) === String(state.operator_id)) || null
                          }
                          onChange={(opt) =>
                            setState(prev => ({
                              ...prev,
                              operator_id: opt ? opt.value : ''
                            }))
                          }
                          options={operators.map(o => ({
                            value: o.id,
                            label: o.name
                          }))}
                          isDisabled={getUserData()?.type === 2 || getUserData()?.type === 4} // 🔒 operator cannot change
                          placeholder="Select Operator"
                        />
                      </>
                    ) : (
                      <>
                        <div className="">
                          <CFormLabel htmlFor="customer_id"><b>{t("LABELS.customer_name")}</b></CFormLabel>
                          <Select
                            id="customer_id"
                            name="customer_id"
                            value={
                              projects
                                .map(p => ({ value: p.id, label: p.customer_name }))
                                .find(opt => String(opt.value) === String(state.customer_id)) || null
                            }
                            onChange={(selectedOption) =>
                              setState(prev => ({
                                ...prev,
                                customer_id: selectedOption ? selectedOption.value : "",
                                project_id: selectedOption ? selectedOption.value : ""
                              }))
                            }
                            options={projects.map(p => ({
                              value: p.id,
                              label: p.customer_name
                            }))}
                            placeholder={t("LABELS.customer_name")}
                            isClearable
                            isSearchable
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: "0.5rem",
                                borderColor: "#ced4da",
                                minHeight: "38px",
                              }),
                            }}
                          />
                        </div>
                      </>
                    )}

                  </div>


                  <div className="col-sm-4">
                    <div className="mb-3">
                      <CFormLabel htmlFor="name"><b>{t("LABELS.about_expense")}</b></CFormLabel>
                      <CFormInput
                        type="text"
                        id="desc"
                        placeholder={t("LABELS.enter_expense_description")}
                        name="desc"
                        value={state.desc}
                        onChange={handleChange}
                        // required
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="mb-3">
                      <CFormLabel htmlFor="expense_date"><b>{t("LABELS.expense_date")}</b></CFormLabel>
                      <CFormInput
                        type="date"
                        id="expense_date"
                        name="expense_date"
                        max={today}
                        value={state.expense_date}
                        onChange={handleChange}
                        required
                        feedbackInvalid={t("MSG.select_date_validation")}
                      />
                    </div>
                  </div>
                </div>

                {!isOperatorExpense && (<div className="row align-items-end">
                  <div className="col-sm-4">
                    <div className="mb-3">
                      <CFormLabel htmlFor="price">
                        <b>{t("LABELS.price_per_unit")}</b>
                      </CFormLabel>
                      <CFormInput
                        type="number"
                        min="0"
                        id="price"
                        onWheel={(e) => e.target.blur()}
                        placeholder="0.00"
                        step="0.01"
                        name="price"
                        onFocus={() => setState(prev => ({ ...prev, price: '' }))}
                        value={state.price}
                        onChange={handleChange}
                        required
                        feedbackInvalid={t("MSG.price_validation")}
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="mb-3">
                      <CFormLabel htmlFor="qty">
                        <b>{t("LABELS.total_units")}</b>
                      </CFormLabel>
                      <CFormInput
                        type="number"
                        id="qty"
                        step="0.01"
                        min="0"
                        placeholder=" "
                        name="qty"
                        value={state.qty}
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => {
                          if (['e', '+', '-', ','].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
                            handleChange(e)
                          }
                        }}
                        required
                        feedbackInvalid={t("MSG.quantity_validation")}
                      />
                    </div>
                  </div>

                  {/* <div className="col-sm-3">
                    <div className="mb-3">
                      <CFormCheck
                        id="isGst"
                        name="isGst"
                        label="Is GST Bill"
                        checked={state.isGst}
                        onChange={handleChange}
                      />
                      {state.isGst && (
                        <small className="text-muted d-block ms-4">

                        </small>
                      )}
                    </div>
                  </div> */}

                  <div className="col-sm-4">
                    <div className="mb-3">
                      <CFormLabel htmlFor="total_price">
                        <b>{t("LABELS.total_price")}</b>
                      </CFormLabel>
                      <CFormInput
                        type="number"
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        id="total_price"
                        placeholder=""
                        name="total_price"
                        value={state.total_price}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </div>
                </div>)}

                {isOperatorExpense && (
                  <div className="col-sm-4">
                    <CFormLabel><b>Total Amount</b></CFormLabel>
                    <CFormInput
                      type="number"
                      value={state.total_price}
                        onFocus={() => setState(prev => ({ ...prev, total_price: '' }))}
                      onChange={(e) =>
                        setState(prev => ({ ...prev, total_price: e.target.value }))
                      }
                      required
                    />
                  </div>
                )}


                <div className="row">
                  {/* <div className="col-sm-3">
                    <div className="mb-3">
                      <CFormLabel htmlFor="contact">
                        <b>{t("LABELS.contact")}</b>
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        id="contact"
                        placeholder={t("LABELS.enter_contact")}
                        name="contact"
                        value={state.contact}
                        onChange={(e) => {
                          const value = e.target.value;

                          // Allow only numbers and restrict to 10 digits
                          if (/^\d{0,10}$/.test(value)) {
                            handleChange(e);
                          }
                        }}
                        maxLength={10} // ensures no more than 10 characters
                        inputMode="numeric" // mobile keyboard will show numbers only
                      />
                    </div>
                  </div> */}


                  {/* <div className="col-sm-3">
                    <div className="mb-3">
                      <CFormLabel htmlFor="payment_by"><b>{t("LABELS.payment_by")}</b></CFormLabel>
                      <CFormInput
                        type="text"
                        id="payment_by"
                        placeholder={t("LABELS.enter_payment_by")}
                        name="payment_by"
                        value={state.payment_by}
                        onChange={handleChange}
                      />
                    </div>
                  </div> */}
                  {/* <div className="col-sm-3">
                    <div className="mb-3">
                      <CFormLabel htmlFor="payment_by">
                        <b>{t("LABELS.payment_by")}</b>
                      </CFormLabel>
                      <CFormSelect
                        id="payment_by"
                        name="payment_by"
                        value={state.payment_by}
                        onChange={handleChange}
                      >
                        <option value="">{t("LABELS.select_payment_by")}</option>
                        <option value="Mangesh Shitole">Mangesh Shitole</option>
                        <option value="Krishna Shitole">Krishna Shitole</option>
                        <option value="Deshmukh infra LLP">Deshmukh infra LLP</option>
                        {users.map((bank) => (
                          <option key={bank.id} value={bank.name}>{bank.name}</option>
                        ))}
                      </CFormSelect>
                    </div>
                  </div> */}

                  {/* <div className="col-sm-3">
                    <div className="mb-3">
                      <CFormLabel htmlFor="payment_type"><b>{t("LABELS.payment_type")}</b></CFormLabel>
                      <CFormSelect
                        id="payment_type"
                        name="payment_type"
                        value={state.payment_type || ""}
                        onChange={handleChange}
                        required
                        feedbackInvalid="Please select a payment type"
                      >
                        <option value="">Select Payment Type</option>
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="IMPS/NEFT/RTGS">IMPS/NEFT/RTGS</option>
                        {paymentTypes.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </CFormSelect>
                    </div>
                  </div> */}

                  {/* <div className="col-sm-3">
                    <div className="mb-3">
                      <CFormLabel htmlFor="pending_amount"><b>{t("LABELS.pending_amount")}</b></CFormLabel>
                      <CFormInput
                        type="number"
                        id="pending_amount"
                        placeholder={t("LABELS.enter_pending_amount")}
                        name="pending_amount"
                        value={state.pending_amount}
                        onChange={handleChange}
                      />
                    </div>
                  </div> */}
                </div>









                <div className="mb-3 mt-3">
                  <CButton color="success" type="submit">
                    {t("LABELS.submit")}
                  </CButton>
                  &nbsp;
                  {/* <CButton color="primary" type="button" onClick={addToExpensesList}>
                    {editingExpense ? t("LABELS.update_in_list") : t("LABELS.add_to_list")}
                  </CButton>
                  &nbsp; */}
                  {editingExpense && (
                    <>
                      <CButton color="warning" type="button" onClick={cancelEdit}>
                        {t("LABELS.cancel_edit")}
                      </CButton>
                      &nbsp;
                    </>
                  )}
                  <CButton color="secondary" onClick={handleClear}>
                    {t("LABELS.clear")}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {expensesList.length > 0 && (
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>{t("LABELS.expenses_list")} ({expensesList.length})</strong>
                  <span>{t("LABELS.total_amount")}: <strong>{formatCurrency(getTotalAmount())}</strong></span>
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="table-responsive">
                  <CTable striped hover>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>{t("LABELS.customer_name")}</CTableHeaderCell>
                        <CTableHeaderCell>{t("LABELS.expense_type")}</CTableHeaderCell>
                        <CTableHeaderCell>{t("LABELS.description")}</CTableHeaderCell>
                        <CTableHeaderCell>{t("LABELS.date")}</CTableHeaderCell>
                        <CTableHeaderCell>{t("LABELS.price")}</CTableHeaderCell>
                        <CTableHeaderCell>{t("LABELS.quantity")}</CTableHeaderCell>
                        <CTableHeaderCell>{t("LABELS.total")}</CTableHeaderCell>
                        <CTableHeaderCell>{t("LABELS.actions")}</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {expensesList.map((expense) => (
                        <CTableRow
                          key={expense.id}
                          className={editingExpense && editingExpense.id === expense.id ? 'table-warning' : ''}
                        >
                          <CTableDataCell>{expense.customer_name}</CTableDataCell>
                          <CTableDataCell>{expense.expense_type_name}</CTableDataCell>
                          <CTableDataCell>{expense.name || '-'}</CTableDataCell>
                          <CTableDataCell>{expense.expense_date}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(expense.price)}</CTableDataCell>
                          <CTableDataCell>{expense.qty}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(expense.total_price)}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="info"
                              size="sm"
                              onClick={() => editExpenseFromList(expense)}
                              className="me-1"
                              disabled={editingExpense && editingExpense.id === expense.id}
                            >
                              {editingExpense && editingExpense.id === expense.id
                                ? t("LABELS.editing")
                                : t("LABELS.edit")
                              }
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => removeFromExpensesList(expense.id)}
                            >
                              {t("LABELS.remove")}
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
                <div className="mt-3">
                  <CButton
                    color="success"
                    size="lg"
                    onClick={submitAllExpenses}
                    disabled={editingExpense !== null}
                  >
                    {t("LABELS.submit_all_expenses")} ({expensesList.length})
                  </CButton>
                  {editingExpense && (
                    <div className="mt-2">
                      <small className="text-warning">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        {t("MSG.complete_edit_before_submit")}
                      </small>
                    </div>
                  )}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <CModalHeader>
          <CModalTitle>{t("LABELS.confirm_submission")}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>{t("MSG.confirm_submit_expenses", { count: expensesList.length })}</p>
          <p><strong>{t("LABELS.total_amount")}: {formatCurrency(getTotalAmount().toFixed(2))}</strong></p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>
            {t("LABELS.cancel")}
          </CButton>
          <CButton color="primary" onClick={confirmSubmitAllExpenses}>
            {t("LABELS.confirm_submit")}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default NewExpense;