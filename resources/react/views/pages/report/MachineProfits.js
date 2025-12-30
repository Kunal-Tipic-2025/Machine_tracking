// MachineProfits.jsx
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
    CFormLabel
} from '@coreui/react';
import { getAPICall } from '../../../util/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../common/toast/ToastContext';
import { useTranslation } from 'react-i18next';
import { getUserData } from '../../../util/session';
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table in PDF

const MachineProfits = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { t } = useTranslation("global");
    const { machineid } = useParams();
    const userData = getUserData();

    const [machineLogs, setMachineLogs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [machineDetails, setMachineDetails] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchMachineLogs = async () => {
        try {
            setIsLoading(true);
            const response = await getAPICall(`/api/machineLog?company_id=${userData.company_id}`);
            const filteredLogs = response.filter(log => Number(log.machine_id) === Number(machineid));
            setMachineLogs(filteredLogs);
        } catch (error) {
            showToast('danger', 'Error fetching machine logs: ' + error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMachineDetails = async () => {
        try {
            const response = await getAPICall(`/api/machineries1`);
            const machine = response.find(m => Number(m.id) === Number(machineid));
            setMachineDetails(machine);
        } catch (error) {
            showToast('danger', 'Error fetching machine details: ' + error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await getAPICall("/api/myProjects");
            setProjects(Array.isArray(response) ? response : []);
            console.log("response");
            console.log(response);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [])


    useEffect(() => {
        if (userData?.company_id && machineid) {
            fetchMachineLogs();
            fetchMachineDetails();
        }
    }, [machineid]);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
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

    const formatCurrency = (amount) => {
        const numericAmount = parseFloat(amount) || 0;
        const [integerPart, decimalPart = '00'] = numericAmount.toFixed(2).split('.');
        const lastThree = integerPart.slice(-3);
        const otherNumbers = integerPart.slice(0, -3);
        const formattedInteger = otherNumbers.length > 0 ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree : lastThree;
        return `INR ${formattedInteger}.${decimalPart}`;
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', options).replace(',', '');
        const [month, day] = formattedDate.split(' ');
        return `${day} ${month}`;
    };

    const sortedFilteredLogs = useMemo(() => {
        let filtered = machineLogs.map((log, index) => ({
            ...log,
            sr_no: index + 1,
            hours: (parseFloat(log.end_reading) || 0) - (parseFloat(log.start_reading) || 0),
            earnings: ((parseFloat(log.end_reading) || 0) - (parseFloat(log.start_reading) || 0)) * (parseFloat(log.price_per_hour) || 0),
        }));

        if (startDate) {
            filtered = filtered.filter(log => log.work_date >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(log => log.work_date <= endDate);
        }

        if (!sortConfig.key) return filtered;

        return [...filtered].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [machineLogs, startDate, endDate, sortConfig]);

    const totalProfit = useMemo(() => {
        return sortedFilteredLogs.reduce((sum, log) => sum + log.earnings, 0);
    }, [sortedFilteredLogs]);

    const exportToExcel = () => {
        const worksheetData = sortedFilteredLogs.map((log) => ({
            'Sr No': log.sr_no,
            'Work Date': formatDate(log.work_date),
            'Customer Name': projects.find(p => p.id === Number(log.project_id))?.customer_name || '-',
            'Hours': log.hours || 0,
            'Price per Hour': formatCurrency(log.price_per_hour),
            'Earnings': formatCurrency(log.earnings),
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Machine Profits');
        XLSX.writeFile(workbook, `Machine_Profits_${machineid}_${new Date().toISOString().split('T')[0]}.xlsx`);
        showToast('success', 'Excel file downloaded successfully!');
    };

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

        // === HEADER ===
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(22, 160, 133);
        doc.text(
            `Machine Profits Report - ${machineDetails?.machine_name || 'Machine'}`,
            margin,
            50
        );

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        const companyName = userData?.company_name || 'Your Company';
        const today = new Date().toLocaleDateString('en-GB');
        doc.text(`${companyName} • Generated on ${today}`, margin, 70);

        // === TABLE DATA ===
        const headers = [
            ['Sr No', 'Work Date', 'Customer Name', 'Hours', 'Price / Hour (Rs.)', 'Earnings (Rs.)'],
        ];

        const rows = sortedFilteredLogs.map((log) => [
            log.sr_no?.toString() || '',
            formatDate(log.work_date),
            projects.find(p => p.id === Number(log.project_id))?.customer_name || '-',
            log.hours?.toString() || '0',
            formatCurrency(log.price_per_hour),
            formatCurrency(log.earnings),
        ]);

        // === TABLE STYLE ===
        doc.autoTable({
            head: headers,
            body: rows,
            startY: 100,
            theme: 'striped',
            styles: {
                fontSize: 9,
                cellPadding: 6,
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
            columnStyles: {
                0: { cellWidth: usableWidth * 0.08 }, // Sr No
                1: { cellWidth: usableWidth * 0.20 }, // Work Date
                2: { cellWidth: usableWidth * 0.20 }, // Customer Name
                3: { cellWidth: usableWidth * 0.12 }, // Hours
                4: { cellWidth: usableWidth * 0.20 }, // Price per Hour
                5: { cellWidth: usableWidth * 0.20 }, // Earnings
            },

            // === FOOTER + TOTAL ===
            didDrawPage: (data) => {
                const finalY = data.cursor.y + 25;

                // Totals Row
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(34, 34, 34);

                const colWidth = usableWidth / 6;
                doc.text('TOTAL', margin + colWidth * 4, finalY);
                doc.text(
                    formatCurrency(totalProfit),
                    margin + colWidth * 5,
                    finalY,
                    { align: 'center' }
                );

                // Footer - Page Number
                doc.setFontSize(9);
                doc.setTextColor(150);
                doc.text(
                    `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
                    pageWidth - margin - 50,
                    pageHeight - 20
                );
            },
        });

        // === SAVE FILE ===
        const fileName = `Machine_Profits_${machineid}_${new Date()
            .toISOString()
            .split('T')[0]}.pdf`;
        doc.save(fileName);
        showToast('success', 'PDF downloaded successfully!');
    };


    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <CSpinner color="primary" size="lg" />
                    <p className="mt-3 text-muted">Loading machine profits...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style jsx global>{`
        // Similar styles as in MachineExpenses.jsx, adapted for this component
        .table-container { height: 350px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 0.375rem; }
        // ... (copy relevant styles)
      `}</style>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 gap-md-3 pb-3 border-bottom border-md-0">
                            {/* Back Button – stays on the left on all screens */}
                            <CButton
                                color="secondary"
                                size="sm"
                                onClick={() => navigate(-1)}
                                className="align-self-start align-self-md-center"
                            >
                                Back
                            </CButton>

                            {/* Title – centered on mobile, left-aligned on desktop */}
                            <div className="flex-grow-1 text-center text-md-start">
                                <strong className="fs-5">
                                    {`Machine : ${machineDetails?.machine_name || 'Machine'}`}
                                </strong>
                            </div>

                            {/* Export Buttons + Total – right side on desktop, stacked below on mobile */}
                            <div className="d-flex flex-column flex-md-row align-items-center gap-2 text-center text-md-end">
                                <div className="d-flex gap-2 order-2 order-md-1">
                                    <CButton color="success" size="sm" onClick={exportToExcel}>
                                        Export Excel
                                    </CButton>
                                    <CButton color="danger" size="sm" onClick={exportToPDF}>
                                        Export PDF
                                    </CButton>
                                </div>

                                <div className="order-1 order-md-2 mt-1 mt-md-0">
                                    <strong>Total Earnings: </strong>
                                    <CBadge color="success" className="ms-1">
                                        {formatCurrency(totalProfit)}
                                    </CBadge>
                                </div>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CRow className="mb-2 align-items-center gap-5">
                                <CCol xs={12} md={3}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className="mb-0 flex-shrink-0" style={{ width: '90px' }}>
                                            Start Date :
                                        </CFormLabel>
                                        <CFormInput
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </CCol>

                                <CCol xs={12} md={3}>
                                    <div className="d-flex align-items-center">
                                        <CFormLabel className=" mb-0 flex-shrink-0" style={{ width: '90px' }}>
                                            End Date :
                                        </CFormLabel>
                                        <CFormInput
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </CCol>
                            </CRow>


                            <div className="table-container" style={{
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
                                            <CTableHeaderCell className="text-center align-middle" >Sr No <span style={getSortIconStyle('sr_no')}></span></CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle" >Work Date <span style={getSortIconStyle('work_date')}></span></CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle" >Customer Name<span style={getSortIconStyle('project_id')}></span></CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle" >Hours <span style={getSortIconStyle('hours')}></span></CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle" >Price/Hour <span style={getSortIconStyle('price_per_hour')}></span></CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle">Earnings <span style={getSortIconStyle('earnings')}></span></CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {sortedFilteredLogs.map((log) => (
                                            <CTableRow key={log.id}>
                                                <CTableDataCell>{log.sr_no}</CTableDataCell>
                                                <CTableDataCell>{formatDate(log.work_date)}</CTableDataCell>
                                                <CTableDataCell>{
                                                    projects.find(p => p.id === Number(log.project_id))?.customer_name || '-'
                                                }</CTableDataCell>
                                                <CTableDataCell>{log.hours || 0}</CTableDataCell>
                                                <CTableDataCell>{formatCurrency(log.price_per_hour)}</CTableDataCell>
                                                <CTableDataCell>{formatCurrency(log.earnings)}</CTableDataCell>
                                            </CTableRow>
                                        ))}
                                        <CTableRow>
                                            <CTableHeaderCell colSpan={5} className='text-end'>Total</CTableHeaderCell>
                                            <CTableHeaderCell>{formatCurrency(totalProfit)}</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    );
};

export default MachineProfits;