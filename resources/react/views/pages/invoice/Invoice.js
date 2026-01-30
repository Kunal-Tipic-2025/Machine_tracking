import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import './Invoice.css'
import {
  CAlert,
  CBadge,
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
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { cilArrowLeft, cilCart, cilChevronBottom, cilList, cilSearch, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { getAPICall, post, put } from '../../../util/api'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../common/toast/ToastContext'
import { useTranslation } from 'react-i18next'

const Invoice = ({ editMode = false, initialData = null, onSubmit = null }) => {
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [operators, setOperators] = useState([])
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { showToast } = useToast()

  const [allProjects, setAllProjects] = useState([])
  const [rows, setRows] = useState([])
  const [filteredMachines, setFilteredMachines] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredProjects, setFilteredProjects] = useState([])
  const [logs, setLogs] = useState([])
  const [prices, setPrice] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [selectedLogIds, setSelectedLogIds] = useState([])
  const projectInputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Advance Payment state
  const [advanceEnabled, setAdvanceEnabled] = useState(false)
  const [advanceAmount, setAdvanceAmount] = useState('')
  const [advanceMode, setAdvanceMode] = useState('')
  const [advanceTransactionId, setAdvanceTransactionId] = useState('')
  const [advanceRemark, setAdvanceRemark] = useState('')

  // Fixed Bid Work state
  const [fixedBidEnabled, setFixedBidEnabled] = useState(false)
  const [fixedBidAmount, setFixedBidAmount] = useState('')
  const [fixedBidPaidAmount, setFixedBidPaidAmount] = useState('') // ✅ New State
  const [fixedBidMode, setFixedBidMode] = useState('')
  const [fixedBidTransactionId, setFixedBidTransactionId] = useState('')
  const [fixedBidRemark, setFixedBidRemark] = useState('')

  const [workTypes, setWorkTypes] = useState([]);

  //FILTER for logs
  const [logSearchQuery, setLogSearchQuery] = useState('');

  const [form, setForm] = useState({
    projectId: null,
    customer_id: null,
    customer_name: '',
    address: '',
    mobile_number: '',
    customer: { name: '', address: '', mobile: '' },
    invoiceType: 3,
    invoiceDate: new Date().toISOString().split('T')[0],
    discount: 0,
    paidAmount: 0,
    finalAmount: 0,
    projectCost: 0,
    payed: 0,
    start_date: '',
    end_date: '',
    selectedMachines: [],
    company_id: null
  })

  const [works, setWorks] = useState([{ work_type: '', qty: 0, price: 0, total_price: 0, remark: '' }])
  const [editingLogRowId, setEditingLogRowId] = useState(null)
  const [editingLogPrice, setEditingLogPrice] = useState('')

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false)
  const [newCustomerForm, setNewCustomerForm] = useState({
    customer_name: '',
    mobile_number: '',
    gst_number: '',
    work_place: '',
  })



  //Extra charges

  const [additionalCharges, setAdditionalCharges] = useState([
    {
      charge_type: '',
      amount: '',
      remark: '',
      is_paid: false,
      date: new Date().toISOString().split('T')[0],
    },
  ]);


  const handleAdditionalChargeChange = (index, field, value) => {
    const updated = [...additionalCharges];
    updated[index][field] = value;
    setAdditionalCharges(updated);
  };

  const addAdditionalCharge = () => {
    setAdditionalCharges([
      ...additionalCharges,
      {
        charge_type: '',
        amount: '',
        remark: '',
        is_paid: false,
        date: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const removeAdditionalCharge = (index) => {
    setAdditionalCharges(additionalCharges.filter((_, i) => i !== index));
  };

  const calculateRemainingAmount = () => {
    return Math.max(0, form.finalAmount - form.paidAmount)
  }

  const calculateFinalAmount = () => {
    const projectCost = parseFloat(form.projectCost) || 0
    const discount = parseFloat(form.discount) || 0
    return Math.max(0, projectCost - discount)
  }

  //fetch working type
  useEffect(() => {
    const fetchWorkTypes = async () => {
      try {
        const res = await getAPICall('/api/workingType');
        setWorkTypes(res || []);
      } catch (err) {
        console.error('Error fetching work types', err);
      }
    };

    fetchWorkTypes();
  }, []);

  const workTypeMap = useMemo(() => {
    const map = {};
    workTypes.forEach(wt => {
      map[wt.id] = wt.type_of_work;
    });
    return map;
  }, [workTypes]);


  const fetchProjects = useCallback(async (query = '') => {
    setProjectsLoading(true)
    try {
      const endpoint = query
        ? `/api/projects?searchQuery=${encodeURIComponent(query)}`
        : '/api/projects'

      const resp = await getAPICall(endpoint)
      const data = Array.isArray(resp) ? resp : resp?.data

      if (!data || !Array.isArray(data)) {
        setAllProjects([])
        if (!query) showToast('warning', 'No projects data available from server')
        return
      }

      const validProjects = data
        .map((p) => ({
          id: p.id,
          project_name: p.project_name || 'Unknown Project',
          customer_name: p.customer_name || 'Unknown Customer',
          work_place: p.work_place || '',
          project_cost: p.project_cost || '0',
          mobile_number: p.mobile_number || '',
          gst_number: p.gst_number || '',
          remark: p.remark || '',
          paidamount: p.paidamount || 0,
          customer_id: p.customer_id || p.id,
          company_id: p.company_id,
          machine_id: p.machine_id || [],
          customer: {
            name: p.customer_name || 'Unknown',
            address: p.work_place || 'N/A',
            mobile: p.mobile_number || 'N/A',
          },
          start_date: p.start_date,
          end_date: p.end_date,
        }))
        .filter((p) => p.project_name && p.customer_id)

      setAllProjects(validProjects)

      // if (validProjects.length === 0 && !query) {
      //   showToast('warning', 'No valid projects found - check API data')
      // }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setAllProjects([])
      if (!query) showToast('danger', 'Failed to fetch projects')
    } finally {
      setProjectsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (editMode && initialData) {
      setForm({
        projectId: initialData.projectId,
        customer_id: initialData.customer_id,
        customer_name: initialData.customer?.name || '',
        address: initialData.customer?.address || '',
        mobile_number: initialData.customer?.mobile || '',
        customer: initialData.customer,
        invoiceType: initialData.invoiceType,
        invoiceDate: initialData.invoiceDate,
        discount: initialData.discount || 0,
        payed: initialData.paidamount || 0,
        finalAmount: initialData.finalAmount || 0,
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
      })
      setWorks(initialData.items || [{ work_type: '', qty: 0, price: 0, total_price: 0, remark: '' }])
      setSearchQuery(initialData.customer?.name || '')
    }
  }, [editMode, initialData])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchQuery.length > 0) {
        fetchProjects(searchQuery)
      } else if (searchQuery.length === 0) {
        setAllProjects([])
        setShowDropdown(false)
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [searchQuery, fetchProjects])

  useEffect(() => {
    if (searchQuery && allProjects.length > 0) {
      const query = searchQuery.toLowerCase()
      const filtered = allProjects.filter((p) => {
        return (
          (p.project_name && p.project_name.toLowerCase().includes(query)) ||
          (p.customer_name && p.customer_name.toLowerCase().includes(query)) ||
          (p.work_place && p.work_place.toLowerCase().includes(query)) ||
          (p.mobile_number && p.mobile_number.includes(query)) ||
          (p.remark && p.remark.toLowerCase().includes(query))
        )
      })
      console.log('Filtered projects:', filtered, 'Query:', searchQuery)
      setFilteredProjects(filtered)
    } else {
      setFilteredProjects([])
    }
  }, [searchQuery, allProjects])

  const fetchLogs = async () => {
    try {
      const response = await getAPICall('/api/machineLog')
      setLogs(response || [])
    } catch (error) {
      showToast('danger', 'Error fetching machine logs: ' + error)
    }
  }

  const fetchOperators = () => {
    getAPICall("/api/operatorsByCompanyIdOperator")
      .then((res) => {
        setOperators(res || [])
        setLoading(false)
      })
      .catch((err) => {
        console.log(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchLogs()
    fetchOperators()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        projectInputRef.current &&
        !projectInputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const fetchMachineries = async () => {
    try {
      const response = await getAPICall('/api/machine-operators')
      setRows(response)
    } catch (error) {
      console.error('Error fetching machineries:', error)
      showToast('danger', 'Error fetching machineries')
    }
  }

  const fetchMachineprice = async () => {
    try {
      const response = await getAPICall('/api/machine-price')
      setPrice(response)
    } catch (error) {
      console.error('Error fetching machineries:', error)
      showToast('danger', 'Error fetching machineries')
    }
  }

  useEffect(() => {
    fetchMachineries()
    fetchMachineprice()
  }, [])

  const filterMachinesByProject = useCallback((project) => {
    if (!project || !project.machine_id || !Array.isArray(project.machine_id) || rows.length === 0) {
      setFilteredMachines([])
      return
    }

    const filtered = rows.filter(machine =>
      project.machine_id.includes(String(machine.id))
    )
    setFilteredMachines(filtered)
  }, [rows])

  useEffect(() => {
    if (rows.length > 0 && form.projectId) {
      const selectedProject = allProjects.find(p => p.id === form.projectId)
      if (selectedProject) {
        filterMachinesByProject(selectedProject)
      }
    }
  }, [rows, form.projectId, allProjects, filterMachinesByProject])

  useEffect(() => {
    if (!form.projectId) return
    const timer = setTimeout(async () => {
      try {
        const value = Number(form.payed) || 0
        await put(`/api/projects/${form.projectId}/paidamount`, { paidamount: value })
      } catch (err) {
        console.error('Failed updating project paidamount:', err)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [form.projectId, form.payed])

  useEffect(() => {
    if (!form.projectId || logs.length === 0) {
      setFilteredLogs([])
      return
    }
    const filtered = logs.filter(l => String(l.project_id) === String(form.projectId))
    const filt = filtered.filter(l => l.isPaid == 0);
    setFilteredLogs(filt)
  }, [logs, form.projectId])

  const getMachineName = useCallback((machineId) => {
    if (!machineId || rows.length === 0) return 'N/A'
    const m = rows.find(r => String(r.id) === String(machineId))
    return m?.machine_name || 'N/A'
  }, [rows])

  const handleProjectChange = (project) => {
    const projectCost = parseFloat(project.project_cost) || 0
    const discount = parseFloat(form.discount) || 0
    const finalAmount = Math.max(0, projectCost - discount)

    setForm((prev) => ({
      ...prev,
      projectId: project.id,
      payed: project.paidamount,
      customer_id: project.customer_id,
      customer_name: project.customer_name,
      address: project.work_place,
      mobile_number: project.mobile_number,
      start_date: project.start_date,
      end_date: project.end_date,
      projectCost: projectCost,
      finalAmount: finalAmount,
      company_id: project.company_id,
      customer: {
        name: project.customer_name,
        address: project.customer.address,
        mobile: project.customer.mobile,
      },
      selectedMachines: []
    }))
    setShowDropdown(false)
    setSearchQuery(project.customer_name)
    setAllProjects([])
    filterMachinesByProject(project)
  }

  // Filter logs based on search query
  const searchFilteredLogs = useMemo(() => {
    if (!logSearchQuery.trim()) return filteredLogs;

    const query = logSearchQuery.toLowerCase();

    return filteredLogs.filter((log) => {
      // Search in work type
      const workType = workTypeMap[log.work_type_id]?.toLowerCase() || '';

      // Search in operator name
      const operator = operators.find((op) => op.id == log.operator_id);
      const operatorName = operator?.name?.toLowerCase() || '';

      // Search in machine name
      const machineName = getMachineName(log.machine_id).toLowerCase();

      // Search in mode
      const modeMatch = prices.find((p) => p.id === Number(log.mode_id));
      const modeName = modeMatch?.mode?.toLowerCase() || '';

      // Search in date
      const workDate = String(log.work_date).slice(0, 10);

      return (
        workType.includes(query) ||
        operatorName.includes(query) ||
        machineName.includes(query) ||
        modeName.includes(query) ||
        workDate.includes(query)
      );
    });
  }, [filteredLogs, logSearchQuery, workTypeMap, operators, getMachineName, prices]);

  const clearProject = () => {
    setForm((prev) => ({
      ...prev,
      projectId: null,
      customer_id: null,
      customer_name: '',
      address: '',
      mobile_number: '',
      customer: { name: '', address: '', mobile: '' },
      projectCost: 0,
      payed: 0,
      finalAmount: 0,
      selectedMachines: []
    }))
    setSearchQuery('')
    setShowDropdown(false)
    setAllProjects([])
    setFilteredMachines([])
  }

  const handleAddCustomer = () => {
    setShowDropdown(false)
    setNewCustomerForm((prev) => ({
      ...prev,
      customer_name: searchQuery || '',
    }))
    setShowAddCustomerModal(true)
  }

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target

    if (name === 'mobile_number') {
      const digits = value.replace(/\D/g, '')
      if (digits.length > 10) return
      setNewCustomerForm((prev) => ({ ...prev, mobile_number: digits }))
      return
    }

    if (name === 'gst_number') {
      if (value.length > 15) return
      setNewCustomerForm((prev) => ({ ...prev, gst_number: value }))
      return
    }

    setNewCustomerForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNewCustomerSubmit = async (e) => {
    e.preventDefault()

    if (!newCustomerForm.customer_name.trim()) {
      showToast('danger', 'Customer name is required')
      return
    }

    if (!newCustomerForm.mobile_number || !/^[6-9]\d{9}$/.test(newCustomerForm.mobile_number)) {
      showToast('danger', 'Please enter a valid 10-digit mobile number')
      return
    }

    try {
      setLoading(true)
      const payload = {
        customer_name: newCustomerForm.customer_name,
        mobile_number: newCustomerForm.mobile_number,
        gst_number: newCustomerForm.gst_number || '',
        work_place: newCustomerForm.work_place || '',
        project_name: '',
        project_cost: '',
        supervisor_id: '',
        commission: '',
        start_date: '',
        end_date: '',
        is_visible: true,
        remark: '',
        operator_id: [''],
        machine_id: [],
      }

      await post('/api/projects', payload)

      let newlyCreatedProject = null
      try {
        const searchResp = await getAPICall(`/api/projects?searchQuery=${encodeURIComponent(newCustomerForm.customer_name)}`)
        const data = Array.isArray(searchResp) ? searchResp : searchResp?.data

        if (data && Array.isArray(data)) {
          const mapped = data
            .map((p) => ({
              id: p.id,
              project_name: p.project_name || 'Unknown Project',
              customer_name: p.customer_name || 'Unknown Customer',
              work_place: p.work_place || '',
              project_cost: p.project_cost || '0',
              mobile_number: p.mobile_number || '',
              gst_number: p.gst_number || '',
              remark: p.remark || '',
              paidamount: p.paidamount || 0,
              customer_id: p.customer_id || p.id,
              company_id: p.company_id,
              machine_id: p.machine_id || [],
              customer: {
                name: p.customer_name || 'Unknown',
                address: p.work_place || 'N/A',
                mobile: p.mobile_number || 'N/A',
              },
              start_date: p.start_date,
              end_date: p.end_date,
            }))
            .filter((p) => p.project_name && p.customer_id)

          newlyCreatedProject =
            mapped.find(
              (p) =>
                p.customer_name.toLowerCase() === newCustomerForm.customer_name.toLowerCase() &&
                p.mobile_number === newCustomerForm.mobile_number
            ) || mapped[0] || null
        }
      } catch (innerErr) {
        console.error('Error fetching newly created customer project:', innerErr)
      }

      if (newlyCreatedProject) {
        handleProjectChange(newlyCreatedProject)
        showToast('success', 'Customer added and selected successfully')
      } else {
        showToast('success', 'Customer added successfully, please search to select')
      }

      setShowAddCustomerModal(false)
      setNewCustomerForm({
        customer_name: '',
        mobile_number: '',
        gst_number: '',
        work_place: '',
      })
      setAllProjects([])
      setFilteredProjects([])
    } catch (error) {
      console.error('Error adding customer from invoice:', error)
      showToast('danger', 'Failed to add customer')
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    const newValue = name === 'discount' || name === 'paidAmount' ? parseFloat(value) || 0 : value

    setForm((prev) => {
      const updatedForm = {
        ...prev,
        [name]: newValue,
      }

      if (name === 'discount') {
        const projectCost = parseFloat(prev.projectCost) || 0
        const discount = parseFloat(newValue) || 0
        updatedForm.finalAmount = Math.max(0, projectCost - discount)
      }

      return updatedForm
    })
  }

  const handleMachineChange = (e) => {
    const selectedMachineId = e.target.value
    if (!selectedMachineId) return

    const selectedMachine = filteredMachines.find(machine => machine.id.toString() === selectedMachineId)

    if (selectedMachine) {
      setForm((prev) => {
        const isAlreadySelected = prev.selectedMachines.some(m => m.id === selectedMachine.id)

        if (isAlreadySelected) {
          return {
            ...prev,
            selectedMachines: prev.selectedMachines.filter(m => m.id !== selectedMachine.id)
          }
        } else {
          return {
            ...prev,
            selectedMachines: [...prev.selectedMachines, selectedMachine]
          }
        }
      })
    }
  }

  const removeMachine = (machineId) => {
    setForm((prev) => ({
      ...prev,
      selectedMachines: prev.selectedMachines.filter(m => m.id !== machineId)
    }))
  }

  const handleWorkChange = (index, field, value) => {
    const updated = [...works]
    updated[index][field] = field === 'qty' || field === 'price' ? parseFloat(value) || 0 : value
    updated[index].total_price = (updated[index].qty || 0) * (updated[index].price || 0)
    setWorks(updated)
    calculateTotals(updated)
  }

  const startEditLogPrice = (log) => {
    setEditingLogRowId(log.id)
    setEditingLogPrice(String(log.price_per_hour ?? 0))
  }

  const cancelEditLogPrice = () => {
    setEditingLogRowId(null)
    setEditingLogPrice('')
  }

  const saveEditLogPrice = async (log) => {
    const newPrice = Number(editingLogPrice)
    if (isNaN(newPrice) || newPrice < 0) {
      showToast('danger', 'Enter a valid price')
      return
    }

    try {
      const resp = await put(`/api/machine-logs/${log.id}/price`, {
        price_per_hour: newPrice
      })
      if (resp && resp.error) {
        showToast('danger', 'Failed to update price')
        return
      }

      setFilteredLogs((prev) => prev.map(l => (
        String(l.id) === String(editingLogRowId) ? { ...l, price_per_hour: newPrice } : l
      )))
      if (typeof setLogs === 'function') {
        setLogs((prev) => Array.isArray(prev) ? prev.map(l => (
          String(l.id) === String(editingLogRowId) ? { ...l, price_per_hour: newPrice } : l
        )) : prev)
      }
      setEditingLogRowId(null)
      setEditingLogPrice('')
      showToast('success', 'Price updated successfully')
    } catch (error) {
      console.error('Error updating log price:', error)
      showToast('danger', 'Error updating price')
    }
  }

  const addWorkRow = () => {
    setWorks([...works, { work_type: '', qty: 0, price: 0, total_price: 0, remark: '' }])
  }

  const removeWorkRow = (index) => {
    const updated = [...works]
    updated.splice(index, 1)
    setWorks(updated)
    calculateTotals(updated)
  }

  const calculateTotals = (currentWorks) => {
    const subtotal = currentWorks.reduce((sum, w) => sum + (w.total_price || 0), 0)
    const finalAmount = subtotal - (form.discount || 0)
    setForm((prev) => ({ ...prev, finalAmount }))
  }

  const handleLogSelection = (logId) => {
    setSelectedLogIds((prev) =>
      prev.includes(logId)
        ? prev.filter((id) => id !== logId)
        : [...prev, logId]
    )
  }

  // ✅ FIXED: Submit function - Updates ALL isPaid flags on submit
  const submitInvoice = async (e) => {
    e.preventDefault()
    const formElement = e.currentTarget
    if (!formElement.checkValidity()) {
      setValidated(true)
      return
    }
    if (!form.projectId || !form.customer_id) {
      showToast('danger', 'Please select a customer')
      return
    }

    const validAdditionalCharges = additionalCharges
      .filter(c => c.charge_type && Number(c.amount) > 0)
      .map(c => ({
        charge_type: c.charge_type,
        amount: Number(c.amount),
        remark: c.remark || null,
        is_paid: c.is_paid ?? false,
        date: c.date,
      }));


    try {
      setLoading(true)

      // ✅ STEP 1: Update project paidamount
      if (form.projectId) {
        const payedValue = Number(form.payed) || 0
        try {
          await put(`/api/projects/${form.projectId}/paidamount`, { paidamount: payedValue })
        } catch (e) {
          console.error('Failed to update project paidamount on submit:', e)
        }
      }

      // ✅ STEP 2: Get selected logs
      const selectedLogs = filteredLogs.filter((log) => selectedLogIds.includes(log.id))
      console.log('Selected Rows:', selectedLogs)

      const companyID = selectedLogs.length > 0 ? selectedLogs[0].company_id : form.company_id

      if (selectedLogs.length === 0 && !(advanceEnabled && Number(advanceAmount) > 0) && !(fixedBidEnabled && Number(fixedBidAmount) > 0)) {
        showToast('warning', 'Select logs, enable Advance Payment, or enable Fixed Bid Work')
        setLoading(false)
        return
      }

      // ✅ STEP 3: Calculate total amount
      const totalAmount = selectedLogs.reduce((acc, l) => {
        const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0
        const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0
        const total = l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
          ? Number(l.actual_machine_hr)
          : Math.max(0, end - start)
        const price = Number(l.price_per_hour) || 0
        return acc + total * price
      }, 0)

      // ✅ STEP 4: If logs selected, mark them as paid and create invoice
      let lastNavigationId = null
      if (selectedLogs.length > 0) {
        console.log('🔄 Updating isPaid=1 for logs:', selectedLogIds)
        const updatePromises = selectedLogIds.map(logId =>
          put(`/api/machine-logs/${logId}/isPaid`, { isPaid: 1 })
        )

        await Promise.all(updatePromises)
        console.log('✅ ALL selected logs updated to isPaid = 1')

        // Update local state
        setFilteredLogs(prev =>
          prev.map(log =>
            selectedLogIds.includes(log.id)
              ? { ...log, isPaid: 1 }
              : log
          )
        )
        setSelectedLogIds([])

        // Check for Advance Payment to merge
        let mainPaidAmount = 0;
        let mainPaymentMode = null;
        let mainTransactionId = null;
        let mainRemark = null;

        if (advanceEnabled && Number(advanceAmount) > 0) {
          mainPaidAmount = Number(advanceAmount);
          mainPaymentMode = advanceMode;
          mainTransactionId = advanceTransactionId;
          mainRemark = advanceRemark;
        }

        const paymentData = {
          project_id: form.projectId,
          company_id: companyID,
          total: totalAmount,
          paid_amount: mainPaidAmount, // Send actual paid amount
          worklog_ids: selectedLogIds,
          // Add optional payment fields
          payment_mode: mainPaymentMode,
          transaction_id: mainTransactionId,
          remark: mainRemark,
          // mode: mainPaymentMode // Backend expects payment_mode for main, but checks 'mode' for adv/fixed. Let's send both or rely on controller logic. 
          // Controller uses `payment_mode` for Normal invoices if not advance/fixed.
        }

        if (editMode && onSubmit) {
          await onSubmit(paymentData)
          showToast('success', `${selectedLogs.length} logs marked as paid`)
        } else {
          const resp = await post('/api/project-payments', paymentData)
          if (resp && resp.id) {
            lastNavigationId = resp.id
            if (validAdditionalCharges.length > 0) {
              await post('/api/invoice-additional-charges/bulk', {
                invoice_id: String(resp.invoice_number),
                company_id: companyID,
                charges: validAdditionalCharges,
              });
            }

            showToast('success', `Invoice created! ${selectedLogs.length} logs marked as PAID ✅`);
          }
        }
      }

      // ✅ STEP 5: Create Advance Payment invoice (Only if NOT already merged)
      // If we merged it above (advanceEnabled & selectedLogs.length > 0), we skip this.
      // This step is ONLY for when NO logs are selected but user wants to create an "Advance Only" invoice (if that flow exists)
      // OR if logic dictates they are separate. User wants them merged. 
      // So checks: if selectedLogs.length === 0 AND advanceEnabled, then create advance invoice.

      if (selectedLogs.length === 0 && advanceEnabled && Number(advanceAmount) > 0) {
        const advResp = await post('/api/project-payments', {
          company_id: companyID,
          project_id: form.projectId,
          total: Number(advanceAmount),
          paid_amount: Number(advanceAmount),
          is_advance: true,
          transaction_id: advanceTransactionId || null,
          mode: advanceMode || null,
          remark: advanceRemark || null,
        });
        if (advResp && advResp.id) {
          showToast('success', 'Advance payment invoice created');
          if (!lastNavigationId) lastNavigationId = advResp.id;
        }
      }

      // ✅ STEP 6: Create Fixed Bid Work invoice (optional)
      if (fixedBidEnabled && Number(fixedBidAmount) > 0) {
        // Validation: Paid Amount cannot be greater than Total Amount
        if (Number(fixedBidPaidAmount) > Number(fixedBidAmount)) {
          showToast('danger', 'Advance amount cannot be greater than Total amount');
          setLoading(false);
          return;
        }

        const fbResp = await post('/api/project-payments', {
          company_id: companyID,
          project_id: form.projectId,
          total: Number(fixedBidAmount),
          paid_amount: Number(fixedBidPaidAmount) || 0, // ✅ Send Paid Amount
          is_fixed_bid: true,
          transaction_id: Number(fixedBidPaidAmount) > 0 ? fixedBidTransactionId : null,
          mode: Number(fixedBidPaidAmount) > 0 ? fixedBidMode : 'Fixed Bid',
          remark: fixedBidRemark || null,
          date: form.invoiceDate,
        });
        // if (fbResp && fbResp.id) {
        //   showToast('success', 'Fixed Bid Work invoice created');
        //   if (!lastNavigationId) lastNavigationId = fbResp.id;

        if (fbResp && fbResp.id) {
          if (!lastNavigationId) lastNavigationId = fbResp.id;

          // 🔹 SEND ADDITIONAL CHARGES
          if (validAdditionalCharges.length > 0) {
            await post('/api/invoice-additional-charges/bulk', {
              invoice_id: String(fbResp.id),
              company_id: companyID,
              charges: validAdditionalCharges,
            });
          }
          showToast('success', 'Fixed Bid Work invoice created');
        }
      }

      if (lastNavigationId) {
        setTimeout(() => {
          navigate(`/payment-page/${lastNavigationId}`)
        }, 1000);
      }
    } catch (error) {
      console.error('Submit error:', error)
      showToast('danger', 'Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  // ✅ REMOVED: handleCheckboxChange function (no longer needed)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{editMode ? 'Edit Invoice' : 'Create Invoice'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm validated={validated} onSubmit={submitInvoice}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Customer Name <span style={{ color: "red" }}>*</span></CFormLabel>
                  <div ref={projectInputRef} style={{ position: 'relative' }}>
                    <CInputGroup>
                      <CFormInput
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setShowDropdown(true)
                        }}
                        placeholder="Search by customer name, location, mobile..."
                        required
                      />
                      <CInputGroupText>
                        <CIcon icon={cilSearch} />
                      </CInputGroupText>
                      {searchQuery && (
                        <CButton color="link" onClick={clearProject} className="position-absolute end-0 me-5">
                          <CIcon icon={cilX} />
                        </CButton>
                      )}
                    </CInputGroup>
                    {projectsLoading && showDropdown && searchQuery.length > 0 && (
                      <div className="dropdown-menu show p-2">
                        <CSpinner size="sm" /> Loading customers...
                      </div>
                    )}
                    {showDropdown && filteredProjects.length > 0 && (
                      <div ref={dropdownRef} className="dropdown-menu show" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {filteredProjects.map((project) => (
                          <div
                            key={project.id}
                            className="dropdown-item cursor-pointer p-2 border-bottom"
                            onClick={() => handleProjectChange(project)}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f8f9fa')}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                          >
                            <div className="fw-medium text-primary">{project.customer_name}</div>
                            {project.work_place && (
                              <div className="small text-muted">
                                <strong>Location:</strong> {project.work_place}
                              </div>
                            )}
                            {project.mobile_number && (
                              <div className="small text-muted">
                                <strong>Mobile:</strong> {project.mobile_number}
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="dropdown-item text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary w-100"
                            onClick={handleAddCustomer}
                          >
                            Add customer "{searchQuery}"
                          </button>
                        </div>
                      </div>
                    )}
                    {searchQuery.length > 0 && filteredProjects.length === 0 && showDropdown && (
                      <div
                        ref={dropdownRef}
                        className="dropdown-menu show"
                        style={{ maxHeight: '300px', overflowY: 'auto' }}
                      >
                        <div className="dropdown-item text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary w-100"
                            onClick={handleAddCustomer}
                          >
                            Add customer "{searchQuery}"
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {form.customer_name && (
                    <div className="mt-1 p-2 bg-light rounded border">
                      <div className="small text-success">
                        <strong>Selected:</strong> {form.customer_name}
                      </div>
                      {form.customer.address && (
                        <div className="small text-muted">
                          <strong>Location:</strong> {form.customer.address}
                        </div>
                      )}
                    </div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Invoice Date <span style={{ color: "red" }}>*</span></CFormLabel>
                  <CFormInput
                    type="date"
                    name="invoiceDate"
                    value={form.invoiceDate}
                    onChange={handleFormChange}
                    required
                  />
                </CCol>
              </CRow>

              {filteredLogs.length > 0 && (
                <div className="mt-1">
                  {/* <h6 className="fw-semibold mb-3">
                    Project Logs (Total : {filteredLogs.length}) |
                    <span className="text-primary ms-2">
                      Selected: {selectedLogIds.length}
                    </span>
                  </h6> */}

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-semibold mb-0">
                      Project Logs (Total: {filteredLogs.length}) |
                      <span className="text-primary ms-2">
                        Showing: {searchFilteredLogs.length}
                      </span> |
                      <span className="text-success ms-2">
                        Selected: {selectedLogIds.length}
                      </span>
                    </h6>

                    <div style={{ width: '300px' }}>
                      <CInputGroup size="sm">
                        <CInputGroupText>
                          <CIcon icon={cilSearch} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder="Search by operator, work type, machine, mode..."
                          value={logSearchQuery}
                          onChange={(e) => setLogSearchQuery(e.target.value)}
                        />
                        {logSearchQuery && (
                          <CButton
                            color="secondary"
                            variant="outline"
                            onClick={() => setLogSearchQuery('')}
                          >
                            <CIcon icon={cilX} />
                          </CButton>
                        )}
                      </CInputGroup>
                    </div>
                  </div>
                  <div
                    className="table-container"
                    style={{
                      width: '100%',
                      overflowX: 'auto',
                      overflowY: 'auto',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      WebkitOverflowScrolling: 'touch', // Smooth iOS scrolling
                    }}
                  >
                    <table
                      className="table table-bordered align-middle"
                      style={{
                        minWidth: '1200px', // Ensure enough width for horizontal scroll
                        width: '100%',
                        tableLayout: 'fixed', // Keep for performance
                        margin: 0,
                      }}
                    >
                      <thead
                        className="table-light"
                        style={{
                          position: 'sticky',
                          top: 0,
                          backgroundColor: '#f8f9fa',
                          zIndex: 10,
                        }}
                      >
                        <tr>
                          <th style={{ width: '50px' }} className="text-center align-middle">
                            {/* <input
                              type="checkbox"
                              checked={selectedLogIds.length === filteredLogs.length && selectedLogIds.length > 0}
                              onChange={(e) => {
                                const isChecked = e.target.checked
                                setSelectedLogIds(isChecked ? filteredLogs.map((l) => l.id) : [])
                              }}
                            /> */}
                            <input
                              type="checkbox"
                              checked={
                                searchFilteredLogs.length > 0 &&
                                searchFilteredLogs.every((l) => selectedLogIds.includes(l.id))
                              }
                              onChange={(e) => {
                                const isChecked = e.target.checked
                                setSelectedLogIds(
                                  isChecked
                                    ? [...new Set([...selectedLogIds, ...searchFilteredLogs.map((l) => l.id)])]
                                    : selectedLogIds.filter((id) => !searchFilteredLogs.map((l) => l.id).includes(id))
                                )
                              }}
                            />
                          </th>
                          <th style={{ width: '90px', minWidth: '90px' }} className="text-center align-middle">
                            Date
                          </th>
                          <th style={{ width: '110px', minWidth: '100px' }} className="text-center align-middle">
                            Machine
                          </th>
                          <th style={{ width: '100px', minWidth: '90px' }} className="text-center align-middle">
                            Operator
                          </th>
                          <th style={{ width: '100px', minWidth: '90px' }} className="text-center align-middle">Work Type</th>
                          <th style={{ width: '80px' }} className="text-center align-middle">Start</th>
                          <th style={{ width: '80px' }} className="text-center align-middle">End</th>
                          <th style={{ width: '80px' }} className="text-center align-middle">Net</th>
                          <th style={{ width: '70px' }} className="text-center align-middle">Mode</th>
                          <th style={{ width: '90px' }} className="text-center align-middle">Price/Hr</th>
                          <th style={{ width: '100px' }} className="text-center align-middle">Total</th>
                          <th style={{ width: '100px' }} className="text-center align-middle">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchFilteredLogs.map((l, idx) => {
                          const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0
                          const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0
                          const total =
                            l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
                              ? Number(l.actual_machine_hr)
                              : Math.max(0, end - start)
                          const workDate = String(l.work_date).slice(0, 10).split('-').reverse().join('-')
                          const operatorDisplay = operators.find((ele) => ele.id == l.operator_id) || { name: 'N/A' }
                          const price_per_hour =
                            String(l.id) === String(editingLogRowId) ? Number(editingLogPrice || 0) : Number(l.price_per_hour || 0)
                          const totalprice = total * price_per_hour
                          const modeMatch = prices.find((p) => p.id === Number(l.mode_id))
                          const modeName = modeMatch ? modeMatch.mode : 'N/A'

                          return (
                            <tr key={idx}>
                              <td className="text-center align-middle">
                                <input
                                  type="checkbox"
                                  checked={selectedLogIds.includes(l.id)}
                                  onChange={() => handleLogSelection(l.id)}
                                />
                              </td>
                              <td className="text-center small">{workDate || 'N/A'}</td>
                              <td
                                className="text-truncate small"
                                style={{ maxWidth: '110px' }}
                                title={getMachineName(l.machine_id)}
                              >
                                {getMachineName(l.machine_id)}
                              </td>
                              <td
                                className="text-truncate small"
                                style={{ maxWidth: '100px' }}
                                title={operatorDisplay.name}
                              >
                                {operatorDisplay.name}
                              </td>
                              <td>
                                {workTypeMap[l.work_type_id] || '-'}
                              </td>

                              <td className="text-center">{start}</td>
                              <td className="text-center">{end}</td>
                              <td className="text-center">{total}</td>
                              <td className="text-center small">{modeName}</td>
                              <td>
                                {String(l.id) === String(editingLogRowId) ? (
                                  <input
                                    type="number"
                                    value={editingLogPrice}
                                    min={0}
                                    step="0.01"
                                    onChange={(e) => setEditingLogPrice(e.target.value)}
                                    style={{ width: '70px', fontSize: '0.875rem' }}
                                    className="form-control form-control-sm"
                                  />
                                ) : (
                                  <div className="text-center small">₹{price_per_hour}</div>
                                )}
                              </td>
                              <td className="text-center small">₹{totalprice.toFixed(2)}</td>
                              <td className="text-center">
                                {String(l.id) === String(editingLogRowId) ? (
                                  <>
                                    <CButton size="sm" color="success" className="me-1" onClick={() => saveEditLogPrice(l)}>
                                      Save
                                    </CButton>
                                    <CButton size="sm" color="secondary" variant="outline" onClick={cancelEditLogPrice}>
                                      Cancel
                                    </CButton>
                                  </>
                                ) : (
                                  <CButton size="sm" color="info" className="text-white" onClick={() => startEditLogPrice(l)}>
                                    Edit
                                  </CButton>
                                )}
                              </td>
                            </tr>
                          )
                        })}

                        {/* Grand Total Row */}
                        {selectedLogIds.length > 0 && (() => {
                          // const totalNetReading = filteredLogs
                          const totalNetReading = searchFilteredLogs
                            .filter((l) => selectedLogIds.includes(l.id))
                            .reduce((acc, l) => {
                              const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0
                              const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0
                              const total =
                                l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
                                  ? Number(l.actual_machine_hr)
                                  : Math.max(0, end - start)
                              return acc + total
                            }, 0)

                          // const totalAmount = filteredLogs
                          const totalAmount = searchFilteredLogs
                            .filter((l) => selectedLogIds.includes(l.id))
                            .reduce((acc, l) => {
                              const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0
                              const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0
                              const total =
                                l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
                                  ? Number(l.actual_machine_hr)
                                  : Math.max(0, end - start)
                              const price = Number(l.price_per_hour) || 0
                              return acc + total * price
                            }, 0)

                          return (
                            <tr className="fw-bold table-success">
                              <td className="text-center align-middle">{selectedLogIds.length}</td>
                              <td colSpan="6" className="text-end pe-3">
                                Grand Total:
                              </td>
                              <td className="text-center">{totalNetReading.toFixed(2)}</td>
                              <td></td>
                              <td className="text-end pe-3">₹{totalAmount.toFixed(2)}</td>
                              <td></td>
                            </tr>
                          )
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {filteredLogs.length > 0 && (<CCard className="mb-4 border-0 shadow-sm">
                <CCardHeader style={{ background: '#f3f4f6' }}>
                  <h6 className="mb-0 fw-bold">Additional Charges</h6>
                </CCardHeader>

                <CCardBody>
                  {additionalCharges.map((item, index) => (
                    <CRow className="align-items-end mb-3" key={index}>
                      {/* Charge Type */}
                      <CCol md={3}>
                        <CFormLabel>Charge Type</CFormLabel>
                        <CFormSelect
                          value={item.charge_type}
                          onChange={(e) =>
                            handleAdditionalChargeChange(index, 'charge_type', e.target.value)
                          }
                        >
                          <option value="">Select charge type</option>
                          <option value="service_charge">Service Charge</option>
                          <option value="travelling_charge">Travelling Charge</option>
                          <option value="other_charge">Other Charge</option>
                        </CFormSelect>

                      </CCol>

                      {/* Amount */}
                      <CCol md={2}>
                        <CFormLabel>Amount</CFormLabel>
                        <CFormInput
                          type="number"
                          placeholder="0"
                          value={item.amount}
                          onChange={(e) =>
                            handleAdditionalChargeChange(index, 'amount', e.target.value)
                          }
                        />
                      </CCol>

                      {/* Remark */}
                      {/* <CCol md={4}>
                        <CFormLabel>Remark</CFormLabel>
                        <CFormInput
                          type="text"
                          placeholder="Optional remark"
                          value={item.remark}
                          onChange={(e) =>
                            handleAdditionalChargeChange(index, 'remark', e.target.value)
                          }
                        />
                      </CCol> */}
                      <CCol> <CButton size="sm" color="primary" variant="outline" onClick={addAdditionalCharge}>
                        + Add Additional Charge
                      </CButton></CCol>
                      {/* Remove */}
                      <CCol md={1}>
                        {additionalCharges.length > 1 && (
                          <CButton
                            color="danger"
                            variant="ghost"
                            onClick={() => removeAdditionalCharge(index)}
                          >
                            <CIcon icon={cilX} />
                          </CButton>
                        )}
                      </CCol>
                    </CRow>
                  ))}


                </CCardBody>

                {/* Grand Total + Additional Charges - ADD THIS */}
                {additionalCharges.some(charge => charge.charge_type && charge.amount) && (
                  <CCardBody className="border-top bg-light">
                    <CRow className="align-items-center">
                      <CCol md={9} className="text-end">
                        <h6 className="mb-0 fw-bold">Additional Charges:</h6>
                      </CCol>
                      <CCol md={3}>
                        <h5 className="mb-0 fw-bold text-primary">
                          ₹{additionalCharges
                            .filter(charge => charge.charge_type && charge.amount)
                            .reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0)
                            .toFixed(2)}
                        </h5>
                      </CCol>
                    </CRow>
                  </CCardBody>
                )}
              </CCard>)}

              {selectedLogIds.length > 0 && (
                <CRow className="align-items-center mt-3 pt-3 border-top">
                  <CCol md={9} className="text-end">
                    <h6 className="mb-0 fw-bold text-success">Actual Payable(Logs + Additional Charges):</h6>
                  </CCol>
                  <CCol md={3}>
                    <h4 className="mb-0 fw-bold text-success">
                      ₹{(() => {
                        // Calculate selected logs total
                        const logsTotal = searchFilteredLogs
                          .filter((l) => selectedLogIds.includes(l.id))
                          .reduce((acc, l) => {
                            const start = Number(l.machine_start ?? l.start_reading ?? 0) || 0;
                            const end = Number(l.machine_end ?? l.end_reading ?? 0) || 0;
                            const total = l.actual_machine_hr != null && !isNaN(Number(l.actual_machine_hr))
                              ? Number(l.actual_machine_hr)
                              : Math.max(0, end - start);
                            const price = Number(l.price_per_hour) || 0;
                            return acc + (total * price);
                          }, 0);

                        // Calculate additional charges total
                        const additionalTotal = additionalCharges
                          .filter(charge => charge.charge_type && charge.amount)
                          .reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0);

                        // Return combined total
                        return (logsTotal + additionalTotal).toFixed(2);
                      })()}
                    </h4>
                  </CCol>
                </CRow>
              )}

              {/* Advance Payment Section */}
              {form.projectId && (
                <div className={`my-2 ${advanceEnabled ? 'p-3' : 'px-3 py-2'} bg-light rounded border`}>
                  <div className={`form-check form-switch d-flex align-items-center gap-2 ${advanceEnabled ? 'mb-3' : 'mb-0'}`}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="advanceSwitch"
                      checked={advanceEnabled}
                      disabled={fixedBidEnabled}
                      onChange={(e) => {
                        const isChecked = e.target.checked
                        setAdvanceEnabled(isChecked)
                        if (isChecked) {
                          // Disable & Reset Fixed Bid fields
                          setFixedBidEnabled(false)
                          setFixedBidAmount('')
                          setFixedBidPaidAmount('')
                          setFixedBidMode('')
                          setFixedBidTransactionId('')
                          setFixedBidRemark('')
                        }
                      }}

                    />


                    <label className="form-check-label mb-0 fw-semibold" htmlFor="advanceSwitch">
                      Advance Payment
                    </label>
                  </div>

                  {advanceEnabled && (
                    <div className="row g-3">

                      <div className="col-md-3">
                        <CFormLabel>Advance Amount <span className="text-danger">*</span></CFormLabel>
                        <CFormInput
                          type="number"
                          min="0"
                          placeholder="Enter amount"
                          value={advanceAmount}
                          onChange={(e) => setAdvanceAmount(e.target.value)}
                          required
                        />
                      </div>


                      <div className="col-md-3">
                        <CFormLabel>Transaction ID</CFormLabel>
                        <CFormInput
                          type="text"
                          placeholder="Enter transaction ID"
                          value={advanceTransactionId}
                          onChange={(e) => setAdvanceTransactionId(e.target.value)}
                        />
                      </div>


                      <div className="col-md-3">
                        <CFormLabel>Mode</CFormLabel>
                        <CFormSelect
                          value={advanceMode}
                          onChange={(e) => setAdvanceMode(e.target.value)}
                        >
                          <option value="">Select mode</option>
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI and Online</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Credit">Credit</option>
                        </CFormSelect>
                      </div>


                      <div className="col-md-3">
                        <CFormLabel>Remark</CFormLabel>
                        <CFormInput
                          type="text"
                          placeholder="Enter remark"
                          value={advanceRemark}
                          onChange={(e) => setAdvanceRemark(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Fixed Bid Work Section */}
              {form.projectId && (
                <div className={`my-2 ${fixedBidEnabled ? 'p-3' : 'px-3 py-2'} bg-light rounded border`}>
                  <div className={`form-check form-switch d-flex align-items-center gap-2 ${fixedBidEnabled ? 'mb-3' : 'mb-0'}`}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="fixedBidSwitch"
                      checked={fixedBidEnabled}
                      disabled={advanceEnabled}
                      onChange={(e) => {
                        const isChecked = e.target.checked
                        setFixedBidEnabled(isChecked)
                        if (isChecked) {
                          // Disable & Reset Advance fields
                          setAdvanceEnabled(false)
                          setAdvanceAmount('')
                          setAdvanceMode('')
                          setAdvanceTransactionId('')
                          setAdvanceRemark('')
                        }
                      }}

                    />

                    <label className="form-check-label mb-0 fw-semibold" htmlFor="fixedBidSwitch">
                      Fixed Bid Work
                    </label>
                  </div>

                  {fixedBidEnabled && (
                    <div className="row g-3">
                      {/* Amount */}
                      <div className="col-md-3">
                        <CFormLabel>Total Amount <span className="text-danger">*</span></CFormLabel>
                        <CFormInput
                          type="number"
                          min="0"
                          placeholder="Enter total amount"
                          value={fixedBidAmount}
                          onChange={(e) => setFixedBidAmount(e.target.value)}
                          required
                        />
                      </div>

                      {/* Paid Amount - NEW FIELD */}
                      <div className="col-md-3">
                        <CFormLabel>Advance Amount</CFormLabel>
                        <CFormInput
                          type="number"
                          min="0"
                          placeholder="Enter paid amount"
                          value={fixedBidPaidAmount}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            const total = parseFloat(fixedBidAmount) || 0;
                            if (val > total) {
                              showToast('danger', 'Paid amount cannot be greater than Total amount');
                              return;
                            }
                            setFixedBidPaidAmount(e.target.value);
                          }}
                        />
                      </div>

                      {/* Transaction ID & Mode - Show if Paid Amount > 0 */}
                      {Number(fixedBidPaidAmount) > 0 && (
                        <>
                          <div className="col-md-3">
                            <CFormLabel>Transaction ID</CFormLabel>
                            <CFormInput
                              type="text"
                              placeholder="Enter transaction ID"
                              value={fixedBidTransactionId}
                              onChange={(e) => setFixedBidTransactionId(e.target.value)}
                            />
                          </div>
                          <div className="col-md-3">
                            <CFormLabel>Mode</CFormLabel>
                            <CFormSelect
                              value={fixedBidMode}
                              onChange={(e) => setFixedBidMode(e.target.value)}
                            >
                              <option value="">Select mode</option>
                              <option value="Cash">Cash</option>
                              <option value="UPI">UPI and Online</option>
                              <option value="Bank Transfer">Bank Transfer</option>
                              <option value="Credit">Credit</option>
                            </CFormSelect>
                          </div>
                        </>
                      )}

                      {/* Description (Renamed from Remark) */}
                      <div className="col-md-6">
                        <CFormLabel>Description</CFormLabel>
                        <CFormInput
                          type="text"
                          placeholder="Enter description"
                          value={fixedBidRemark}
                          onChange={(e) => setFixedBidRemark(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}



              <CButton
                color="primary"
                type="submit"
                disabled={
                  loading || !form.projectId || !form.customer_id || projectsLoading ||
                  (selectedLogIds.length === 0 && !(advanceEnabled && Number(advanceAmount) > 0) && !(fixedBidEnabled && Number(fixedBidAmount) > 0))
                }
              >
                {loading ? <CSpinner size="sm" /> : editMode ? 'Update Invoice' : 'Submit Invoice'}
              </CButton>
            </CForm>

            <CModal visible={showAddCustomerModal} onClose={() => setShowAddCustomerModal(false)}>
              <CModalHeader closeButton>Add New Customer</CModalHeader>
              <CModalBody>
                <CForm onSubmit={handleNewCustomerSubmit}>
                  <CRow className="g-3">
                    <CCol md={12}>
                      <CFormLabel>Customer Name</CFormLabel>
                      <CFormInput
                        type="text"
                        name="customer_name"
                        value={newCustomerForm.customer_name}
                        onChange={handleNewCustomerChange}
                        placeholder="Enter Customer Name..."
                        required
                      />
                    </CCol>
                    <CCol md={12}>
                      <CFormLabel>Mobile Number</CFormLabel>
                      <CFormInput
                        type="text"
                        name="mobile_number"
                        value={newCustomerForm.mobile_number}
                        onChange={handleNewCustomerChange}
                        placeholder="Enter Customer Mobile..."
                        maxLength={10}
                        required
                      />
                    </CCol>
                    <CCol md={12}>
                      <CFormLabel>GST Number (Optional)</CFormLabel>
                      <CFormInput
                        type="text"
                        name="gst_number"
                        value={newCustomerForm.gst_number}
                        onChange={handleNewCustomerChange}
                        placeholder="Enter GST number..."
                        maxLength={15}
                      />
                    </CCol>
                    <CCol md={12}>
                      <CFormLabel>Location</CFormLabel>
                      <CFormInput
                        type="text"
                        name="work_place"
                        value={newCustomerForm.work_place}
                        onChange={handleNewCustomerChange}
                        placeholder="Enter Location..."
                      />
                    </CCol>
                  </CRow>
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" variant="outline" onClick={() => setShowAddCustomerModal(false)}>
                  Cancel
                </CButton>
                <CButton color="primary" onClick={handleNewCustomerSubmit} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Customer'}
                </CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow >
  )
}

export default Invoice