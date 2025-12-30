import React, { useEffect, useMemo, useState } from 'react';
import {
	CBadge,
	CCard,
	CCardBody,
	CCardHeader,
	CCol,
	CRow,
	CButton,
	CForm,
	CFormInput,
	CFormLabel,
	CTable,
	CTableBody,
	CTableDataCell,
	CTableHead,
	CTableHeaderCell,
	CTableRow,
} from '@coreui/react';
import { getAPICall } from '../../../util/api';

function formatDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

const CompanySummary = () => {
	const today = useMemo(() => new Date(), []);
	const [state, setState] = useState({
		start_date: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
		end_date: formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Top-level Summary
	const [totalSales, setTotalSales] = useState(0);
	const [totalPaid, setTotalPaid] = useState(0);
	const [totalRemaining, setTotalRemaining] = useState(0);
	const [totalExpenses, setTotalExpenses] = useState(0);
	const [profitLoss, setProfitLoss] = useState(0);

	// Entities
	const [customersCount, setCustomersCount] = useState(0);
	const [machinesSummary, setMachinesSummary] = useState([]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setState((prev) => ({ ...prev, [name]: value }));
	};

	const loadData = async () => {
		setLoading(true);
		setError('');
		try {
			const { start_date, end_date } = state;

			// Parallel fetches
			const [
				salesSummaryResp,
				pnlResp,
				machineResp,
				customersResp,
			] = await Promise.all([
				getAPICall(`/api/summerySalesReport?startDate=${start_date}&endDate=${end_date}`),
				getAPICall(`/api/profitLossReport?startDate=${start_date}&endDate=${end_date}`),
				getAPICall(`/api/machine-expense-report?startDate=${start_date}&endDate=${end_date}`),
				getAPICall(`/api/customer`),
			]);

			// Sales summary totals
			const totals = salesSummaryResp?.totals ?? {};
			setTotalSales(Number(totals.totalAmount || 0));
			setTotalPaid(Number(totals.totalPaidAmount || 0));
			setTotalRemaining(Number(totals.totalRemainingAmount || 0));

			// PnL summary
			const summary = pnlResp?.summary ?? {};
			setTotalExpenses(Number(summary.expenses?.totalExpenses || 0));
			setProfitLoss(Number(summary.profitLoss?.profitLossAmount || 0));

			// Machines
			const machineData = machineResp?.data ?? [];
			setMachinesSummary(machineData);

			// Customers
			setCustomersCount(Array.isArray(customersResp) ? customersResp.length : 0);
		} catch (err) {
			setError(err?.message || 'Failed to load summary');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (e) => {
		e.preventDefault();
		await loadData();
	};

	const totalMachines = machinesSummary.length;
	const totalMachineProfit = machinesSummary.reduce((acc, m) => acc + Number(m.profit || 0), 0);
	const totalMachineLoss = machinesSummary.reduce((acc, m) => acc + Number(m.loss || 0), 0);
	const totalMachineNet = machinesSummary.reduce((acc, m) => acc + Number(m.net || 0), 0);

	return (
		<CRow>
			<CCol xs={12}>
				<CCard className="mb-4">
					<CCardHeader>
						<strong>Company Summary</strong>
					</CCardHeader>
					<CCardBody>
						<CForm onSubmit={onSubmit} className="mb-3">
							<CRow>
								<CCol sm={4}>
									<div className="mb-2">
										<CFormLabel htmlFor="start_date">Start Date</CFormLabel>
										<CFormInput
											type="date"
											id="start_date"
											name="start_date"
											value={state.start_date}
											onChange={handleChange}
											required
										/>
									</div>
								</CCol>
								<CCol sm={4}>
									<div className="mb-2">
										<CFormLabel htmlFor="end_date">End Date</CFormLabel>
										<CFormInput
											type="date"
											id="end_date"
											name="end_date"
											value={state.end_date}
											onChange={handleChange}
											required
										/>
									</div>
								</CCol>
								<CCol sm={4} className="d-flex align-items-end">
									<CButton color="primary" type="submit" disabled={loading}>
										{loading ? 'Loading...' : 'Refresh'}
									</CButton>
								</CCol>
							</CRow>
						</CForm>

						{error ? (
							<div className="text-danger mb-3">{error}</div>
						) : null}

						<CRow className="mb-3">
							<CCol md={3} sm={6} className="mb-2">
								<CCard>
									<CCardBody>
										<div className="text-muted">Total Sales</div>
										<h5>{totalSales.toFixed(2)}</h5>
									</CCardBody>
								</CCard>
							</CCol>
							<CCol md={3} sm={6} className="mb-2">
								<CCard>
									<CCardBody>
										<div className="text-muted">Total Paid</div>
										<h5>{totalPaid.toFixed(2)}</h5>
									</CCardBody>
								</CCard>
							</CCol>
							<CCol md={3} sm={6} className="mb-2">
								<CCard>
									<CCardBody>
										<div className="text-muted">Total Due</div>
										<h5>{totalRemaining.toFixed(2)}</h5>
									</CCardBody>
								</CCard>
							</CCol>
							<CCol md={3} sm={6} className="mb-2">
								<CCard>
									<CCardBody>
										<div className="text-muted">Total Expenses</div>
										<h5>{totalExpenses.toFixed(2)}</h5>
									</CCardBody>
								</CCard>
							</CCol>
						</CRow>

						<CRow className="mb-4">
							<CCol md={3} sm={6} className="mb-2">
								<CCard>
									<CCardBody>
										<div className="text-muted">Profit / Loss</div>
										<h5>
											<CBadge color={profitLoss >= 0 ? 'success' : 'danger'}>
												{profitLoss.toFixed(2)}
											</CBadge>
										</h5>
									</CCardBody>
								</CCard>
							</CCol>
							<CCol md={3} sm={6} className="mb-2">
								<CCard>
									<CCardBody>
										<div className="text-muted">Customers</div>
										<h5>{customersCount}</h5>
									</CCardBody>
								</CCard>
							</CCol>
							<CCol md={3} sm={6} className="mb-2">
								<CCard>
									<CCardBody>
										<div className="text-muted">Machines</div>
										<h5>{totalMachines}</h5>
									</CCardBody>
								</CCard>
							</CCol>
							<CCol md={3} sm={6} className="mb-2">
								<CCard>
									<CCardBody>
										<div className="text-muted">Machine Net</div>
										<h5>
											<CBadge color={totalMachineNet >= 0 ? 'success' : 'danger'}>
												{totalMachineNet.toFixed(2)}
											</CBadge>
										</h5>
									</CCardBody>
								</CCard>
							</CCol>
						</CRow>

						<CCard className="mb-2">
							<CCardHeader>
								<strong>Machines Summary</strong>
							</CCardHeader>
							<CCardBody>
								<div className="table-responsive">
									<CTable small>
										<CTableHead>
											<CTableRow>
												<CTableHeaderCell>Sr</CTableHeaderCell>
												<CTableHeaderCell>Name</CTableHeaderCell>
												<CTableHeaderCell>Reg No</CTableHeaderCell>
												<CTableHeaderCell className="text-end">Profit</CTableHeaderCell>
												<CTableHeaderCell className="text-end">Loss</CTableHeaderCell>
												<CTableHeaderCell className="text-end">Net</CTableHeaderCell>
											</CTableRow>
										</CTableHead>
										<CTableBody>
											{machinesSummary.map((m, idx) => (
												<CTableRow key={m.id ?? idx}>
													<CTableDataCell>{m.sr_no ?? idx + 1}</CTableDataCell>
													<CTableDataCell>{m.machine_name}</CTableDataCell>
													<CTableDataCell>{m.reg_number}</CTableDataCell>
													<CTableDataCell className="text-end">{Number(m.profit || 0).toFixed(2)}</CTableDataCell>
													<CTableDataCell className="text-end">{Number(m.loss || 0).toFixed(2)}</CTableDataCell>
													<CTableDataCell className="text-end">
														<CBadge color={(Number(m.net || 0)) >= 0 ? 'success' : 'danger'}>
															{Number(m.net || 0).toFixed(2)}
														</CBadge>
													</CTableDataCell>
												</CTableRow>
											))}
											{machinesSummary.length === 0 ? (
												<CTableRow>
													<CTableDataCell colSpan={6} className="text-center text-muted">
														No machines found for selected period.
													</CTableDataCell>
												</CTableRow>
											) : null}
											{machinesSummary.length > 0 ? (
												<CTableRow>
													<CTableHeaderCell colSpan={3}>Totals</CTableHeaderCell>
													<CTableHeaderCell className="text-end">{totalMachineProfit.toFixed(2)}</CTableHeaderCell>
													<CTableHeaderCell className="text-end">{totalMachineLoss.toFixed(2)}</CTableHeaderCell>
													<CTableHeaderCell className="text-end">
														<CBadge color={totalMachineNet >= 0 ? 'success' : 'danger'}>
															{totalMachineNet.toFixed(2)}
														</CBadge>
													</CTableHeaderCell>
												</CTableRow>
											) : null}
										</CTableBody>
									</CTable>
								</div>
							</CCardBody>
						</CCard>
					</CCardBody>
				</CCard>
			</CCol>
		</CRow>
	);
};

export default CompanySummary;


