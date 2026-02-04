import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from '@coreui/react';
import { deleteAPICall, getAPICall, put } from '../../../util/api';
import ConfirmationModal from '../../common/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/toast/ToastContext';
import EditExpense from '../expense/EditExpense';
import { useTranslation } from 'react-i18next';
import { getUserType } from '../../../util/session';
import { getUserData } from '../../../util/session';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExpenseReport = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation('global');

  const usertype = getUserType();

  // State management
  const [expenseType, setExpenseType] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [deleteResource, setDeleteResource] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [validated, setValidated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [gstFilter, setGstFilter] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('');
  const [machineries, setMachineries] = useState([]);
  const [selectedExpenseFilter, setSelectedExpenseFilter] = useState('');

  // Helper to get current month dates
  const getMonthDates = () => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // Adjust for timezone offset to ensure correct date string
    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    return {
      start: formatDate(firstDay),
      end: formatDate(lastDay)
    };
  };

  const [state, setState] = useState({
    start_date: getMonthDates().start,
    end_date: getMonthDates().end,
  });

  // Image modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Refs
  const tableContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const isInfiniteScrollingRef = useRef(false);

  // Fetch machineries
  const fetchMachineries = async () => {
    try {
      const res = await getAPICall('/api/machine-operators');
      if (Array.isArray(res)) {
        setMachineries(res);
      }
    } catch (err) {
      console.error('Error fetching machineries:', err);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchMachineries();
    fetchExpense();
  }, []);

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Debounced search
  const debouncedSearch = useCallback((value) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => setSearchTerm(value), 300);
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  const getSortIconStyle = (columnKey) => ({
    marginLeft: '8px',
    fontSize: '14px',
    opacity: sortConfig.key === columnKey ? 1 : 0.5,
    color: sortConfig.key === columnKey ? '#0d6efd' : '#6c757d',
    transition: 'all 0.2s ease',
  });

  const fetchExpenseType = async () => {
    try {
      const response = await getAPICall('/api/expenseType');
      const result = response.reduce((acc, current) => {
        acc[current.id] = current.name;
        return acc;
      }, {});
      setExpenseType(result);
    } catch (error) {
      showToast('danger', 'Error fetching expense types: ' + error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      const container = tableContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const threshold = 100;
      scrollPositionRef.current = scrollTop;

      if (
        scrollTop + clientHeight >= scrollHeight - threshold &&
        hasMorePages &&
        !isFetchingMore &&
        !isLoading
      ) {
        isInfiniteScrollingRef.current = true;
        fetchExpense(false);
      }
    }, 100);
  }, [hasMorePages, isFetchingMore, isLoading]);

  const fetchExpense = async (reset = true) => {
    if (!state.start_date || !state.end_date) {
      showToast('warning', t('MSG.please_select_dates') || 'Please select start and end dates');
      return;
    }

    const userData = getUserData();
    if (!userData?.company_id) {
      showToast('danger', 'Company not selected or session invalid. Please login again.');
      return;
    }

    if (reset) {
      setIsLoading(true);
      isInfiniteScrollingRef.current = false;
    } else {
      setIsFetchingMore(true);
    }

    try {
      let url = `/api/expense?company_id=${userData.company_id}&startDate=${state.start_date}&endDate=${state.end_date}`;
      if (selectedMachine) url += `&machineId=${selectedMachine}`;
      if (selectedExpenseFilter) url += `&expenseId=${selectedExpenseFilter}`;
      if (nextCursor && !reset) url += `&cursor=${nextCursor}`;
      const response = await getAPICall(url);

      if (response.error) {
        showToast('danger', response.error);
      } else {
        const newExpenses = reset ? response.data : [...expenses, ...response.data];
        setExpenses(newExpenses);
        setTotalExpense(response.totalExpense || 0);
        setNextCursor(response.next_cursor || null);
        setHasMorePages(response.has_more_pages);

        if (isInfiniteScrollingRef.current && !reset) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (tableContainerRef.current) {
                tableContainerRef.current.scrollTop = scrollPositionRef.current;
              }
              isInfiniteScrollingRef.current = false;
            });
          });
        }
      }
    } catch (error) {
      showToast('danger', 'Error occurred: ' + error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleSubmit = async (event) => {
    try {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      if (form.checkValidity()) {
        isInfiniteScrollingRef.current = false;
        scrollPositionRef.current = 0;
        setNextCursor(null);
        await fetchExpense(true);
      }
    } catch (e) {
      showToast('danger', 'Error occurred: ' + e);
    }
  };

  const handleDelete = (expense) => {
    setDeleteResource(expense);
    setDeleteModalVisible(true);
  };

  const onDelete = async () => {
    try {
      await deleteAPICall('/api/expense/' + deleteResource.id);
      setDeleteModalVisible(false);
      fetchExpense(true);
      showToast('success', t('MSG.expense_deleted_successfully') || 'Expense deleted successfully');
    } catch (error) {
      showToast('danger', 'Error occurred: ' + error);
    }
  };

  const handleEdit = async (expense) => {
    try {
      await put('/api/expense/' + expense.id, { ...expense, show: !expense.show });
      fetchExpense(true);
    } catch (error) {
      showToast('danger', 'Error occurred: ' + error);
    }
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setShowEditModal(true);
  };

  const handleExpenseUpdated = () => {
    fetchExpense(true);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
  };

  const handleViewImage = (expense) => {
    setSelectedImage(expense.photo_url || '');
    setShowImageModal(true);
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheetData = sortedFilteredExpenses.map((expense, index) => ({
      'Sr No': expense.sr_no,
      'Date': formatDate(expense.expense_date),
      'Machine Name': expense.machine_name || '-',
      'Expense Details': expenseType[expense.expense_id] || '-',
      'About Expense': expense.desc || '-',
      'Amount': expense.total_price,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    XLSX.writeFile(workbook, `Expense_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('success', 'Excel file downloaded successfully!');
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const usableWidth = pageWidth - 2 * margin;

    const tableColumn = ['Sr No', 'Date', 'Machine Name', 'Expense Details', 'About', 'Amount'];
    const tableRows = sortedFilteredExpenses.map((expense) => [
      expense.sr_no,
      formatDate(expense.expense_date),
      expense.machine_name || '-',
      expenseType[expense.expense_id] || '-',
      expense.desc || '-',
      `INR ${formatIndianNumber(expense.total_price)}`,
    ]);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(22, 160, 133);
    doc.text('Expense Report', margin, 40);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: 'linebreak',
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
      },
      columnStyles: (() => {
        const colCount = tableColumn.length;
        const colWidth = usableWidth / colCount;
        const styles = {};
        for (let i = 0; i < colCount; i++) {
          styles[i] = { cellWidth: colWidth };
        }
        return styles;
      })(),
      didDrawPage: (data) => {
        const finalY = data.cursor.y + 20;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(34, 34, 34);
        doc.text(
          `Total Amount: INR ${formatIndianNumber(displayTotalExpense)}`,
          margin,
          finalY
        );
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(
          `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
          pageWidth - margin - 50,
          pageHeight - 20
        );
      },
    });

    const fileName = `Expense_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    showToast('success', 'PDF file downloaded successfully!');
  };

  const formatIndianNumber = (amount) => {
    const numericAmount = parseFloat(amount) || 0;
    if (isNaN(numericAmount)) return '0.00';
    const [integerPart, decimalPart = '00'] = numericAmount.toFixed(2).split('.');
    const lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);
    const formattedInteger =
      otherNumbers.length > 0
        ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
        : lastThree;
    return `${formattedInteger}.${decimalPart}`;
  };

  const formatCurrency = (amount) => {
    return `INR ${formatIndianNumber(amount)}`;
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', options).replace(',', '');
    const [month, day] = formattedDate.split(' ');
    return `${day} ${month}`;
  };

  const sortedFilteredExpenses = useMemo(() => {
    let filtered = expenses.map((expense, index) => ({
      ...expense,
      sr_no: index + 1,
    }));

    if (selectedMachine) {
      // Backend filtering is used, but if expenses array is ever used locally without fetch, this keeps consistency?
      // Actually, expenses are replaced on fetch, so this filter is redundant if fetch does the job.
      // But `expenses` contains fetched data. 
      // Let's rely on backend filtering and REMOVE this frontend filter block as it might hide data if pagination logic mismatches.
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((expense) =>
        expenseType[expense.expense_id]?.toLowerCase().includes(searchLower) ||
        expense.expense_date?.toLowerCase().includes(searchLower) ||
        expense.total_price?.toString().includes(searchTerm) ||
        expense.contact?.toLowerCase().includes(searchLower) ||
        expense.desc?.toLowerCase().includes(searchLower) ||
        expense.payment_by?.toLowerCase().includes(searchLower) ||
        expense.payment_type?.toLowerCase().includes(searchLower) ||
        expense.pending_amount?.toString().includes(searchTerm) ||
        expense.customer_name?.toLowerCase().includes(searchLower)
      );
    }

    if (gstFilter === 'gst') {
      filtered = filtered.filter(expense => expense.isGst === 1 || expense.isGst === true);
    } else if (gstFilter === 'non-gst') {
      filtered = filtered.filter(expense => expense.isGst === 0 || expense.isGst === false);
    }

    if (!sortConfig.key) return filtered;

    return [...filtered].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'expense_type') {
        aVal = expenseType[a.expense_id] || '';
        bVal = expenseType[b.expense_id] || '';
      } else if (sortConfig.key === 'customer_name') {
        aVal = a.customer_name || '';
        bVal = b.customer_name || '';
      }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [expenses, searchTerm, sortConfig, expenseType, gstFilter, selectedMachine]);

  const displayTotalExpense = useMemo(() => {
    return sortedFilteredExpenses.reduce((sum, item) => sum + (parseFloat(item.total_price) || 0), 0);
  }, [sortedFilteredExpenses]);

  useEffect(() => {
    fetchExpenseType();
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  if (isLoading && !isFetchingMore) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <CSpinner color="primary" size="lg" />
          <p className="mt-3 text-muted">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .table-container {
          height: 350px;
          overflow-y: auto;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          position: relative;
        }

        @media (max-width: 768px) {
          .table-container {
            height: 400px;
            overflow-x: auto;
            overflow-y: auto;
          }
        }

        .expenses-table {
          width: 100%;
          table-layout: fixed;
          margin-bottom: 0;
        }

        .expenses-table thead th {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
          box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
        }

        .expenses-table th,
        .expenses-table td {
          text-align: center;
          vertical-align: middle;
          padding: 8px 4px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .expenses-table th:nth-child(1) { width: 5%; }
        .expenses-table th:nth-child(2) { width: 10%; }
        .expenses-table th:nth-child(3) { width: 15%; }
        .expenses-table th:nth-child(4) { width: 12%; }
        .expenses-table th:nth-child(5) { width: 13%; text-align: left; }
        .expenses-table th:nth-child(6) { width: 10%; }

        .expenses-table td:nth-child(1) { width: 5%; }
        .expenses-table td:nth-child(2) { width: 10%; }
        .expenses-table td:nth-child(3) { width: 15%; }
        .expenses-table td:nth-child(4) { width: 12%; }
        .expenses-table td:nth-child(5) { width: 13%; text-align: left; }
        .expenses-table td:nth-child(6) { width: 10%; }

        .search-container {
          position: relative;
          width: 100%;
        }

        .search-input {
          padding-left: 40px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          pointer-events: none;
        }

        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 0;
          font-size: 16px;
        }

        .clear-search:hover {
          color: #dc3545;
        }

        .action-buttons {
          display: flex;
          gap: 4px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .loading-more {
          position: sticky;
          bottom: 0;
          background: #f8f9fa;
          border-top: 1px solid #dee2e6;
          padding: 10px;
          text-align: center;
          z-index: 5;
        }

        /* Mobile Card Styles */
        .expense-card {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .expense-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .expense-card .card-body {
          padding: 12px !important;
        }

        .card-row-1 {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .expense-name-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .expense-total {
          text-align: right;
        }

        .total-amount {
          font-weight: 600;
          font-size: 1.1em;
          color: #d32f2f;
          line-height: 1.1;
        }

        .label-text {
          font-size: 0.85em;
          color: #666;
        }

        .value-text {
          font-weight: 500;
          color: #333;
        }

        .card-row-2 {
          margin-bottom: 8px;
          padding: 4px 0;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @media (max-width: 576px) {
          .expense-card .card-body {
            padding: 10px !important;
          }
        }
      `}</style>

      <EditExpense
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        expense={selectedExpense}
        onExpenseUpdated={handleExpenseUpdated}
      />

      <CModal visible={showImageModal} onClose={() => setShowImageModal(false)}>
        <CModalHeader>
          <CModalTitle>View Image</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedImage ? (
            <img
              src={`/bill/bill/${selectedImage.split('/').pop()}`}
              alt="Expense"
              style={{ maxWidth: '100%', maxHeight: '70vh' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.replaceWith(document.createElement('div')).innerHTML =
                  "<p style='color:red;text-align:center;'>Image not available</p>";
              }}
            />
          ) : (
            <p style={{ color: 'red', textAlign: 'center' }}>Image not available</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowImageModal(false)}>
            {t('LABELS.close') || 'Close'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <ConfirmationModal
          visible={deleteModalVisible}
          setVisible={setDeleteModalVisible}
          onYes={onDelete}
          resource={`Delete expense - ${deleteResource?.name}`}
        />
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong className="fs-5">{t('LABELS.expense_report') || 'Expense Report'}</strong>
              <span className="ms-2 text-muted">
                {t('LABELS.total') || 'Total'} {sortedFilteredExpenses.length} expenses
              </span>
            </CCardHeader>
            <CCardBody>
              <CForm noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-sm-3">
                    <CFormLabel htmlFor="start_date">{t('LABELS.start_date') || 'Start Date'}</CFormLabel>
                    <CFormInput
                      type="date"
                      id="start_date"
                      name="start_date"
                      value={state.start_date}
                      onChange={handleChange}
                      required
                      feedbackInvalid="Please select start date."
                    />
                  </div>
                  <div className="col-sm-3">
                    <CFormLabel htmlFor="end_date">{t('LABELS.end_date') || 'End Date'}</CFormLabel>
                    <CFormInput
                      type="date"
                      id="end_date"
                      name="end_date"
                      value={state.end_date}
                      onChange={handleChange}
                      required
                      feedbackInvalid="Please select end date."
                    />
                  </div>
                  <div className="col-sm-2">
                    <CFormLabel>Filter by Machine</CFormLabel>
                    <CFormSelect
                      value={selectedMachine}
                      onChange={(e) => setSelectedMachine(e.target.value)}
                    >
                      <option value="">All Machines</option>
                      {machineries.map((machine) => (
                        <option key={machine.id} value={machine.id}>
                          {machine.machine_name} {machine.model_number ? `(${machine.model_number})` : ''}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                  <div className="col-sm-2">
                    <CFormLabel>Filter by Expense</CFormLabel>
                    <CFormSelect
                      value={selectedExpenseFilter}
                      onChange={(e) => setSelectedExpenseFilter(e.target.value)}
                    >
                      <option value="">All Expenses</option>
                      {Object.entries(expenseType).map(([id, name]) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                  <div className="col-sm-2">
                    <div className="mt-4 d-flex gap-2">
                      <CButton color="success" type="submit" disabled={isLoading}>
                        {isLoading ? t('LABELS.loading') || 'Loading...' : t('LABELS.submit') || 'Submit'}
                      </CButton>
                    </div>
                  </div>
                </div>
              </CForm>
              <hr style={{ height: '2px', margin: '8px 2px', borderTop: '1px solid black' }} />
              <CRow className="mb-2">
                <CCol xs={12} md={6} lg={6}>
                  <div className="search-container">
                    <CFormInput
                      type="text"
                      className="search-input"
                      placeholder={t('LABELS.search_expenses') || ''}
                      value={searchInput}
                      onChange={handleSearchChange}
                    />
                    {searchInput && (
                      <button className="clear-search" onClick={clearSearch} title="Clear search">
                        X
                      </button>
                    )}
                  </div>
                </CCol>
                <CCol xs={12} md={6} lg={6} className="mt-2 mt-md-0">
                  <div className="d-flex gap-2 justify-content-end">
                    <CButton
                      color="primary"
                      onClick={exportToExcel}
                      disabled={!sortedFilteredExpenses.length}
                    >
                      Download Excel
                    </CButton>
                    <CButton
                      color="warning"
                      onClick={exportToPDF}
                      disabled={!sortedFilteredExpenses.length}
                    >
                      Download PDF
                    </CButton>
                  </div>
                </CCol>

                {searchTerm && (
                  <CCol xs={12} className="mt-2">
                    <small className="text-muted">
                      {sortedFilteredExpenses.length} expenses found for "{searchTerm}"
                    </small>
                  </CCol>
                )}
              </CRow>

              {/* MOBILE VIEW */}
              {isMobile ? (
                <div className="mobile-cards-container">
                  {sortedFilteredExpenses.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      {searchTerm ? (
                        <>
                          <p>No expenses found for "{searchTerm}"</p>
                          <CButton color="primary" onClick={clearSearch} size="sm">
                            {t('LABELS.clear_search') || 'Clear Search'}
                          </CButton>
                        </>
                      ) : (
                        <>
                          <p>{t('MSG.no_expenses_found') || 'No expenses found for the selected date range.'}</p>
                          <CButton color="primary" onClick={() => navigate('/expense/new')} size="sm">
                            {t('LABELS.add_expense') || 'Add Expense'}
                          </CButton>
                        </>
                      )}
                    </div>
                  ) : (
                    sortedFilteredExpenses.map((expense) => {
                      const {
                        sr_no,
                        expense_date,
                        expense_id,
                        desc,
                        total_price,
                      } = expense;

                      const expenseName = expenseType[expense_id] || 'N/A';
                      const formattedDate = formatDate(expense_date);
                      const formattedAmount = formatCurrency(total_price);

                      return (
                        <CCard key={expense.id} className="mb-3 expense-card">
                          <CCardBody>
                            {/* Row 1: Sr No & Amount */}
                            <div className="card-row-1">
                              <div className="expense-name-section">
                                <div className="label-text">Sr No</div>
                                <div className="value-text">{sr_no}</div>
                              </div>
                              <div className="expense-total">
                                <div className="label-text">Amount</div>
                                <div className="total-amount">{formattedAmount}</div>
                              </div>
                            </div>

                            {/* Row 2: Date */}
                            <div className="card-row-2">
                              <div className="label-text">Date</div>
                              <div className="value-text">{formattedDate}</div>
                            </div>

                            {/* Row 3: Machine Name */}
                            <div className="card-row-2">
                              <div className="label-text">Machine Name</div>
                              <div className="value-text">{expense.machine_name || '-'}</div>
                            </div>

                            {/* Row 4: Expense Details */}
                            <div className="card-row-2">
                              <div className="label-text">Expense Details</div>
                              <div className="value-text">{expenseName}</div>
                            </div>

                            {/* Row 4: About */}
                            <div className="card-row-2">
                              <div className="label-text">About</div>
                              <div className="value-text">{desc || '-'}</div>
                            </div>
                          </CCardBody>
                        </CCard>
                      );
                    })
                  )}

                  {isFetchingMore && (
                    <div className="loading-more">
                      <CSpinner color="primary" size="sm" />
                      <span className="ms-2 text-muted">
                        {t('MSG.loading') || 'Loading more expenses...'}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* DESKTOP TABLE VIEW */
                <div className="table-container" ref={tableContainerRef} onScroll={handleScroll}>
                  <div className="table-responsive" style={{ width: '100%', overflowX: 'auto', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#fff' }}>
                    <CTable hover striped bordered color="light" className="mb-0">
                      <CTableHead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 10 }}>
                        <CTableRow>
                          <CTableHeaderCell className="text-center align-middle">Sr. No.</CTableHeaderCell>
                          <CTableHeaderCell className="text-center align-middle">Date</CTableHeaderCell>
                          <CTableHeaderCell className="text-center align-middle">Machine Name</CTableHeaderCell>
                          <CTableHeaderCell className="text-center align-middle">Expense Details</CTableHeaderCell>
                          <CTableHeaderCell className="text-center align-middle">About</CTableHeaderCell>
                          <CTableHeaderCell className="text-center align-middle">Amount</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {sortedFilteredExpenses.length === 0 ? (
                          <CTableRow>
                            <CTableDataCell colSpan={6} className="text-center py-4">
                              {searchTerm ? (
                                <div className="text-muted">
                                  <p>No expenses found for "{searchTerm}"</p>
                                  <CButton color="primary" onClick={clearSearch} size="sm">
                                    {t('LABELS.clear_search') || 'Clear Search'}
                                  </CButton>
                                </div>
                              ) : (
                                <div className="text-muted">
                                  <p>{t('MSG.no_expenses_found') || 'No expenses found for the selected date range.'}</p>
                                  <CButton color="primary" onClick={() => navigate('/expense/new')} size="sm">
                                    {t('LABELS.add_expense') || 'Add Expense'}
                                  </CButton>
                                </div>
                              )}
                            </CTableDataCell>
                          </CTableRow>
                        ) : (
                          <>
                            {sortedFilteredExpenses.map((expense) => (
                              <CTableRow key={expense.id}>
                                <CTableDataCell><div>{expense.sr_no || '-'}</div></CTableDataCell>
                                <CTableDataCell><div>{formatDate(expense.expense_date) || '-'}</div></CTableDataCell>
                                <CTableDataCell>
                                  <div style={{ wordBreak: 'break-word' }}>{expense.machine_name || '-'}</div>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div style={{ wordBreak: 'break-word' }}>{expenseType[expense.expense_id] || '-'}</div>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div style={{ wordBreak: 'break-word' }}>{expense.desc || '-'}</div>
                                </CTableDataCell>
                                <CTableDataCell className="text-end">
                                  <span style={{ fontWeight: '500', color: '#dc3545' }}>{formatCurrency(expense.total_price) || '-'}</span>
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                            <CTableRow>
                              <CTableHeaderCell scope="row"></CTableHeaderCell>
                              <CTableHeaderCell className="text-end" colSpan={4}>
                                {t('LABELS.total') || 'Total'}
                              </CTableHeaderCell>
                              <CTableHeaderCell className="text-end" colSpan={1}>{formatCurrency(totalExpense)}</CTableHeaderCell>
                            </CTableRow>
                          </>
                        )}
                      </CTableBody>
                    </CTable>
                  </div>
                  {isFetchingMore && (
                    <div className="loading-more">
                      <CSpinner color="primary" size="sm" />
                      <span className="ms-2 text-muted">{t('MSG.loading') || 'Loading more expenses...'}</span>
                    </div>
                  )}
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default ExpenseReport;