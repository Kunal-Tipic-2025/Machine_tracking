import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
} from '@coreui/react';
import { getAPICall } from '../../../util/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/toast/ToastContext';
import { useTranslation } from 'react-i18next';
import { getUserType, getUserData } from '../../../util/session';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MachineExpenses = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation("global");

  const usertype = getUserType();
  const userData = getUserData();

  // State
  const [machines, setMachines] = useState([]);
  const [machineLogs, setMachineLogs] = useState([]);
  const [expenses1, setExpenses1] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Sample work data (replace with API if needed)
  const work = [
    {
      "id": 10,
      "operator_id": "19",
      "mode_id": 2,
      "price_per_hour": "500.00",
      "company_id": "74",
      "work_date": "2025-10-06",
      "project_id": "33",
      "machine_id": "22",
      "start_reading": "19",
      "start_photo": "machine_start_photos\/142720-machine_photo.jpg",
      "end_reading": "90",
      "end_photo": "machine_end_photos\/144305-machine_photo.jpg",
      "status": "completed",
      "created_at": "2025-10-06T14:42:56.000000Z",
      "updated_at": "2025-10-06T14:43:06.000000Z"
    },
    {
      "id": 11,
      "operator_id": "19",
      "mode_id": 2,
      "price_per_hour": "500.00",
      "company_id": "74",
      "work_date": "2025-10-06",
      "project_id": "39",
      "machine_id": "22",
      "start_reading": "500",
      "start_photo": "machine_start_photos\/142720-machine_photo.jpg",
      "end_reading": "700",
      "end_photo": "machine_end_photos\/144804-machine_photo.jpg",
      "status": "completed",
      "created_at": "2025-10-06T14:47:52.000000Z",
      "updated_at": "2025-10-06T14:48:06.000000Z"
    },
    {
      "id": 12,
      "operator_id": "19",
      "mode_id": 14,
      "price_per_hour": "13.00",
      "company_id": "74",
      "work_date": "2025-10-06",
      "project_id": "33",
      "machine_id": "23",
      "start_reading": "11",
      "start_photo": "machine_start_photos\/182754-machine_photo.jpg",
      "end_reading": "200",
      "end_photo": "machine_end_photos\/182823-machine_photo.jpg",
      "status": "completed",
      "created_at": "2025-10-06T18:27:58.000000Z",
      "updated_at": "2025-10-06T18:28:25.000000Z"
    },
  ];

  // API Calls
  const machinery = async () => {
    try {
      const response = await getAPICall(`/api/machineries1`);
      setMachines(response);
    } catch (error) {
      showToast('danger', 'Error fetching machines: ' + error);
    }
  };

  const fetchMachine = async () => {
    try {
      const response = await getAPICall(`/api/machineLog?company_id=${userData.company_id}`);
      setMachineLogs(response);
    } catch (error) {
      showToast('danger', 'Error fetching machine logs: ' + error);
    }
  };

  const fetchExpense = async () => {
    try {
      const response = await getAPICall(`/api/expense1?company_id=${userData.company_id}`);
      setExpenses1(response[0] || []);
    } catch (error) {
      showToast('danger', 'Error fetching expenses: ' + error);
    }
  };

  useEffect(() => {
    if (userData?.company_id) {
      machinery();
      fetchMachine();
      fetchExpense().finally(() => setIsLoading(false));
    }
  }, [userData?.company_id]);

  // Calculations
  const calculateMachineProfit = (machineId, logs) => {
    return logs
      .filter(log => Number(log.machine_id) === Number(machineId))
      .reduce((sum, log) => {
        const start = parseFloat(log.start_reading) || 0;
        const end = parseFloat(log.end_reading) || 0;
        const price = parseFloat(log.price_per_hour) || 0;
        return sum + ((end > start && price > 0) ? (end - start) * price : 0);
      }, 0);
  };

  const calculateMachineExpense = (machineId, expenses) => {
    return expenses
      .filter(expense => {
        const matchesMachine = Number(expense.machine_id) === Number(machineId);
        const category = String(expense.expense_type?.expense_category || '').toLowerCase();
        const nameText = String(expense.expense_type?.name || '').toLowerCase();
        const isMachineCategory = category.includes('machine') || nameText.includes('machine');
        return matchesMachine && isMachineCategory;
      })
      .reduce((sum, expense) => sum + (parseFloat(expense.total_price) || 0), 0);
  };

  const calculateNet = (machineId, logs, expenses) => {
    const profit = calculateMachineProfit(machineId, logs);
    const expense = calculateMachineExpense(machineId, expenses);
    return profit - expense;
  };

  // Navigation
  const handleProfits = (machineId) => navigate(`/machineprofits/${machineId}`);
  const handleLoss = (machineId) => navigate(`/machineloss/${machineId}`);

  // Responsive
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Debounced Search
  const debouncedSearch = useCallback((value) => {
    const timer = setTimeout(() => setSearchTerm(value), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  // Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Formatting
  const formatIndianNumber = (amount) => {
    const numeric = parseFloat(amount) || 0;
    if (isNaN(numeric)) return '0.00';
    const [int, dec = '00'] = numeric.toFixed(2).split('.');
    const lastThree = int.slice(-3);
    const others = int.slice(0, -3);
    const formattedInt = others ? others.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree : lastThree;
    return `${formattedInt}.${dec}`;
  };

  const formatCurrency = (amount) => `INR ${formatIndianNumber(amount)}`;

  // Filtered & Sorted Machines
  const filteredMachines = useMemo(() => {
    let list = machines.map((m, idx) => ({
      ...m,
      sr_no: idx + 1,
      profit: calculateMachineProfit(m.id, machineLogs),
      expense: calculateMachineExpense(m.id, expenses1),
      net: calculateNet(m.id, machineLogs, expenses1),
    }));

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(m =>
        m.machine_name?.toLowerCase().includes(term) ||
        m.register_number?.toLowerCase().includes(term) ||
        m.profit.toString().includes(searchTerm) ||
        m.expense.toString().includes(searchTerm) ||
        m.net.toString().includes(searchTerm)
      );
    }

    // Sort
    if (sortConfig.key) {
      list = [...list].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        return (aVal < bVal ? -1 : 1) * (sortConfig.direction === 'asc' ? 1 : -1);
      });
    }

    return list;
  }, [machines, machineLogs, expenses1, searchTerm, sortConfig]);

  const summaryTotals = useMemo(() => {
    return filteredMachines.reduce(
      (acc, machine) => {
        acc.machineCount += 1;
        acc.totalProfit += Number(machine.profit) || 0;
        acc.totalExpense += Number(machine.expense) || 0;
        acc.totalNet += Number(machine.net) || 0;
        return acc;
      },
      { machineCount: 0, totalProfit: 0, totalExpense: 0, totalNet: 0 }
    );
  }, [filteredMachines]);

  // Export to Excel
  const exportToExcel = () => {
    const data = filteredMachines.map(m => ({
      'Sr No': m.sr_no,
      'Machine Name': m.machine_name || '-',
      'Registration Number': m.register_number || '-',
      'Profit': m.profit,
      'Expense': m.expense,
      'Net': m.net,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Machine Report');
    XLSX.writeFile(wb, `Machine_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
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

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(22, 160, 133);
    doc.text('Machine Expense Report', margin, 50);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    const companyName = userData?.company_name || 'Your Company';
    const today = new Date().toLocaleDateString('en-GB');
    doc.text(`${companyName} • Generated on ${today}`, margin, 70);

    const headers = [
      ['Sr No', 'Machine Name', 'Reg No', 'Earning (Rs.)', 'Expense (Rs.)', 'Net (Rs.)'],
    ];

    const rows = filteredMachines.map(m => [
      m.sr_no.toString(),
      m.machine_name || '-',
      m.register_number || '-',
      formatIndianNumber(m.profit),
      formatIndianNumber(m.expense),
      formatIndianNumber(m.net),
    ]);

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 100,
      theme: 'striped',
      border: { lineWidth: 0.5, color: 200 },
      styles: {
        fontSize: 9,
        cellPadding: 6,
        overflow: 'linebreak',
        halign: 'center',
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: usableWidth * 0.08 },
        1: { cellWidth: usableWidth * 0.28 },
        2: { cellWidth: usableWidth * 0.16 },
        3: { cellWidth: usableWidth * 0.16 },
        4: { cellWidth: usableWidth * 0.16 },
        5: { cellWidth: usableWidth * 0.16 },
      },

      didDrawPage: data => {
        const finalY = data.cursor.y + 20;
        const totalProfit = filteredMachines.reduce((s, m) => s + m.profit, 0);
        const totalExpense = filteredMachines.reduce((s, m) => s + m.expense, 0);
        const totalNet = filteredMachines.reduce((s, m) => s + m.net, 0);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(34, 34, 34);

        const colWidth = usableWidth / 6;
        doc.text('TOTAL', margin + colWidth * 2, finalY);
        doc.text(formatIndianNumber(totalProfit), margin + colWidth * 3, finalY, { align: 'center' });
        doc.text(formatIndianNumber(totalExpense), margin + colWidth * 4, finalY, { align: 'center' });
        doc.text(
          formatIndianNumber(totalNet),
          margin + colWidth * 5,
          finalY,
          { align: 'center' }
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

    const fileName = `Machine_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    showToast('success', 'PDF downloaded successfully!');
  };

  // Mobile Card – fully functional
  const renderMobileCard = (machine) => (
    <CCard key={machine.id} className="mb-3 expense-card" style={mobileCardStyle}>
      <CCardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1em' }}>
              {machine.machine_name || 'N/A'}
            </div>
            <div style={{ color: '#666', fontSize: '0.8em' }}>
              {machine.register_number || '-'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontWeight: 600,
                color: machine.net >= 0 ? '#28a745' : '#dc3545',
              }}
            >
              {formatCurrency(machine.net)}
            </div>
            <div style={{ fontSize: '0.7em', color: '#666' }}>Net</div>
          </div>
        </div>

        <div style={{ marginBottom: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
          <span style={{ color: '#28a745' }}>
            Earning: {formatCurrency(machine.profit)}
          </span>
        </div>

        <div style={{ marginBottom: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
          <span style={{ color: '#dc3545' }}>
            Expense: {formatCurrency(machine.expense)}
          </span>
        </div>

        <div
          style={{
            paddingTop: 8,
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
          }}
        >
          <CBadge
            color="success"
            role="button"
            style={{ cursor: 'pointer', fontSize: '0.75em', padding: '6px 8px' }}
            onClick={() => handleProfits(machine.id)}
          >
            View Earnings
          </CBadge>
          <CBadge
            color="danger"
            role="button"
            style={{ cursor: 'pointer', fontSize: '0.75em', padding: '6px 8px' }}
            onClick={() => handleLoss(machine.id)}
          >
            View Expenses
          </CBadge>
        </div>
      </CCardBody>
    </CCard>
  );

  const mobileCardStyle = {
    border: '1px solid #dee2e6',
    borderRadius: 8,
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CSpinner color="primary" size="lg" />
        <p style={{ marginTop: 12, color: '#6c757d' }}>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .table-container {
          height: 350px;
          overflow: auto;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
        }
        .expenses-table thead th {
          position: sticky;
          top: 0;
          background: #f8f9fa;
          z-index: 10;
        }
        .search-container { position: relative; }
        .search-input { padding-left: 40px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #6c757d; }
        .clear-search { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; }
        @media (max-width: 768px) { .expenses-table { display: none; } }
        .expense-card .badge {
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong className='fs-5'>Machine Expense Report</strong>
              <span className="ms-2 text-muted">
                {t("LABELS.total") || "Total"} {machines.length} machines
              </span>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3 align-items-center">
                <CCol xs={12} md={6}>
                  <div className="search-container">
                    <CFormInput
                      type="text"
                      className="search-input"
                      placeholder="Search machines..."
                      value={searchInput}
                      onChange={handleSearchChange}
                    />
                    {searchInput && (
                      <button className="clear-search" onClick={clearSearch} title="Clear">X</button>
                    )}
                  </div>
                </CCol>
                <CCol xs={12} md={6} className="mt-2 mt-md-0 text-md-end">
                  <CButton color="success" size="sm" className="me-2" onClick={exportToExcel}>
                    Export Excel
                  </CButton>
                  <CButton color="danger" size="sm" onClick={exportToPDF}>
                    Export PDF
                  </CButton>
                </CCol>
              </CRow>

              {searchTerm && (
                <CCol xs={12} className="mb-2">
                  <small className="text-muted">
                    {filteredMachines.length} machine(s) found for "{searchTerm}"
                  </small>
                </CCol>
              )}

              <CRow className="g-2 mb-3">
                <CCol xs={6} md={3}>
                  <div className="rounded p-2 text-center bg-primary text-white shadow-sm">
                    <small className="d-block">Machines</small>
                    <strong className="fs-6">{summaryTotals.machineCount}</strong>
                  </div>
                </CCol>
                <CCol xs={6} md={3}>
                  <div className="rounded p-2 text-center bg-success text-white shadow-sm">
                    <small className="d-block">Total Earning</small>
                    <strong className="fs-6">{formatIndianNumber(summaryTotals.totalProfit)}</strong>
                  </div>
                </CCol>
                <CCol xs={6} md={3}>
                  <div className="rounded p-2 text-center bg-warning text-black shadow-sm">
                    <small className="d-block">Total Expense</small>
                    <strong className="fs-6">{formatIndianNumber(summaryTotals.totalExpense)}</strong>
                  </div>
                </CCol>
                <CCol xs={6} md={3}>
                  <div
                    className={`rounded p-2 text-center shadow-sm ${summaryTotals.totalNet >= 0 ? 'bg-info text-white' : 'bg-warning text-dark'}`}
                  >
                    <small className="d-block">Net</small>
                    <strong className="fs-6">
                      {summaryTotals.totalNet >= 0 ? '' : '-'}
                      {formatIndianNumber(Math.abs(summaryTotals.totalNet))}
                    </strong>
                  </div>
                </CCol>
              </CRow>

              {isMobile ? (
                <div>
                  {filteredMachines.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      {searchTerm ? (
                        <>
                          <p>No machines found for "{searchTerm}"</p>
                          <CButton color="primary" onClick={clearSearch} size="sm">
                            Clear Search
                          </CButton>
                        </>
                      ) : (
                        <p>No machine data available.</p>
                      )}
                    </div>
                  ) : (
                    filteredMachines.map(renderMobileCard)
                  )}
                </div>
              ) : (
                <div className="table-container">
                  <CTable hover striped bordered className="mb-0 expenses-table">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell className="text-center" >
                          Sr. No.
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" >
                          Machine Name 
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center">
                          Reg No 
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center">
                          Earning
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center">
                          Expense 
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center">
                          Net 
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredMachines.length === 0 ? (
                        <CTableRow>
                          <CTableDataCell colSpan={7} className="text-center py-4 text-muted">
                            {searchTerm ? (
                              <>
                                <p>No machines found for "{searchTerm}"</p>
                                <CButton color="primary" onClick={clearSearch} size="sm">Clear Search</CButton>
                              </>
                            ) : (
                              <p>No machine data available.</p>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        <>
                          {filteredMachines.map((m) => (
                           <CTableRow key={m.id}>
  <CTableDataCell>{m.sr_no}</CTableDataCell>
  <CTableDataCell>{m.machine_name || '-'}</CTableDataCell>
  <CTableDataCell>{m.register_number || '-'}</CTableDataCell>

  <CTableDataCell className="text-end">
    <span style={{ color: '#28a745' }}>{formatIndianNumber(m.profit)}</span>
  </CTableDataCell>

  <CTableDataCell className="text-end">
    <span style={{ color: '#dc3545' }}>{formatIndianNumber(m.expense)}</span>
  </CTableDataCell>

  <CTableDataCell className="text-end">
    <span
      style={{
        fontWeight: 500,
        color: m.net >= 0 ? '#28a745' : '#dc3545',
      }}
    >
      {formatIndianNumber(Math.abs(m.net))}
    </span>
  </CTableDataCell>

  <CTableDataCell className="text-center">
    <div className="d-flex justify-content-center gap-2">
      <CBadge
        color="success"
        role="button"
        style={{ cursor: 'pointer', fontSize: '0.75em', padding: '6px 8px' }}
        onClick={() => handleProfits(m.id)}
      >
        View Earnings
      </CBadge>
      <CBadge
        color="danger"
        role="button"
        style={{ cursor: 'pointer', fontSize: '0.75em', padding: '6px 8px' }}
        onClick={() => handleLoss(m.id)}
      >
        View Expenses
      </CBadge>
    </div>
  </CTableDataCell>
</CTableRow>

                          ))}
                          {/* <CTableRow>
                            <CTableHeaderCell colSpan={3} className="text-end">{t("LABELS.total") || "Total"}</CTableHeaderCell>
                            <CTableHeaderCell className="text-end">
                              <span style={{ fontWeight: 500, color: '#28a745' }}>
                                {formatIndianNumber(filteredMachines.reduce((s, m) => s + m.profit, 0))}
                              </span>
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-end">
                              <span style={{ fontWeight: 500, color: '#dc3545' }}>
                                {formatIndianNumber(filteredMachines.reduce((s, m) => s + m.expense, 0))}
                              </span>
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-end">
                              <span style={{
                                fontWeight: 500,
                                color: filteredMachines.reduce((s, m) => s + m.net, 0) >= 0 ? '#28a745' : '#dc3545'
                              }}>
                                {formatIndianNumber(Math.abs(filteredMachines.reduce((s, m) => s + m.net, 0)))}
                              </span>
                            </CTableHeaderCell>
                            <CTableHeaderCell></CTableHeaderCell>
                          </CTableRow> */}
                        </>
                      )}
                    </CTableBody>
                  </CTable>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default MachineExpenses;