import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  CBadge, CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow,
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
  CSpinner, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CFormSelect, CInputGroup, CInputGroupText, CTooltip
} from '@coreui/react';
import { useToast } from '../../common/toast/ToastContext';
import { getAPICall, deleteAPICall } from '../../../util/api';
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table in PDF


const MachineLogReport = () => {
  const { showToast } = useToast();

  const [logs, setLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [operators, setOperators] = useState([]);
  const [machineries, setMachineries] = useState([]);
  const [prices, setPrices] = useState([]); // ✅ FIXED: Consistent naming (was setPrice)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('');
  const [deleteResource, setDeleteResource] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  // Fetch Machine Logs
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await getAPICall('/api/machineLog');
      setLogs(response || []);
    } catch (error) {
      showToast('danger', 'Error fetching machine logs: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects
  const fetchProjects = useCallback(async (query = '') => {
    try {
      const response = await getAPICall(`/api/projects?searchQuery=${query}`);
      if (Array.isArray(response)) {
        const mapped = response.map((proj) => ({
          id: proj.id,
          name: proj.customer_name,
        }));
        setProjects(mapped);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  }, []);

  // Fetch operators
  useEffect(() => {
    getAPICall('/api/operatorsByType')
      .then((response) => {
        const options = response.map((op) => ({
          value: op.id.toString(),
          label: op.name,
        }));
        setOperators(options);
      })
      .catch((error) => {
        console.error('Error fetching operators:', error);
      });
  }, []);

  // Fetch machineries
  useEffect(() => {
    const fetchMachineries = async () => {
      try {
        const res = await getAPICall('/api/machine-operators');
        if (Array.isArray(res)) {
          const mapped = res.map((machine) => ({
            id: machine.id,
            name: machine.machine_name,
          }));
          setMachineries(mapped);
        }
      } catch (err) {
        console.error('Error fetching machineries:', err);
      }
    }
    fetchMachineries();
  }, []);

  // Fetch prices (machine prices for mode matching)
  const fetchMachineprice = async () => {
    try {
      const response = await getAPICall('/api/machine-price');
      console.log("prices");
      console.log(response)
      setPrices(response) // ✅ FIXED: Use setPrices consistently
    } catch (error) {
      console.error('Error fetching machine prices:', error)
      showToast('danger', 'Error fetching machine prices')
    }
  }

  // On mount, fetch logs + projects
  useEffect(() => {
    fetchLogs();
    fetchProjects();
    fetchMachineprice(); // ✅ FIXED: Consistent naming
  }, [fetchProjects]);

  // Helper: Get Project Name
  const getProjectName = (id) => {
    console.log(projects);
    const project = projects.find((p) => p.id == id);
    console.log("projets");
    console.log(project)
    return project ? project.name : id;
  };

  // Helper: Get Operator Name
  const getOperatorName = (id) => {
    const operator = operators.find((op) => op.value === id?.toString());
    return operator ? operator.label : id;
  };

  // Helper: Get Machine Name
  const getMachineName = (id) => {
    const machine = machineries.find((m) => m.id == id);
    return machine ? machine.name : id;
  };

  // Enhanced search and filter
  const filteredLogs = useMemo(() => {
    let filtered = logs.map((log, index) => ({ ...log, sr_no: index + 1 }));

    // Apply project filter
    if (selectedProject) {
      filtered = filtered.filter((log) => log.project_id?.toString() === selectedProject);
    }

    // Apply operator filter
    if (selectedOperator) {
      filtered = filtered.filter((log) => log.operator_id?.toString() === selectedOperator);
    }

    // Apply machine filter
    if (selectedMachine) {
      filtered = filtered.filter((log) => log.machine_id?.toString() === selectedMachine);
    }

    // Apply search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          getProjectName(log.project_id).toLowerCase().includes(searchLower) ||
          getMachineName(log.machine_id).toLowerCase().includes(searchLower) ||
          getOperatorName(log.operator_id).toLowerCase().includes(searchLower) ||
          log.work_date?.toLowerCase().includes(searchLower) ||
          log.start_reading?.toString().includes(searchLower) ||
          log.end_reading?.toString().includes(searchLower)
      );
    }
    return filtered;
  }, [logs, searchTerm, selectedProject, selectedOperator, selectedMachine, projects, operators, machineries]);

  // Sort logs globally by date (descending) before pagination
  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => new Date(b.work_date) - new Date(a.work_date));
  }, [filteredLogs]);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(sortedLogs.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedLogs = useMemo(() => {
    return sortedLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedLogs, startIndex]);

  // Clear all filters
  const clearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setSelectedProject('');
    setSelectedOperator('');
    setSelectedMachine('');
    setCurrentPage(1);
  };

  // Delete handler
  const handleDelete = async () => {
    try {
      await deleteAPICall('/api/machineLog/' + deleteResource.id);
      setDeleteModalVisible(false);
      fetchLogs();
      showToast('success', 'Machine log deleted successfully');
    } catch (error) {
      showToast('danger', 'Error deleting machine log: ' + error);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // ──────────────────────────────────────────────────────────────────────────────
  // Export to PDF – Full Width, Professional Layout, Totals
  // ──────────────────────────────────────────────────────────────────────────────
  const exportToPDF = () => {
    // const { jsPDF } = require('jspdf');
    // require('jspdf-autotable');

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const usableWidth = pageWidth - 2 * margin;

    // ────── Header ──────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(22, 160, 133);
    doc.text('Work Logs Report', margin, 50);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString('en-GB');
    const companyName = 'Your Company'; // Replace with dynamic if available
    doc.text(`${companyName} • Generated on ${today}`, margin, 70);

    // ────── Table Data ──────
    const headers = [
      ['Sr', 'Date', 'Customer', 'Machine', 'Operator', 'Start', 'End', 'Net Hrs', 'Mode', 'Rate/Hr', 'Total'],
    ];

    const rows = filteredLogs
      .sort((a, b) => new Date(b.work_date) - new Date(a.work_date))
      .map((log, index) => {
        const matchedPrice = prices.find(p => p.id === Number(log.mode_id));
        const modeName = matchedPrice ? matchedPrice.mode : 'N/A';
        const pricePerHour = Number(log.price_per_hour) || 0;
        const totalHours = log.end_reading && log.start_reading
          ? Number(log.end_reading) - Number(log.start_reading)
          : 0;
        const totalPrice = totalHours * pricePerHour;

        return [
          (index + 1).toString(),
          formatDate(log.work_date),
          getProjectName(log.project_id),
          getMachineName(log.machine_id),
          getOperatorName(log.operator_id),
          log.start_reading || '-',
          log.end_reading || '-',
          totalHours.toFixed(2),
          modeName,
          `Rs.${pricePerHour.toFixed(2)}`,
          `Rs.${totalPrice.toFixed(2)}`,
        ];
      });

    // ────── Calculate Totals ──────
    const totalHoursAll = filteredLogs.reduce((sum, log) => {
      const hours = log.end_reading && log.start_reading
        ? Number(log.end_reading) - Number(log.start_reading)
        : 0;
      return sum + hours;
    }, 0);

    const totalAmountAll = filteredLogs.reduce((sum, log) => {
      const matchedPrice = prices.find(p => p.id === Number(log.mode_id));
      const pricePerHour = Number(log.price_per_hour) || 0;
      const hours = log.end_reading && log.start_reading
        ? Number(log.end_reading) - Number(log.start_reading)
        : 0;
      return sum + (hours * pricePerHour);
    }, 0);

    // ────── AutoTable ──────
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 100,
      theme: 'striped',
      styles: {
        fontSize: 8,
        cellPadding: 4,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: usableWidth * 0.05 },   // Sr
        1: { cellWidth: usableWidth * 0.08 },   // Date
        2: { cellWidth: usableWidth * 0.14 },   // Customer
        3: { cellWidth: usableWidth * 0.12 },   // Machine
        4: { cellWidth: usableWidth * 0.12 },   // Operator
        5: { cellWidth: usableWidth * 0.07 },   // Start
        6: { cellWidth: usableWidth * 0.07 },   // End
        7: { cellWidth: usableWidth * 0.07 },   // Net Hrs
        8: { cellWidth: usableWidth * 0.08 },   // Mode
        9: { cellWidth: usableWidth * 0.08 },   // ₹/Hr
        10: { cellWidth: usableWidth * 0.10 },  // Total ₹
      },
      foot: [
        [
          { content: 'TOTAL', colSpan: 7, styles: { halign: 'right', fontStyle: 'bold' } },
          totalHoursAll.toFixed(2),
          '',
          '',
          `Rs.${totalAmountAll.toFixed(2)}`,
        ],
      ],
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 9,
      },
      didDrawPage: (data) => {
        // Page number
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth - margin - 80, pageHeight - 20);
      },
    });

    // ────── Save ──────
    const fileName = `Work_Logs_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    showToast('success', 'PDF downloaded successfully!');
  };

  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" size="lg" />
        <p className="mt-3 text-muted">Loading machine logs...</p>
      </div>
    );
  }

  return (
    <CRow>
      {/* Image Modal – larger on mobile */}
      <CModal visible={showImageModal} onClose={() => setShowImageModal(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>View Image</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center p-4">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Machine Log"
              className="img-fluid rounded"
              style={{ maxHeight: '70vh', width: 'auto' }}
              onError={(e) => {
                e.target.onerror = null;
                showToast('danger', 'Image could not be loaded.');
              }}
            />
          ) : (
            <p className="text-muted">No image selected.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CCol xs={12}>
        <CCard className="shadow-sm">
          <CCardHeader className="bg-light d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <strong className="fs-5">Work Logs Report</strong>
              <CBadge color="info">{filteredLogs.length} records</CBadge>
            </div>
            <CButton
              color="warning"
              size="sm"
              onClick={exportToPDF}
              disabled={filteredLogs.length === 0}
              className="w-auto"
            >
              Download PDF
            </CButton>
          </CCardHeader>


          <CCardBody>
            {/* Filter Section – Stacked on mobile */}
            <CRow className="g-2 mb-3">
              <CCol xs={12} md={6} lg={3}>
                <CInputGroup size="sm">
                  <CInputGroupText>Search</CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder="Search all fields..."
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setSearchTerm(e.target.value);
                    }}
                  />
                </CInputGroup>
              </CCol>

              <CCol xs={12} md={6} lg={3}>
                <CFormSelect
                  size="sm"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">All Customers</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol xs={12} md={6} lg={3}>
                <CFormSelect
                  size="sm"
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                >
                  <option value="">All Operators</option>
                  {operators.map((operator) => (
                    <option key={operator.value} value={operator.value}>
                      {operator.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol xs={12} md={6} lg={3}>
                <CFormSelect
                  size="sm"
                  value={selectedMachine}
                  onChange={(e) => setSelectedMachine(e.target.value)}
                >
                  <option value="">All Machines</option>
                  {machineries.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {machine.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {/* Summary Stats */}
            {filteredLogs.length > 0 && (
              <CRow className="g-2 mb-2">
                {/* Total Logs */}
                <CCol xs={6} md={3}>
                  <div className="rounded p-2 text-center bg-primary text-white shadow-sm">
                    <small className="d-block">Total Logs</small>
                    <strong className="fs-6">{filteredLogs.length}</strong>
                  </div>
                </CCol>

                {/* Customers */}
                <CCol xs={6} md={3}>
                  <div className="rounded p-2 text-center bg-success text-white shadow-sm">
                    <small className="d-block">Customers</small>
                    <strong className="fs-6">
                      {new Set(filteredLogs.map(l => l.project_id)).size}
                    </strong>
                  </div>
                </CCol>

                {/* Operators */}
                <CCol xs={6} md={3}>
                  <div className="rounded p-2 text-center bg-warning text-dark shadow-sm">
                    <small className="d-block">Operators</small>
                    <strong className="fs-6">
                      {new Set(filteredLogs.map(l => l.operator_id)).size}
                    </strong>
                  </div>
                </CCol>

                {/* Machines */}
                <CCol xs={6} md={3}>
                  <div className="rounded p-2 text-center bg-info text-white shadow-sm">
                    <small className="d-block">Machines</small>
                    <strong className="fs-6">
                      {new Set(filteredLogs.map(l => l.machine_id)).size}
                    </strong>
                  </div>
                </CCol>
              </CRow>
            )}



            {/* Clear Filters */}
            {(searchTerm || selectedProject || selectedOperator || selectedMachine) && (
              <CRow className="mb-3">
                <CCol>
                  <CButton color="light" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </CButton>
                </CCol>
              </CRow>
            )}

            {/* Table – Responsive */}
            {/* Table – Responsive */}
            {/* Table – Fully Scrollable on Small Screens */}
            <div
              style={{
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                maxWidth: '100%',
              }}
            >
              <CTable
                hover
                striped
                bordered
                className="table-sm mb-0"
                style={{
                  minWidth: '1000px', // ensures table scrolls horizontally on small screens
                  whiteSpace: 'nowrap',
                }}
              >


                <CTableHead className="sticky-top bg-light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">Sr. No.</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Date</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Customer</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Machine</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Operator</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Start</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Start Photo</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">End</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">End Photo</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Net</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Mode</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">₹/Hr</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Total</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredLogs.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={12} className="text-center py-5">
                        <div className="text-muted">
                          <span style={{ fontSize: '3rem' }}>Empty</span>
                          <p className="mt-2 mb-0">No machine logs found</p>
                          <small>Try adjusting your filters</small>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    [...paginatedLogs]
                      .sort((a, b) => new Date(b.work_date) - new Date(a.work_date))
                      .map((log, index) => {
                        const matchedPrice = prices.find(p => p.id === Number(log.mode_id));
                        const modeName = matchedPrice ? matchedPrice.mode : 'N/A';
                        const pricePerHour = log.price_per_hour;
                        const totalHours = log.end_reading && log.start_reading
                          ? Number(log.end_reading) - Number(log.start_reading)
                          : 0;
                        const totalPrice = totalHours * pricePerHour;

                        const srNo = startIndex + index + 1;
                        return (
                          <CTableRow key={log.id}>
                            <CTableDataCell className="text-start fw-bold small">
                              {srNo}
                            </CTableDataCell>
                            <CTableDataCell className="small">
                              <CBadge color="secondary" className="p-1 small">
                                {formatDate(log.work_date)}
                              </CBadge>
                            </CTableDataCell>
                            <CTableDataCell className="text-start small text-truncate" style={{ maxWidth: '120px' }}>
                              {getProjectName(log.project_id)}
                            </CTableDataCell>

                            {/* Hidden on mobile */}
                            <CTableDataCell className="small text-truncate" style={{ maxWidth: '100px' }}>
                              {getMachineName(log.machine_id)}
                            </CTableDataCell>
                            <CTableDataCell className="small text-truncate" style={{ maxWidth: '100px' }}>
                              {getOperatorName(log.operator_id)}
                            </CTableDataCell>

                            <CTableDataCell className="text-start small">{log.start_reading || '-'}</CTableDataCell>

                            {/* Hidden on <lg */}
                            <CTableDataCell className="text-center">
                              {log.start_photo ? (
                                <CButton
                                  size="sm"
                                  color="info"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedImage(`/img/${log.start_photo}`);
                                    setShowImageModal(true);
                                  }}
                                >
                                  View
                                </CButton>
                              ) : (
                                <span className="text-muted small">-</span>
                              )}
                            </CTableDataCell>

                            <CTableDataCell className="text-start small">{log.end_reading || '-'}</CTableDataCell>

                            <CTableDataCell className="text-center">
                              {log.end_photo ? (
                                <CButton
                                  size="sm"
                                  color="info"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedImage(`/img/${log.end_photo}`);
                                    setShowImageModal(true);
                                  }}
                                >
                                  View
                                </CButton>
                              ) : (
                                <span className="text-muted small">-</span>
                              )}
                            </CTableDataCell>

                            <CTableDataCell className="text-end small">
                              {totalHours.toFixed(2)}
                            </CTableDataCell>

                            <CTableDataCell className="text-center">
                              <CBadge color="info" className="small">{modeName}</CBadge>
                            </CTableDataCell>

                            <CTableDataCell className="text-end small fw-bold">₹{pricePerHour}</CTableDataCell>

                            <CTableDataCell className="text-center">
                              <CBadge color="success" className="p-2 small">
                                ₹{totalPrice.toFixed(2)}
                              </CBadge>
                            </CTableDataCell>
                          </CTableRow>
                        );
                      })
                  )}
                </CTableBody>
              </CTable>
            </div>

            {filteredLogs.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                <small className="text-muted">
                  Showing {startIndex + 1}–{Math.min(startIndex + paginatedLogs.length, filteredLogs.length)} of {filteredLogs.length}
                </small>
                <div className="d-flex align-items-center gap-2">
                  <CButton
                    color="light"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  >
                    Previous
                  </CButton>
                  <span className="small text-muted">
                    Page {currentPage} of {totalPages}
                  </span>
                  <CButton
                    color="light"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  >
                    Next
                  </CButton>
                </div>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default MachineLogReport;