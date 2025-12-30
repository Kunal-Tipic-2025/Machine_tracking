import { CButton, CFormSelect, CTabs, CTabList, CTabPanel, CTabContent, CTab, CFormInput } from '@coreui/react';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Year, Custom, Months, Quarter, Week } from './Dates';
import { getAPICall } from '../../../util/api';
import All_Tables from './AllTables';
import { Button, Dropdown } from '/resources/react/views/pages/report/ButtonDropdowns';
import { MantineProvider } from '@mantine/core';
import { useToast } from '../../common/toast/ToastContext';
import { useTranslation } from 'react-i18next';
import { CChartPie } from '@coreui/react-chartjs';

function All_Reports({ companyId }) {
  const { t } = useTranslation('global');
  const [selectedOption, setSelectedOption] = useState('3');
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]);
  const [stateCustom, setStateCustom] = useState({ start_date: '', end_date: '' });
  const [stateMonth, setStateMonth] = useState({ start_date: '', end_date: '' });
  const [stateQuarter, setStateQuarter] = useState({ start_date: '', end_date: '' });
  const [stateYear, setStateYear] = useState({ start_date: '', end_date: '' });
  const [activeTab1, setActiveTab1] = useState('Year');
  const [stateWeek, setStateWeek] = useState({ start_date: '', end_date: '' });
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [workLogCursor, setWorkLogCursor] = useState(null);
  const [expenseCursor, setExpenseCursor] = useState(null);
  const [productCursor, setProductCursor] = useState(null);
  const scrollPositionRef = useRef(0);
  const isInfiniteScrollingRef = useRef(false);

  const ReportOptions = [
    { label: t('LABELS.workReport') || 'Work Report', value: '1' },
    { label: t('LABELS.expenseReport') || 'Expense Report', value: '2' },
    { label: t('LABELS.profit_loss') || 'Profit and Loss', value: '3' },
    // { label: t('LABELS.earning_per_product') || 'Earning Per Product', value: '4' },
  ];

  const [workLogData, setWorkLogData] = useState({
    data: [],
    totalWorkAmount: 0
  });

  const [productWiseData, setProductWiseData] = useState([]);

  const [expenseData, setExpenseData] = useState({
    data: [],
    totalExpense: 0
  });
  const [expenseType, setExpenseType] = useState({});

  const [pnlData, setPnLData] = useState({
    Data: [],
    totalWork: 0,
    totalExpenses: 0,
    totalProfitLoss: 0
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getAPICall(`/api/projects${companyId ? `?companyId=${companyId}` : ''}`);
        console.log('Projects API Response:', response); // Debug log
        let projectList = Array.isArray(response) ? response : (Array.isArray(response.data) ? response.data : []);
        if (Array.isArray(projectList)) {
          setProjects(projectList.map(project => ({
            label: project.project_name,
            value: project.id
          })));
        } else {
          showToast('danger', t('MSG.failed_fetch_projects') || 'Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        showToast('danger', t('MSG.failed_fetch_projects') || 'Failed to fetch projects');
      }
    };
    fetchProjects();
  }, [companyId]);

  const handleTabChange = (value) => {
    setActiveTab1(value);
    setWorkLogData({ data: [], totalWorkAmount: 0 });
    setExpenseData({ data: [], totalExpense: 0 });
    setPnLData({ Data: [], totalWork: 0, totalExpenses: 0, totalProfitLoss: 0 });
    setProductWiseData([]);
    setCurrentPage(1);
    setHasMorePages(false);
    setNextCursor(null);
    setWorkLogCursor(null);
    setExpenseCursor(null);
    setProductCursor(null);
  };

  const handleProjectChange = (value) => {
    setSelectedProject(value);
    setWorkLogData({ data: [], totalWorkAmount: 0 });
    setExpenseData({ data: [], totalExpense: 0 });
    setPnLData({ Data: [], totalWork: 0, totalExpenses: 0, totalProfitLoss: 0 });
    setProductWiseData([]);
    setCurrentPage(1);
    setHasMorePages(false);
    setNextCursor(null);
    setWorkLogCursor(null);
    setExpenseCursor(null);
    setProductCursor(null);
  };

  const getTop3Products = () => {
    if (!Array.isArray(productWiseData) || productWiseData.length === 0) {
      return [];
    }
    const totalRevenue = productWiseData.reduce((acc, product) => acc + (Number(product.totalRevenue) || 0), 0);
    return productWiseData
      .sort((a, b) => (Number(b.totalRevenue) || 0) - (Number(a.totalRevenue) || 0))
      .slice(0, 3)
      .map(product => ({
        ...product,
        percentage: totalRevenue > 0 ? Math.round((Number(product.totalRevenue) / totalRevenue) * 100) : 0
      }));
  };

  const getPieChartData = () => {
    const top3 = getTop3Products();
    if (top3.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderWidth: 2
        }]
      };
    }
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
    return {
      labels: top3.map(product => product.product_name),
      datasets: [{
        data: top3.map(product => Number(product.totalRevenue) || 0),
        backgroundColor: colors.slice(0, top3.length),
        borderColor: '#fff',
        borderWidth: 2
      }]
    };
  };

  useEffect(() => {
    if (activeTab1 !== 'Custom') {
      let hasValidDates = false;
      switch (activeTab1) {
        case 'Year':
          hasValidDates = stateYear.start_date && stateYear.end_date;
          break;
        case 'Quarter':
          hasValidDates = stateQuarter.start_date && stateQuarter.end_date;
          break;
        case 'Month':
          hasValidDates = stateMonth.start_date && stateMonth.end_date;
          break;
        case 'Week':
          hasValidDates = stateWeek.start_date && stateWeek.end_date;
          break;
      }
      if (hasValidDates) {
        const timer = setTimeout(() => {
          handleFetchReportData();
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [activeTab1, stateYear, stateQuarter, stateMonth, stateWeek, selectedProject]);

  const fetchReportData = async (page = 1, append = false) => {
    try {
      setIsFetchingMore(page > 1);
      let date = {};
      let rawWorkLogData = [];
      let rawExpenseData = [];

      switch (activeTab1) {
        case 'Custom':
          date = stateCustom;
          break;
        case 'Month':
          date = stateMonth;
          break;
        case 'Quarter':
          date = stateQuarter;
          break;
        case 'Year':
          date = stateYear;
          break;
        case 'Week':
          date = stateWeek;
          break;
        default:
          break;
      }

      if (!date.start_date || !date.end_date) {
        alert(t('MSG.select_dates') || 'Please select dates');
        return;
      }

      const projectParam = selectedProject ? `&projectId=${selectedProject}` : '';

      if (selectedOption === '1' || selectedOption === '3') {
        const resp = await getAPICall(
          `/api/workLogSummaryReport?startDate=${date.start_date}&endDate=${date.end_date}&perPage=370${workLogCursor ? `&cursor=${workLogCursor}` : ''}${projectParam}`
        );

        console.log('Work Log API Response:', resp); // Debug log

        if (resp && resp.logs) {
          const workLogArray = resp.logs.map((log) => ({
            date: log.date,
            projectName: log.project_name || 'Unknown Project',
            totalWorkAmount: Number(log.totalWorkAmount) || 0
          }));

          rawWorkLogData = [...workLogArray];

          setWorkLogData(prevData => ({
            data: append ? [...prevData.data, ...workLogArray] : workLogArray,
            totalWorkAmount: resp.summary?.totalWorkAmount ? Number(resp.summary.totalWorkAmount) : (prevData.totalWorkAmount || 0)
          }));

          console.log('Updated workLogData:', workLogData); // Debug log

          setHasMorePages(resp.has_more_pages || false);
          setWorkLogCursor(resp.next_cursor || null);
        } else {
          showToast('danger', t('MSG.failed_fetch_work_logs') || 'Failed to fetch work logs');
        }
      }

      if (selectedOption === '2' || selectedOption === '3') {
        const expenseResp = await getAPICall(
          `/api/expense-report?startDate=${date.start_date}&endDate=${date.end_date}&perPage=370${expenseCursor ? `&cursor=${expenseCursor}` : ''}${projectParam}`
        );

        if (expenseResp && expenseResp.data) {
          const expenseArray = expenseResp.data.map(expense => ({
            id: expense.id,
            expenseDate: expense.expense_date,
            totalExpense: Number(expense.total_expense) || 0,
            projectName: expense.project_name || 'Unknown Project'
          }));

          rawExpenseData = [...expenseArray];

          setExpenseData(prevData => ({
            data: append ? [...prevData.data, ...expenseArray] : expenseArray,
            totalExpense: Number(expenseResp.total_expense) || 0
          }));

          setHasMorePages(expenseResp.has_more_pages || false);
          setExpenseCursor(expenseResp.next_cursor || null);
        } else {
          showToast('danger', t('MSG.failed_fetch_expense') || 'Failed to fetch expenses');
        }
      }

      if (selectedOption === '4') {
        const resp = await getAPICall(
          `/api/reportProductWiseEarnings?startDate=${date.start_date}&endDate=${date.end_date}&perPage=370${productCursor ? `&cursor=${productCursor}` : ''}${projectParam}`
        );

        if (resp && Array.isArray(resp.data)) {
          const productData = resp.data.map((item) => ({
            product_id: item.id,
            product_name: item.product_name,
            dPrice: Number(item.product_dPrice) || 0,
            totalQty: Number(item.totalQty) || 0,
            totalRevenue: Number(item.totalRevenue) || 0,
            projectName: item.project_name || 'Unknown Project'
          }));

          setProductWiseData(prevData => {
            const currentData = Array.isArray(prevData) ? prevData : (prevData?.data || []);
            return append ? [...currentData, ...productData] : productData;
          });

          setHasMorePages(resp.has_more_pages || false);
          setProductCursor(resp.next_cursor || null);
        } else {
          showToast('danger', t('MSG.invalid_product_data_format') || 'Invalid product data format');
        }
      }

      if (selectedOption === '3') {
        // Use a map to combine by date and projectName
        const pnlMap = new Map();

        rawWorkLogData.forEach((work) => {
          const key = `${work.date}|${work.projectName}`;
          pnlMap.set(key, {
            date: work.date,
            projectName: work.projectName,
            totalWork: work.totalWorkAmount,
            totalExpenses: 0,
            profitLoss: work.totalWorkAmount
          });
        });

        rawExpenseData.forEach((expense) => {
          const key = `${expense.expenseDate}|${expense.projectName}`;
          const existing = pnlMap.get(key) || {
            date: expense.expenseDate,
            projectName: expense.projectName,
            totalWork: 0,
            totalExpenses: 0,
            profitLoss: 0
          };
          existing.totalExpenses += expense.totalExpense;
          existing.profitLoss = existing.totalWork - existing.totalExpenses;
          pnlMap.set(key, existing);
        });

        const pnlArray = Array.from(pnlMap.values());

        setPnLData(prevData => ({
          Data: append ? [...prevData.Data, ...pnlArray] : pnlArray,
          totalWork: rawWorkLogData.reduce((sum, item) => sum + (Number(item.totalWorkAmount) || 0), 0),
          totalExpenses: rawExpenseData.reduce((sum, item) => sum + (Number(item.totalExpense) || 0), 0),
          totalProfitLoss: rawWorkLogData.reduce((sum, item) => sum + (Number(item.totalWorkAmount) || 0), 0) -
                          rawExpenseData.reduce((sum, item) => sum + (Number(item.totalExpense) || 0), 0)
        }));
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      showToast('danger', t('MSG.error_fetching_data') || 'Error fetching data');
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleFetchReportData = () => {
    fetchReportData(1, false);
  };

  const handleLoadMore = () => {
    if (hasMorePages && !isFetchingMore) {
      setCurrentPage(prev => prev + 1);
      fetchReportData(currentPage + 1, true);
    }
  };

  const renderSummaryCards = () => {
    if (selectedOption === '1') {
      return (
        <div className="summary-cards row g-3">
          <div className="col-md-6 col-lg-4">
            <div className="card bg-primary-light">
              <div className="card-body d-flex align-items-center">
                <div className="icon-container me-3">
                  <i className="bi bi-currency-rupee"></i>
                </div>
                <div>
                  <h6 className="card-title mb-1">{t('LABELS.total_work_amount') || 'Total Work Amount'}</h6>
                  <h4 className="card-text">₹{workLogData.totalWorkAmount.toLocaleString()}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (selectedOption === '2') {
      return (
        <div className="summary-cards row g-3">
          <div className="col-md-6 col-lg-4">
            <div className="card bg-danger-light">
              <div className="card-body d-flex align-items-center">
                <div className="icon-container me-3">
                  <i className="bi bi-currency-rupee"></i>
                </div>
                <div>
                  <h6 className="card-title mb-1">{t('LABELS.total_expense') || 'Total Expense'}</h6>
                  <h4 className="card-text">₹{expenseData.totalExpense.toLocaleString()}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (selectedOption === '3') {
      return (
        <div className="summary-cards row g-3">
          <div className="col-md-4">
            <div className="card bg-primary-light">
              <div className="card-body d-flex align-items-center">
                <div className="icon-container me-3">
                  <i className="bi bi-currency-rupee"></i>
                </div>
                <div>
                  <h6 className="card-title mb-1">{t('LABELS.work_grand_total') || 'Work Grand Total'}</h6>
                  <h4 className="card-text">₹{pnlData.totalWork.toLocaleString()}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-danger-light">
              <div className="card-body d-flex align-items-center">
                <div className="icon-container me-3">
                  <i className="bi bi-currency-rupee"></i>
                </div>
                <div>
                  <h6 className="card-title mb-1">{t('LABELS.total_expenses') || 'Total Expenses'}</h6>
                  <h4 className="card-text">₹{pnlData.totalExpenses.toLocaleString()}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success-light">
              <div className="card-body d-flex align-items-center">
                <div className="icon-container me-3">
                  <i className="bi bi-currency-rupee"></i>
                </div>
                <div>
                  <h6 className="card-title mb-1">{t('LABELS.profit_loss') || 'Profit & Loss'}</h6>
                  <h4 className="card-text">₹{pnlData.totalProfitLoss.toLocaleString()}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderTopProductsSection = () => {
    const top3 = getTop3Products();
    return (
      <div className="top-products-section row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">{t('LABELS.top_products')}</div>
            <div className="card-body">
              {top3.map((product, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <CBadge color={['primary', 'success', 'info'][index]} className="badge-rank me-2">{index + 1}</CBadge>
                    {product.product_name}
                  </div>
                  <div className="text-end">
                    <strong>₹{Number(product.totalRevenue).toLocaleString()}</strong>
                    <small className="text-muted ms-2">({product.percentage}%)</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">{t('LABELS.revenue_distribution')}</div>
            <div className="card-body">
              <CChartPie data={getPieChartData()} />
            </div>
          </div>
        </div>
      </div>
    );
  };

 const handleDownloadCSV = () => {
  let csvContent = "";
  let headers = [];
  let rows = [];

  if (selectedOption === "1") {
    // Work Report
    headers = ["Date", "Project", "Work Amount"];
    rows = workLogData.data.map(item => [
      item.date,
      item.projectName,
      item.totalWorkAmount
    ]);
  } else if (selectedOption === "2") {
    // Expense Report
    headers = ["Expense Date", "Project", "Expense Amount"];
    rows = expenseData.data.map(item => [
      item.expenseDate,
      item.projectName,
      item.totalExpense
    ]);
  } else if (selectedOption === "3") {
    // Profit & Loss
    headers = ["Date", "Project", "Total Work", "Total Expenses", "Profit/Loss"];
    rows = pnlData.Data.map(item => [
      item.date,
      item.projectName,
      item.totalWork,
      item.totalExpenses,
      item.profitLoss
    ]);
  }

  if (rows.length === 0) {
    showToast("warning", t("MSG.no_data_to_download") || "No data available to download");
    return;
  }

  // Build CSV string
  csvContent += headers.join(",") + "\n";
  rows.forEach(r => {
    csvContent += r.map(v => `"${v ?? ""}"`).join(",") + "\n";
  });

  // Trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


  return (
    <MantineProvider>
      <div className="responsive-container">
        <CTabs activeItemKey={activeTab1} onChange={handleTabChange}>
          <CTabList variant="tabs" className="mb-3">
            <CTab itemKey="Year">{t('LABELS.year')}</CTab>
            <CTab itemKey="Quarter">{t('LABELS.quarter')}</CTab>
            <CTab itemKey="Month">{t('LABELS.month')}</CTab>
            <CTab itemKey="Week">{t('LABELS.week')}</CTab>
            <CTab itemKey="Custom">{t('LABELS.custom')}</CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel className="p-3" itemKey="Custom">
              <div className="d-none d-md-flex mb-3 justify-content-between">
                <div className="flex-fill mx-1">
                  <Custom setStateCustom={setStateCustom} />
                </div>
                <div className="flex-fill mx-1">
                  <CFormSelect
                    value={selectedProject}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="larger-dropdown"
                  >
                    <option value="">{t('LABELS.select_project')}</option>
                    {projects.map(project => (
                      <option key={project.value} value={project.value}>{project.label}</option>
                    ))}
                  </CFormSelect>
                </div>
                <div className="flex-fill mx-1">
                  <Dropdown
                    setSelectedOption={setSelectedOption}
                    ReportOptions={ReportOptions}
                    selectedOption={selectedOption}
                  />
                </div>
                <div className="flex-fill mx-1 d-flex">
                  <Button fetchReportData={fetchReportData} />
                  <CButton color="info" className="ms-2" style={{height:'38px'}} onClick={handleDownloadCSV}>
                    {t('LABELS.download')}
                  </CButton>
                </div>
              </div>
              <div className="d-md-none mb-3">
                <div className="row gy-3">
                  <div className="col-12">
                    <Custom setStateCustom={setStateCustom} />
                  </div>
                  <div className="col-12">
                    <CFormSelect
                      value={selectedProject}
                      onChange={(e) => handleProjectChange(e.target.value)}
                      className="larger-dropdown"
                    >
                      <option value="">{t('LABELS.select_project')}</option>
                      {projects.map(project => (
                        <option key={project.value} value={project.value}>{project.label}</option>
                      ))}
                    </CFormSelect>
                  </div>
                  <div className="col-12">
                    <Dropdown
                      setSelectedOption={setSelectedOption}
                      ReportOptions={ReportOptions}
                      selectedOption={selectedOption}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-start">
                    <Button fetchReportData={fetchReportData} />
                    <CButton color="info" className="ms-2" onClick={handleDownloadCSV}>
                      {t('LABELS.download')}
                    </CButton>
                  </div>
                </div>
              </div>
              {(workLogData.data.length > 0 || expenseData.data.length > 0) && renderSummaryCards()}
              {selectedOption === '4' && productWiseData.length > 0 && renderTopProductsSection()}
              <div className="mt-3">
                <All_Tables
                  selectedOption={selectedOption}
                  salesData={workLogData}
                  expenseData={expenseData}
                  pnlData={pnlData}
                  expenseType={expenseType}
                  productWiseData={productWiseData}
                  onLoadMore={handleLoadMore}
                  hasMorePages={hasMorePages}
                  isFetchingMore={isFetchingMore}
                  scrollCursor={nextCursor}
                />
              </div>
            </CTabPanel>
            <CTabPanel className="p-3" itemKey="Month">
              <div className="d-none d-md-flex mb-3 justify-content-between">
                <div className="flex-fill mx-1">
                  <Months setStateMonth={setStateMonth} />
                </div>
                <div className="flex-fill mx-1">
                  <CFormSelect
                    value={selectedProject}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="larger-dropdown"
                  >
                    <option value="">{t('LABELS.select_project')}</option>
                    {projects.map(project => (
                      <option key={project.value} value={project.value}>{project.label}</option>
                    ))}
                  </CFormSelect>
                </div>
                <div className="flex-fill mx-1">
                  <Dropdown
                    setSelectedOption={setSelectedOption}
                    ReportOptions={ReportOptions}
                    selectedOption={selectedOption}
                  />
                </div>
                <div className="flex-fill mx-1 d-flex">
                  <Button fetchReportData={fetchReportData} />
                  <CButton color="info" className="ms-2" style={{height:'38px'}} onClick={handleDownloadCSV}>
                    {t('LABELS.download')}
                  </CButton>
                </div>
              </div>
              <div className="d-md-none mb-3">
                <div className="row gy-3">
                  <div className="col-12">
                    <Months setStateMonth={setStateMonth} />
                  </div>
                  <div className="col-12">
                    <CFormSelect
                      value={selectedProject}
                      onChange={(e) => handleProjectChange(e.target.value)}
                      className="larger-dropdown"
                    >
                      <option value="">{t('LABELS.select_project')}</option>
                      {projects.map(project => (
                        <option key={project.value} value={project.value}>{project.label}</option>
                      ))}
                    </CFormSelect>
                  </div>
                  <div className="col-12">
                    <Dropdown
                      setSelectedOption={setSelectedOption}
                      ReportOptions={ReportOptions}
                      selectedOption={selectedOption}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-start">
                    <Button fetchReportData={fetchReportData} />
                    <CButton color="info" className="ms-2" onClick={handleDownloadCSV}>
                      {t('LABELS.download')}
                    </CButton>
                  </div>
                </div>
              </div>
              {(workLogData.data.length > 0 || expenseData.data.length > 0) && renderSummaryCards()}
              {selectedOption === '4' && productWiseData.length > 0 && renderTopProductsSection()}
              <div className="mt-3">
                <All_Tables
                  selectedOption={selectedOption}
                  salesData={workLogData}
                  expenseData={expenseData}
                  pnlData={pnlData}
                  expenseType={expenseType}
                  productWiseData={productWiseData}
                  onLoadMore={handleLoadMore}
                  hasMorePages={hasMorePages}
                  isFetchingMore={isFetchingMore}
                  scrollCursor={nextCursor}
                />
              </div>
            </CTabPanel>
            <CTabPanel className="p-3" itemKey="Quarter">
  <div className="d-none d-md-flex mb-3 justify-content-between">
    <div className="flex-fill mx-1">
      <Quarter setStateQuarter={setStateQuarter} />
    </div>
    <div className="flex-fill mx-1">
      <CFormSelect
        value={selectedProject}
        onChange={(e) => handleProjectChange(e.target.value)}
        className="larger-dropdown"
      >
        <option value="">{t('LABELS.select_project')}</option>
        {projects.map(project => (
          <option key={project.value} value={project.value}>{project.label}</option>
        ))}
      </CFormSelect>
    </div>
    <div className="flex-fill mx-1">
      <Dropdown
        setSelectedOption={setSelectedOption}
        ReportOptions={ReportOptions}
        selectedOption={selectedOption}
      />
    </div>
    <div className="flex-fill mx-1 d-flex">
      <Button fetchReportData={fetchReportData}/>
      <CButton color="info" className="ms-2" style={{height:'38px'}} onClick={handleDownloadCSV}>
        {t('LABELS.download')}
      </CButton>
    </div>
  </div>

  {/* Mobile view */}
  <div className="d-md-none mb-3">
    <div className="row gy-3">
      <div className="col-12">
        <Quarter setStateQuarter={setStateQuarter} />
      </div>
      <div className="col-12">
        <CFormSelect
          value={selectedProject}
          onChange={(e) => handleProjectChange(e.target.value)}
          className="larger-dropdown"
        >
          <option value="">{t('LABELS.select_project')}</option>
          {projects.map(project => (
            <option key={project.value} value={project.value}>{project.label}</option>
          ))}
        </CFormSelect>
      </div>
      <div className="col-12">
        <Dropdown
          setSelectedOption={setSelectedOption}
          ReportOptions={ReportOptions}
          selectedOption={selectedOption}
        />
      </div>
      <div className="col-12 d-flex justify-content-start">
        <Button fetchReportData={fetchReportData} />
        <CButton color="info" className="ms-2" onClick={handleDownloadCSV}>
          {t('LABELS.download')}
        </CButton>
      </div>
    </div>
  </div>

  {(workLogData.data.length > 0 || expenseData.data.length > 0) && renderSummaryCards()}
  {selectedOption === '4' && productWiseData.length > 0 && renderTopProductsSection()}
  <div className="mt-3">
    <All_Tables
      selectedOption={selectedOption}
      salesData={workLogData}
      expenseData={expenseData}
      pnlData={pnlData}
      expenseType={expenseType}
      productWiseData={productWiseData}
      onLoadMore={handleLoadMore}
      hasMorePages={hasMorePages}
      isFetchingMore={isFetchingMore}
      scrollCursor={nextCursor}
    />
  </div>
</CTabPanel>

            <CTabPanel className="p-3" itemKey="Week">
  <div className="d-none d-md-flex mb-3 justify-content-between">
    <div className="flex-fill mx-1">
      <Week setStateWeek={setStateWeek} />
    </div>
    <div className="flex-fill mx-1">
      <CFormSelect
        value={selectedProject}
        onChange={(e) => handleProjectChange(e.target.value)}
        className="larger-dropdown"
      >
        <option value="">{t('LABELS.select_project')}</option>
        {projects.map(project => (
          <option key={project.value} value={project.value}>{project.label}</option>
        ))}
      </CFormSelect>
    </div>
    <div className="flex-fill mx-1">
      <Dropdown
        setSelectedOption={setSelectedOption}
        ReportOptions={ReportOptions}
        selectedOption={selectedOption}
      />
    </div>
    <div className="flex-fill mx-1 d-flex">
      <Button fetchReportData={fetchReportData}/>
      <CButton color="info" className="ms-2" style={{height:'38px'}} onClick={handleDownloadCSV}>
        {t('LABELS.download')}
      </CButton>
    </div>
  </div>

  <div className="d-md-none mb-3">
    <div className="row gy-3">
      <div className="col-12"><Week setStateWeek={setStateWeek} /></div>
      <div className="col-12">
        <CFormSelect
          value={selectedProject}
          onChange={(e) => handleProjectChange(e.target.value)}
          className="larger-dropdown"
        >
          <option value="">{t('LABELS.select_project')}</option>
          {projects.map(project => (
            <option key={project.value} value={project.value}>{project.label}</option>
          ))}
        </CFormSelect>
      </div>
      <div className="col-12">
        <Dropdown
          setSelectedOption={setSelectedOption}
          ReportOptions={ReportOptions}
          selectedOption={selectedOption}
        />
      </div>
      <div className="col-12 d-flex justify-content-start">
        <Button fetchReportData={fetchReportData}/>
        <CButton color="info" className="ms-2" onClick={handleDownloadCSV}>
          {t('LABELS.download')}
        </CButton>
      </div>
    </div>
  </div>

  {(workLogData.data.length > 0 || expenseData.data.length > 0) && renderSummaryCards()}
  {selectedOption === '4' && productWiseData.length > 0 && renderTopProductsSection()}
  <div className="mt-3">
    <All_Tables
      selectedOption={selectedOption}
      salesData={workLogData}
      expenseData={expenseData}
      pnlData={pnlData}
      expenseType={expenseType}
      productWiseData={productWiseData}
      onLoadMore={handleLoadMore}
      hasMorePages={hasMorePages}
      isFetchingMore={isFetchingMore}
      scrollCursor={nextCursor}
    />
  </div>
</CTabPanel>

            <CTabPanel className="p-3" itemKey="Year">
              <div className="d-none d-md-flex mb-3 align-items-end">
                <Year setStateYear={setStateYear} />
                <div className='mx-1 mt-2'>
                  <CFormSelect
                    value={selectedProject}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="larger-dropdown"
                  >
                    <option value="">{t('LABELS.select_project')}</option>
                    {projects.map(project => (
                      <option key={project.value} value={project.value}>{project.label}</option>
                    ))}
                  </CFormSelect>
                </div>
                <div className='mx-1 mt-2'>
                  <Dropdown
                    setSelectedOption={setSelectedOption}
                    ReportOptions={ReportOptions}
                    selectedOption={selectedOption}
                  />
                </div>
                <div className='mx-1 mt-2 d-flex'>
                  <Button fetchReportData={fetchReportData}/>
                  <CButton color="info" className="ms-2" onClick={handleDownloadCSV}>
                    {t('LABELS.download')}
                  </CButton>
                </div>
              </div>
              <div className="d-md-none mb-3">
                <div className="row gy-3">
                  <div className="col-12">
                    <Year setStateYear={setStateYear} />
                  </div>
                  <div className="col-12">
                    <CFormSelect
                      value={selectedProject}
                      onChange={(e) => handleProjectChange(e.target.value)}
                      className="larger-dropdown"
                    >
                      <option value="">{t('LABELS.select_project')}</option>
                      {projects.map(project => (
                        <option key={project.value} value={project.value}>{project.label}</option>
                      ))}
                    </CFormSelect>
                  </div>
                  <div className="col-12">
                    <Dropdown
                      setSelectedOption={setSelectedOption}
                      ReportOptions={ReportOptions}
                      selectedOption={selectedOption}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-start">
                    <Button fetchReportData={fetchReportData} />
                    <CButton color="info" className="ms-2" onClick={handleDownloadCSV}>
                      {t('LABELS.download')}
                    </CButton>
                  </div>
                </div>
              </div>
              {(workLogData.data.length > 0 || expenseData.data.length > 0) && renderSummaryCards()}
              {selectedOption === '4' && productWiseData.length > 0 && renderTopProductsSection()}
              <div className="mt-3">
                <All_Tables
                  selectedOption={selectedOption}
                  salesData={workLogData}
                  expenseData={expenseData}
                  pnlData={pnlData}
                  expenseType={expenseType}
                  productWiseData={productWiseData}
                  onLoadMore={handleLoadMore}
                  hasMorePages={hasMorePages}
                  isFetchingMore={isFetchingMore}
                  scrollCursor={nextCursor}
                />
              </div>
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </div>
      <style jsx>{`
        .responsive-container { width: 100%; max-width: 100%; overflow-x: hidden; }
        .language-selector { margin-bottom: 10px; }
        @media (max-width: 768px) {
          .responsive-container { padding: 0 5px; }
        }
        :global(.larger-dropdown select) {
          min-width: 200px !important;
          font-size: 1.1rem !important;
          height: auto !important;
          padding: 8px 12px !important;
        }
        :global(.larger-dropdown .dropdown-toggle) {
          min-width: 200px !important;
          font-size: 1.1rem !important;
          padding: 8px 12px !important;
        }
        :global(.larger-dropdown .dropdown-menu .dropdown-item) {
          font-size: 1.1rem !important;
          padding: 8px 12px !important;
        }
        .summary-cards .card {
          border-radius: 12px;
          transition: transform 0.3s ease;
          border: 1px solid transparent;
        }
        .summary-cards .card:hover {
          transform: translateY(-5px);
        }
        .bg-primary-light {
          background-color: rgba(13, 110, 253, 0.1);
          border-color: rgba(13, 110, 253, 0.4);
        }
        .bg-danger-light {
          background-color: rgba(220, 53, 69, 0.1);
          border-color: rgba(220, 53, 69, 0.4);
        }
        .bg-success-light {
          background-color: rgba(25, 135, 84, 0.1);
          border-color: rgba(25, 135, 84, 0.4);
        }
        .bg-warning-light {
          background-color: rgba(255, 193, 7, 0.1);
          border-color: rgba(255, 193, 7, 0.4);
        }
        .icon-container {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .top-products-section .card {
          transition: all 0.3s ease;
          border: 1px solid #e3e6f0;
        }
        .top-products-section .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        .badge-rank {
          font-size: 0.8rem;
          font-weight: 600;
        }
      `}</style>
    </MantineProvider>
  );
}

export default All_Reports;