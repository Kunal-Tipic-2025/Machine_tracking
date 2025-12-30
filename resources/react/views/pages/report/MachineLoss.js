// Updated MachineLoss.jsx
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

const MachineLoss = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { t } = useTranslation("global");
    const { machineid } = useParams();
    const userData = useMemo(() => getUserData(), []);

    const [expenses, setExpenses] = useState([]);
    const [expenseTypes, setExpenseTypes] = useState({});
    const [machineDetails, setMachineDetails] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchExpenses = async () => {
        const response = await getAPICall(`/api/expense1?company_id=${userData.company_id}`);
        const allExpenses = response[0] || [];
        const filteredExpenses = allExpenses.filter(exp =>
            Number(exp.machine_id) === Number(machineid)
        );
        setExpenses(filteredExpenses);
    };

    const fetchExpenseTypes = async () => {
        const response = await getAPICall('/api/expenseType');
        const result = response.reduce((acc, current) => {
            acc[current.id] = current.name;
            return acc;
        }, {});
        setExpenseTypes(result);
    };

    const fetchMachineDetails = async () => {
        const response = await getAPICall(`/api/machineries1`);
        const machine = response.find(m => Number(m.id) === Number(machineid));
        setMachineDetails(machine);
    };

    useEffect(() => {
        const loadData = async () => {
            if (!userData?.company_id || !machineid) {
                showToast('danger', 'Missing company ID or machine ID');
                setIsLoading(false);
                return;
            }
            try {
                await Promise.all([fetchExpenses(), fetchExpenseTypes(), fetchMachineDetails()]);
            } catch (error) {
                showToast('danger', 'Error loading data: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [machineid, userData]);

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

    const sortedFilteredExpenses = useMemo(() => {
        let filtered = expenses.map((exp, index) => ({
            ...exp,
            sr_no: index + 1,
        }));

        if (startDate) {
            filtered = filtered.filter(exp => exp.expense_date >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(exp => exp.expense_date <= endDate);
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
    }, [expenses, startDate, endDate, sortConfig]);

    const totalExpense = useMemo(() => {
        return sortedFilteredExpenses.reduce((sum, exp) => sum + (parseFloat(exp.total_price) || 0), 0);
    }, [sortedFilteredExpenses]);

    const exportToExcel = () => {
        const worksheetData = sortedFilteredExpenses.map((exp) => ({
            'Sr No': exp.sr_no,
            'Date': formatDate(exp.expense_date),
            'Expense Type': expenseTypes[exp.expense_id] || '-',
            'Description': exp.desc || '-',
            'Contact': exp.contact || '-',
            'Amount': formatCurrency(exp.total_price),
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Machine Expenses');
        XLSX.writeFile(workbook, `Machine_Expenses_${machineid}_${new Date().toISOString().split('T')[0]}.xlsx`);
        showToast('success', 'Excel file downloaded successfully!');
    };

    const exportToPDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        const tableColumn = ['Sr No', 'Date', 'Expense Type', 'Description', 'Contact', 'Amount'];
        const tableRows = sortedFilteredExpenses.map((exp) => [
            exp.sr_no,
            formatDate(exp.expense_date),
            expenseTypes[exp.expense_id] || '-',
            exp.desc || '-',
            exp.contact || '-',
            formatCurrency(exp.total_price),
        ]);

        doc.setFontSize(14);
        doc.text(`Machine Expenses Report - ${machineDetails?.machine_name || 'Machine'}`, 40, 40);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 60,
            theme: 'striped',
            styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak', valign: 'middle' },
            headStyles: { fillColor: [22, 160, 133], textColor: 255 },
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 100 },
                2: { cellWidth: 120 },
                3: { cellWidth: 150 },
                4: { cellWidth: 100 },
                5: { cellWidth: 100 },
            },
            didDrawPage: (data) => {
                const pageHeight = doc.internal.pageSize.getHeight();
                doc.setFontSize(12);
                doc.text(`Total Expense: ${formatCurrency(totalExpense)}`, 40, pageHeight - 20);
            },
        });

        doc.save(`Machine_Expenses_${machineid}_${new Date().toISOString().split('T')[0]}.pdf`);
        showToast('success', 'PDF file downloaded successfully!');
    };


    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <CSpinner color="primary" size="lg" />
                    <p className="mt-3 text-muted">Loading machine expenses...</p>
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
                    <CCard className="mb-4 text-center">
                        <CCardHeader>
                            <strong className='fs-5'>{`Expenses for ${machineDetails?.machine_name || 'Machine'} `}</strong>
                            <CButton color="secondary" onClick={() => navigate(-1)} className="float-start mt-2">Back</CButton>
                            <div>
                                <strong>Total Expense: </strong>
                                <CBadge color="danger">
                                    {`${formatCurrency(totalExpense)}`}
                                </CBadge>
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
                                            <CTableHeaderCell className="text-center align-middle" >Date <span style={getSortIconStyle('expense_date')}></span></CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle" >Type <span style={getSortIconStyle('expense_id')}></span></CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle" >Description <span style={getSortIconStyle('desc')}></span></CTableHeaderCell>
                                            <CTableHeaderCell className="text-center align-middle" >Amount <span style={getSortIconStyle('total_price')}></span></CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {sortedFilteredExpenses.length === 0 ? (
                                            <CTableRow>
                                                <CTableDataCell colSpan={6} className="text-center py-4">
                                                    No expenses found for this machine.
                                                </CTableDataCell>
                                            </CTableRow>
                                        ) : (
                                            sortedFilteredExpenses.map((exp) => (
                                                <CTableRow key={exp.id}>
                                                    <CTableDataCell>{exp.sr_no}</CTableDataCell>
                                                    <CTableDataCell>{formatDate(exp.expense_date)}</CTableDataCell>
                                                    <CTableDataCell>{expenseTypes[exp.expense_id] || '-'}</CTableDataCell>
                                                    <CTableDataCell>{exp.desc || '-'}</CTableDataCell>
                                                    <CTableDataCell>{formatCurrency(exp.total_price)}</CTableDataCell>
                                                </CTableRow>
                                            ))
                                        )}
                                        <CTableRow>
                                            <CTableHeaderCell colSpan={4} className='text-end'>Total</CTableHeaderCell>
                                            <CTableHeaderCell>{formatCurrency(totalExpense)}</CTableHeaderCell>
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

export default MachineLoss;