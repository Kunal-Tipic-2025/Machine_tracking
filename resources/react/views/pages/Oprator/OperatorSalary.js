import React, { useState, useMemo, useEffect } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormCheck,
  CBadge,
  CCol,
  CRow
} from "@coreui/react";
import { getAPICall, getWithParams, post } from "../../../util/api";
import { getUserData } from "../../../util/session";
import { useToast } from "../../common/toast/ToastContext";
import { useTranslation } from 'react-i18next';

/* ---------------- DEMO DATA ---------------- */

// const initialOperators = [
//   {
//     id: 1,
//     name: "Ramesh Patil",
//     baseSalary: 18000,
//     expenses: [
//       { id: 1, label: "Diesel", amount: 1200, deduct: true },
//       { id: 2, label: "Food", amount: 800, deduct: true },
//       { id: 3, label: "Repair", amount: 2000, deduct: false }
//     ],
//     advance: {
//       taken: 5000,
//       returned: 1500,
//       applyThisMonth: false
//     },
//     settlements: [
//       {
//         month: "Dec 2025",
//         paid: 14000,
//         expenses: [
//           { id: 1, label: "Diesel", amount: 1200 },
//           { id: 2, label: "Food", amount: 800 }
//         ],
//         advanceApplied: 2000
//       }
//     ]
//   },
//   {
//     id: 2,
//     name: "Suresh Kumar",
//     baseSalary: 20000,
//     expenses: [
//       { id: 1, label: "Diesel", amount: 1500, deduct: true },
//       { id: 2, label: "Maintenance", amount: 1200, deduct: false },
//       { id: 3, label: "Food", amount: 600, deduct: true }
//     ],
//     advance: {
//       taken: 3000,
//       returned: 1000,
//       applyThisMonth: true
//     },
//     settlements: [
//       {
//         month: "Nov 2025",
//         paid: 17800,
//         expenses: [
//           { id: 1, label: "Diesel", amount: 1400 },
//           { id: 3, label: "Food", amount: 800 }
//         ],
//         advanceApplied: 0
//       },
//       {
//         month: "Dec 2025",
//         paid: 16900,
//         expenses: [
//           { id: 1, label: "Diesel", amount: 1500 },
//           { id: 2, label: "Maintenance", amount: 1200 },
//           { id: 3, label: "Food", amount: 600 }
//         ],
//         advanceApplied: 0
//       }
//     ]
//   },
//   {
//     id: 3,
//     name: "Vijay Sharma",
//     baseSalary: 22000,
//     expenses: [
//       { id: 1, label: "Diesel", amount: 1800, deduct: false },
//       { id: 2, label: "Tools", amount: 2500, deduct: true },
//       { id: 3, label: "Food", amount: 900, deduct: true },
//       { id: 4, label: "Uniform", amount: 500, deduct: false }
//     ],
//     advance: {
//       taken: 8000,
//       returned: 2000,
//       applyThisMonth: false
//     },
//     settlements: [
//       {
//         month: "Dec 2025",
//         paid: 18600,
//         expenses: [
//           { id: 1, label: "Diesel", amount: 1800 },
//           { id: 3, label: "Food", amount: 600 }
//         ],
//         advanceApplied: 1000
//       }
//     ]
//   },
//   {
//     id: 4,
//     name: "Mahesh Deshmukh",
//     baseSalary: 19000,
//     expenses: [
//       { id: 1, label: "Diesel", amount: 1400, deduct: true },
//       { id: 2, label: "Accommodation", amount: 3000, deduct: false },
//       { id: 3, label: "Food", amount: 700, deduct: true }
//     ],
//     advance: {
//       taken: 4500,
//       returned: 4500,
//       applyThisMonth: false
//     },
//     settlements: []
//   },
//   {
//     id: 5,
//     name: "Prakash Yadav",
//     baseSalary: 21000,
//     expenses: [
//       { id: 1, label: "Diesel", amount: 1600, deduct: true },
//       { id: 2, label: "Repair", amount: 2200, deduct: true },
//       { id: 3, label: "Food", amount: 800, deduct: false },
//       { id: 4, label: "Travel", amount: 1000, deduct: false }
//     ],
//     advance: {
//       taken: 6000,
//       returned: 1500,
//       applyThisMonth: true
//     },
//     settlements: [
//       {
//         month: "Oct 2025",
//         paid: 18200,
//         expenses: [
//           { id: 1, label: "Diesel", amount: 1500 },
//           { id: 2, label: "Repair", amount: 1300 }
//         ],
//         advanceApplied: 0
//       },
//       {
//         month: "Nov 2025",
//         paid: 15800,
//         expenses: [
//           { id: 1, label: "Diesel", amount: 1600 },
//           { id: 3, label: "Food", amount: 800 }
//         ],
//         advanceApplied: 2800
//       }
//     ]
//   }
// ];

// const initialOperators = [
//   {
//     id: 1,
//     name: "Ramesh Patil",
//     baseSalary: 18000,
//     expenses: [
//       { id: 1, label: "Diesel", amount: 1200, deduct: true },
//       { id: 2, label: "Food", amount: 800, deduct: true },
//       { id: 3, label: "Repair", amount: 2000, deduct: false }
//     ],
//     advances: [
//       { id: 1, amount: 5000, date: '2025-01-01', remark: 'Emergency', repaid: false, repaidDate: null },
//       { id: 2, amount: 3000, date: '2024-12-15', remark: 'Medical', repaid: true, repaidDate: '2025-01-10' }
//     ],
//     advance: {
//       taken: 5000,
//       returned: 1500,
//       applyThisMonth: false
//     },
//     settlements: [
//       {
//         month: "Dec 2025",
//         paid: 14000,
//         expenses: [
//           { id: 1, label: "Diesel", amount: 1200 },
//           { id: 2, label: "Food", amount: 800 }
//         ],
//         advanceApplied: 2000
//       }
//     ]
//   },
//   {
//     id: 2,
//     name: "Suresh Kumar",
//     baseSalary: 20000,
//     expenses: [
//       { id: 1, label: "Diesel", amount: 1500, deduct: true },
//       { id: 2, label: "Maintenance", amount: 1200, deduct: false },
//       { id: 3, label: "Food", amount: 600, deduct: true }
//     ],
//     advances: [
//       { id: 1, amount: 5000, date: '2025-01-01', remark: 'Emergency', repaid: false, repaidDate: null, repaidAmount: 0 },
//       { id: 2, amount: 3000, date: '2024-12-15', remark: 'Medical', repaid: true, repaidDate: '2025-01-10', repaidAmount: 3000 }
//     ],
//     advance: {
//       taken: 3000,
//       returned: 1000,
//       applyThisMonth: true
//     },
//     settlements: [
//       {
//         month: "Nov 2025",
//         paid: 17800,
//         expenses: [
//           { id: 1, label: "Diesel", amount: 1400 },
//           { id: 3, label: "Food", amount: 800 }
//         ],
//         advanceApplied: 0
//       },
//       {
//         month: "Dec 2025",
//         paid: 16900,
//         expenses: [
//           { id: 1, label: "Diesel", amount: 1500 },
//           { id: 2, label: "Maintenance", amount: 1200 },
//           { id: 3, label: "Food", amount: 600 }
//         ],
//         advanceApplied: 0
//       }
//     ]
//   },
//   // ... rest of the operators with similar advances array structure
// ];
/* ---------------- COMPONENT ---------------- */

const OperatorSalary = () => {
  const [operators, setOperators] = useState([]);
  const [activeOperator, setActiveOperator] = useState(null);

  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [showAdvanceHistoryModal, setShowAdvanceHistoryModal] = useState(false);
  const [selectedOperatorForAdvance, setSelectedOperatorForAdvance] = useState(null);
  const [newAdvanceAmount, setNewAdvanceAmount] = useState('');
  const [newAdvanceDate, setNewAdvanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAdvanceRemark, setNewAdvanceRemark] = useState('');
  const [repaymentAmounts, setRepaymentAmounts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { t } = useTranslation("global");
  
  const { showToast } = useToast();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );

  const [dashboardSummary, setDashboardSummary] = useState({
    total_salary_paid: 0,
    total_advance_pending: 0,
    total_expense_pending: 0,
  });


  const month = selectedMonth;
  const user = getUserData();

  console.log(user);
  useEffect(() => {
    getWithParams('api/dashboard/summary', {
      company_id: user?.company_id,

      month: selectedMonth
    }).then(setDashboardSummary);
  }, [selectedMonth]);

  useEffect(() => {
    getAPICall(`api/dashboard/operator-summary?company_id=${user.company_id}`)
      .then(data => {
        const safeData = data.map(op => ({
          ...op,
          settlements: [], // prevent crashes
          expenses: [],
          advances: []
        }));
        setOperators(safeData);
      });
    console.log('operators', operators);

  }, []);

  function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  const filteredOperators = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return operators;

    return operators.filter(op =>
      op.name
        ?.toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase())
    );
  }, [operators, debouncedSearchQuery]);

  const refreshOperatorSummary = async () => {
    const data = await getWithParams(
      'api/dashboard/operator-summary',
      { company_id: user.company_id }
    );

    const safeData = data.map(op => ({
      ...op,
      settlements: op.settlements || [],
      expenses: op.expenses || [],
      advances: op.advances || [],
    }));

    setOperators(safeData);
  };

  const refreshDashboardSummary = async () => {
    const summary = await getWithParams(
      'api/dashboard/summary',
      {
        company_id: user.company_id,
        month: selectedMonth,
      }
    );

    setDashboardSummary(summary);
  };

  const openManageModal = async (operator) => {
    const [rawAdvances, rawExpenses, history] = await Promise.all([
      getWithParams('api/advances/repaid-unsettled', { operator_id: operator.id }),
      getWithParams('api/expenses/pending', { operator_id: operator.id }),
      getWithParams('api/operator-salary-history', {
        operator_id: operator.id,
        company_id: user.company_id
      })
    ]);

    const advances = rawAdvances.map(a => ({
      id: a.id,
      date: a.advance_date ?? null,
      amount: Number(a.amount || 0),
      repaidAmount: Number(a.repayment_amount || 0),
      balance: Number(a.amount) - Number(a.repayment_amount || 0),
      apply: false, // 👈 checkbox like expenses
      remark: a.remark,
    }));

    const expenses = rawExpenses.map(e => ({
      id: e.id,
      label: e.about_expenses,
      amount: Number(e.total_amount || 0),
      deduct: false,
    }));

    const salaryHistory = (history.salary_history || []).map(s => ({
      month: s.month,
      paid: Number(s.net_salary || 0),
      expenses: Number(s.total_expense_deducted|| 0 ), // we don’t show detailed expense list here
      advanceApplied: Number(s.total_advance_deducted || 0),
    }));

    setActiveOperator({
      ...operator,
      advances,
      expenses,
      settlements: salaryHistory,
    });
  };
  /* ---------- CALCULATIONS ---------- */

  const expenseTotal = useMemo(() => {
    if (!activeOperator) return 0;
    return activeOperator.expenses
      .filter(e => e.deduct)
      .reduce((s, e) => s + e.amount, 0);
  }, [activeOperator]);

  // const netAdvance = useMemo(() => {
  //   if (!activeOperator || !activeOperator.advance) return 0;
  //   return activeOperator.advance.taken - activeOperator.advance.returned;
  // }, [activeOperator]);

  const netAdvance = useMemo(() => {
    if (!activeOperator) return 0;

    return activeOperator.advances
      .filter(a => a.apply)
      .reduce((sum, a) => sum + a.balance, 0);
  }, [activeOperator]);



  const netPayable = useMemo(() => {
    if (!activeOperator) return 0;
    return activeOperator.payment - expenseTotal - netAdvance;
  }, [activeOperator, expenseTotal, netAdvance]);

  /* ---------- HANDLERS ---------- */

  const toggleExpense = (id) => {
    setActiveOperator(prev => ({
      ...prev,
      expenses: prev.expenses.map(e =>
        e.id === id ? { ...e, deduct: !e.deduct } : e
      )
    }));
  };

  // const handleAddAdvance = () => {
  //   if (!newAdvanceAmount || parseFloat(newAdvanceAmount) <= 0) {
  //     alert('Please enter a valid advance amount');
  //     return;
  //   }

  //   const newAdvance = {
  //     id: Date.now(),
  //     amount: parseFloat(newAdvanceAmount),
  //     date: newAdvanceDate,
  //     remark: newAdvanceRemark,
  //     repaid: false,
  //     repaidDate: null
  //   };

  //   const updatedOperators = operators.map(op =>
  //     op.id === selectedOperatorForAdvance.id
  //       ? {
  //         ...op,
  //         advances: [...(op.advances || []), newAdvance]
  //       }
  //       : op
  //   );

  //   setOperators(updatedOperators);
  //   setNewAdvanceAmount('');
  //   setNewAdvanceDate(new Date().toISOString().split('T')[0]);
  //   setNewAdvanceRemark('');
  //   setShowAdvanceModal(false);
  //   setSelectedOperatorForAdvance(null);
  // };

  const handleAddAdvance = async () => {
    if (!newAdvanceAmount || parseFloat(newAdvanceAmount) <= 0) {
      showToast('danger', 'Please enter a valid advance amount');
      return;
    }

    try {
      // 1️⃣ Create advance in backend
      await post('api/advances', {
        operator_id: selectedOperatorForAdvance.id,
        company_id: user.company_id,
        amount: parseFloat(newAdvanceAmount),
        advance_date: newAdvanceDate,
        remark: newAdvanceRemark,
      });


      // // 2️⃣ Re-fetch pending advances for this operator
      // const advances = await getWithParams('api/advances/pending', {
      //   operator_id: selectedOperatorForAdvance.id,
      // });

      // // 3️⃣ Update operators state safely
      // setOperators(prev =>
      //   prev.map(op =>
      //     op.id === selectedOperatorForAdvance.id
      //       ? { ...op, advances }
      //       : op
      //   )
      // );


      // 2️⃣ REFRESH OPERATOR TABLE DATA 🔥
      await refreshOperatorSummary();

      // 3️⃣ REFRESH DASHBOARD TOTALS 🔥
      await refreshDashboardSummary();

      // 4️⃣ If manage modal is open → refresh advances
      if (activeOperator?.id === selectedOperatorForAdvance.id) {
        const rawAdvances = await getWithParams(
          'api/advances/repaid-unsettled',
          { operator_id: selectedOperatorForAdvance.id }
        );

        const advances = rawAdvances.map(a => ({
          id: a.id,
          date: a.advance_date,
          amount: Number(a.amount),
          repaidAmount: Number(a.repayment_amount || 0),
          balance: Number(a.amount) - Number(a.repayment_amount || 0),
          apply: false,
          remark: a.remark,
        }));

        setActiveOperator(prev => ({
          ...prev,
          advances,
        }));
      }

      // 4️⃣ Reset UI
      setNewAdvanceAmount('');
      setNewAdvanceDate(new Date().toISOString().split('T')[0]);
      setNewAdvanceRemark('');
      setShowAdvanceModal(false);
      setSelectedOperatorForAdvance(null);

      showToast('success', 'Advance added successfully');
    } catch (error) {
      // alert(error.message || 'Failed to add advance');
      showToast('danger', 'Failed to add advance');
    }
  };

  // const handleMarkAdvanceRepaid = (operatorId, advanceId) => {
  //   const repaymentAmount = parseFloat(repaymentAmounts[advanceId]) || 0;

  //   if (repaymentAmount <= 0) {
  //     alert('Please enter a valid repayment amount');
  //     return;
  //   }

  //   const updatedOperators = operators.map(op =>
  //     op.id === operatorId
  //       ? {
  //         ...op,
  //         advances: op.advances.map(adv =>
  //           adv.id === advanceId
  //             ? {
  //               ...adv,
  //               repaid: true,
  //               repaidDate: new Date().toISOString().split('T')[0],
  //               repaidAmount: repaymentAmount
  //             }
  //             : adv
  //         )
  //       }
  //       : op
  //   );

  //   setOperators(updatedOperators);

  //   // Clear the repayment amount for this advance
  //   setRepaymentAmounts(prev => {
  //     const updated = { ...prev };
  //     delete updated[advanceId];
  //     return updated;
  //   });
  // };

  const handleMarkAdvanceRepaid = async (operatorId, advanceId) => {
    const repaymentAmount = parseFloat(repaymentAmounts[advanceId]) || 0;

    if (repaymentAmount < 0) {
      // alert('Please enter a valid repayment amount');
      showToast('danger', 'Please enter a valid advance amount');
      return;
    }

    try {
      // 1️⃣ Settle advance in backend
      await post('api/advances/settle', {
        advance_id: advanceId,
        repayment_amount: repaymentAmount,
      });

      // 2️⃣ Refresh pending advances
      // const advances = await getWithParams('api/advances/pending', {
      //   operator_id: operatorId,
      // });

      const advances = await getWithParams(
        'api/advances/repaid-unsettled',
        { operator_id: operatorId }
      );

      // ✅ Update active operator (modal)
      setActiveOperator(prev => {
        if (!prev || prev.id !== operatorId) return prev;

        const previousApplyMap = new Map(
          prev.advances.map(a => [a.id, a.apply])
        );

        const adaptedAdvances = advances.map(a => ({
          id: a.id,
          date: a.advance_date,
          amount: Number(a.amount || 0),
          repaidAmount: Number(a.repayment_amount || 0),
          balance: Number(a.amount || 0) - Number(a.repayment_amount || 0),
          apply: previousApplyMap.get(a.id) ?? false, // ✅ KEEP USER SELECTION
          remark: a.remark,
        }));


        // return { ...prev, advances: adaptedAdvances };
      });


        // 🔥 ADD THIS: Refresh operator table data
    await refreshOperatorSummary();

    // 🔥 ADD THIS: Refresh dashboard totals
    await refreshDashboardSummary();

      // // 3️⃣ Update operator advances
      // setOperators(prev =>
      //   prev.map(op =>
      //     op.id === operatorId
      //       ? { ...op, advances: adaptedAdvances }
      //       : op
      //   )
      // );



      // 4️⃣ Clear repayment input
      setRepaymentAmounts(prev => {
        const updated = { ...prev };
        delete updated[advanceId];
        return updated;
      });

      // alert('Advance settled successfully');
      showToast('success', 'Advance settled successfully');

      setShowAdvanceModal(false);
    } catch (error) {
      // alert(error.message || 'Failed to settle advance');
      showToast('danger', 'Failed to add advance');

    }
  };

  const handleRepaymentAmountChange = (advanceId, value, maxAmount) => {
    const numValue = parseFloat(value);
    if (numValue > maxAmount) {
      // alert(`Repayment amount cannot exceed advance amount of ₹${maxAmount}`);
      showToast(
        'warning',
        `Repayment amount cannot exceed advance amount of ₹${maxAmount}`
      );

      return;
    }
    setRepaymentAmounts(prev => ({
      ...prev,
      [advanceId]: value
    }));
  };

  // const openAdvanceModal = (operator) => {
  //   setSelectedOperatorForAdvance(operator);
  //   setShowAdvanceModal(true);
  // };

  const openAdvanceModal = async (operator) => {
    try {
      // Fetch pending advances from backend
      const advances = await getWithParams('api/advances/pending', {
        operator_id: operator.id,
      });

      // Set operator with fetched advances
      setSelectedOperatorForAdvance({
        ...operator,
        advances: advances || []
      });
      setShowAdvanceModal(true);
    } catch (error) {
      console.error('Error fetching advances:', error);
      setSelectedOperatorForAdvance({
        ...operator,
        advances: []
      });
      setShowAdvanceModal(true);
    }
  };

  // const openAdvanceHistoryModal = (operator) => {
  //   setSelectedOperatorForAdvance(operator);
  //   setShowAdvanceHistoryModal(true);
  // };

  // const openAdvanceHistoryModal = async (operator) => {
  //   try {
  //     // Fetch settled advances from backend
  //     const settledAdvances = await getWithParams('api/advances/settle', {
  //       operator_id: operator.id,
  //     });

  //     setSelectedOperatorForAdvance({
  //       ...operator,
  //       advances: settledAdvances || []
  //     });
  //     setShowAdvanceHistoryModal(true);
  //   } catch (error) {
  //     console.error('Error fetching advance history:', error);
  //     setSelectedOperatorForAdvance({
  //       ...operator,
  //       advances: []
  //     });
  //     setShowAdvanceHistoryModal(true);
  //   }
  // };

  const openAdvanceHistoryModal = async (operator) => {
    try {
      // const settledAdvances = await getWithParams('api/advances/settle', {
      //   operator_id: operator.id,
      // });

      const [settledAdvances, repaidUnsettled] = await Promise.all([
        getWithParams('api/advances/settle', { operator_id: operator.id }),
        getWithParams('api/advances/repaid-unsettled', { operator_id: operator.id }),
      ]);


      // 🔁 ADAPT backend response to UI format
      // const adaptedAdvances = settledAdvances.map(adv => ({
      //   id: adv.id,
      //   amount: Number(adv.amount),
      //   repaidAmount: Number(adv.repayment_amount || 0),
      //   date: adv.advance_date,
      //   repaidDate: adv.settled_at,
      //   remark: adv.remark,
      //   repaid: true,
      // }));

      const adapt = adv => ({
        id: adv.id,
        amount: Number(adv.amount),
        repaidAmount: Number(adv.repayment_amount || 0),
        date: adv.advance_date,
        repaidDate: adv.updated_at,
        remark: adv.remark,
      });


      // setSelectedOperatorForAdvance({
      //   ...operator,
      //   advances: adaptedAdvances,
      // });

      setSelectedOperatorForAdvance({
        ...operator,
        settledAdvances: settledAdvances.map(a => ({
          ...adapt(a),
          repaid: true,
          isSettled: true,
        })),
        repaidUnsettledAdvances: repaidUnsettled.map(a => ({
          ...adapt(a),
          repaid: true,
          isSettled: false,
        })),
      });

      setShowAdvanceHistoryModal(true);
    } catch (error) {
      console.error(error);
      setSelectedOperatorForAdvance({
        ...operator,
        advances: [],
      });
      setShowAdvanceHistoryModal(true);
    }
  };


  const getPendingAdvances = (operator) => {
    return (operator.advances || []).filter(adv => !adv.repaid);
  };

  // const getSettledAdvances = (operator) => {
  //   return (operator.advances || []).filter(adv => adv.repaid);
  // };

  const getSettledAdvances = (operator) =>
    operator.settledAdvances || [];

  const getRepaidUnsettledAdvances = (operator) =>
    operator.repaidUnsettledAdvances || [];


  const getTotalPendingAdvance = (operator) => {
    return getPendingAdvances(operator).reduce((sum, adv) => sum + Number(adv.amount || 0), 0);
  };


  // const settleSalary = () => {
  //   const month = new Date().toLocaleString("default", { month: "short", year: "numeric" });

  //   const settledExpenses = activeOperator.expenses.filter(e => e.deduct);

  //   const settlement = {
  //     month,
  //     paid: netPayable,
  //     expenses: settledExpenses,
  //     advanceApplied: activeOperator.advance.applyThisMonth
  //       ? netAdvance
  //       : 0
  //   };

  //   const updatedOperators = operators.map(op =>
  //     op.id === activeOperator.id
  //       ? {
  //         ...op,
  //         settlements: [...op.settlements, settlement],
  //         expenses: op.expenses.map(e => ({ ...e, deduct: false })),
  //         advance: { ...op.advance, applyThisMonth: false }
  //       }
  //       : op
  //   );

  //   setOperators(updatedOperators);
  //   setActiveOperator(null);
  // };

  const settleSalary = async () => {
    if (!activeOperator) return;

    // Month format backend expects: YYYY-MM
    const month = new Date().toISOString().slice(0, 7);

    // Collect selected expense IDs
    const expenseIds = activeOperator.expenses
      .filter(e => e.deduct === true)
      .map(e => e.id);

    // Selected advance IDs (you already track this)
    const advanceIds = activeOperator.advances
      .filter(a => a.apply)
      .map(a => a.id);


    try {
      // 1️⃣ Call backend salary settlement API
      await post('api/salary/settle', {
        operator_id: activeOperator.id,
        company_id: user.company_id,
        month: selectedMonth,
        base_salary: activeOperator.payment, // base salary from user
        advance_ids: advanceIds,
        expense_ids: expenseIds,
        remark: 'Salary settled',
      });

      // 2️⃣ Refresh dashboard data
      const [summary, operatorSummary] = await Promise.all([
        getWithParams('api/dashboard/summary', {
          company_id: user.company_id,
          month: month,
        }),
        getWithParams('api/dashboard/operator-summary', {
          company_id: user.company_id,
        }),
      ]);

      setDashboardSummary(summary);
      // setOperators(operatorSummary);

      const safeOperators = operatorSummary.map(op => ({
        ...op,
        settlements: op.settlements || [],
        expenses: op.expenses || [],
        advances: op.advances || []
      }));
      setOperators(safeOperators);
      // 3️⃣ Close modal & reset local state
      setActiveOperator(null);

      // alert('Salary settled successfully');
      showToast('success', 'Salary settled successfully');

    } catch (error) {
      // alert(error.message || 'Failed to settle salary');
      showToast('danger', error.message);

    }
  };

  return (
    <div className="p-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* ---------------- HEADER STATS ---------------- */}
      {/* <CRow className="mb-4">
        <CCol sm={6} md={3}>
          <CCard className="text-center shadow-sm border-0">
            <CCardBody>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4f46e5' }}>
                {operators.length}
              </div>
              <div className="text-muted small">Total Operators</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} md={3}>
          <CCard className="text-center shadow-sm border-0">
            <CCardBody>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
                ₹{operators.reduce((sum, op) => sum + Number(op.payment || 0), 0).toLocaleString()}
              </div>
              <div className="text-muted small">Total Payroll</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} md={3}>
          <CCard className="text-center shadow-sm border-0">
            <CCardBody>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>
                {/* ₹{operators.reduce((sum, op) => sum + (op.advance.taken - op.advance.returned), 0).toLocaleString()} 
                {dashboardSummary.total_advance_pending}
              </div>
              <div className="text-muted small">Total Advances</div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} md={3}>
          <CCard className="text-center shadow-sm border-0">
            <CCardBody>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed' }}>
                {operators.reduce((sum, op) => sum + (op.total_salary_paid > 0 ? 1 : 0), 0)}
                {/* {operators.reduce((sum, op) => sum + op.settlements.length, 0)} 
              </div>
              <div className="text-muted small">Total Settlements</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}

      <CRow className="mb-4 g-3">
        <CCol xs={6} md={4}>
          <CCard className="text-center shadow-sm border-0">
            <CCardBody className="p-3">
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#4f46e5' }}>
                {operators.length}
              </div>
              <div className="text-muted" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                
                {t("LABELS.total_operator_helper")}
                {/* {toggleExpense('LABELS.total_operator_helper')} */}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6} md={4}>
          <CCard className="text-center shadow-sm border-0">
            <CCardBody className="p-3">
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#059669' }}>
                ₹{operators.reduce((sum, op) => sum + Number(op.payment || 0), 0).toLocaleString()}
              </div>
              <div className="text-muted" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                {/* Total Payroll */}
                 {t("LABELS.total_payroll")}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6} md={4}>
          <CCard className="text-center shadow-sm border-0">
            <CCardBody className="p-3">
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#dc2626' }}>
                ₹{dashboardSummary.total_advance_pending}
              </div>
              <div className="text-muted" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                {/* Total Advances */}
                 {t("LABELS.total_advane")}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        {/* <CCol xs={6} md={3}>
          <CCard className="text-center shadow-sm border-0">
            <CCardBody className="p-3">
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#7c3aed' }}>
                {operators.reduce((sum, op) => sum + (op.total_salary_paid > 0 ? 1 : 0), 0)}
              </div>
              <div className="text-muted" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Total Settlements
              </div>
            </CCardBody>
          </CCard>
        </CCol> */}
      </CRow>


      {/* Calander to choose salary  */}
      {/* <input
        type="month"
        value={selectedMonth}
        onChange={e => setSelectedMonth(e.target.value)}
      /> */}
      {/* <input
  type="text"
  className="form-control"
  placeholder="Search operator by name..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
{searchQuery && (
  <button onClick={() => setSearchQuery('')}>✕</button>
)} */}

      <div className="position-relative" style={{ maxWidth: '400px', paddingBottom: '6px', marginBottom:'2px'}}>
        <input
          type="text"
          className="form-control pe-5"
          placeholder="Search operator/helper by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            borderRadius: '20px',
            paddingLeft: '1rem',
            paddingRight: '2.5rem'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              color: '#6c757d',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="hover-effect"
          >
            ✕
          </button>
        )}
      </div>


      {/* ---------------- OPERATOR TABLE ---------------- */}

      <CCard className="shadow-sm border-0">
        <CCardHeader style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold"> {t("LABELS.operator_helper_salary")} </h5>
            <CBadge color="light" className="text-dark">{filteredOperators.length} {t("LABELS.operator_helper")}</CBadge>
          </div>
        </CCardHeader>
        <CCardBody className="p-0">
          <div style={{
            maxHeight: '500px',
            overflowY: 'auto',
            overflowX: 'auto',
          }}
          >
            <CTable hover className="mb-0" style={{ maxHeight: '500px', minHeight: 'auto' }}>
              <CTableHead style={{ background: '#f3f4f6' }}>
                <CTableRow>
                  <CTableHeaderCell className="fw-bold">Operator/Helper Name</CTableHeaderCell>
                  <CTableHeaderCell className="fw-bold">Base Salary</CTableHeaderCell>
                  <CTableHeaderCell className="fw-bold">Pending Expenses</CTableHeaderCell>
                  <CTableHeaderCell className="fw-bold">Net Advance</CTableHeaderCell>
                  {/* <CTableHeaderCell className="fw-bold">Settlements</CTableHeaderCell> */}
                  <CTableHeaderCell className="fw-bold text-center">Advance</CTableHeaderCell>
                  <CTableHeaderCell className="fw-bold text-center">History</CTableHeaderCell>
                  <CTableHeaderCell className="fw-bold text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredOperators.map(op => {
                  // const pendingExpenses = op.expenses.filter(e => e.deduct).reduce((s, e) => s + e.amount, 0);
                  const pendingExpenses = op.pending_expenses || 0;

                  const advanceBalance = op.pending_advances || 0;
                  const baseSalary = op.payment || 0;

                  return (
                    <CTableRow key={op.id} style={{ cursor: 'pointer' }}>
                      <CTableDataCell>
                        <div className="fw-bold">{op.name}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {/* <span className="fw-bold text-success">₹{op.baseSalary.toLocaleString()}</span> */}
                        <span className="fw-bold text-success">₹{baseSalary}</span>
                      </CTableDataCell>
                      <CTableDataCell>
                        {pendingExpenses > 0 ? (
                          <CBadge color="warning">₹{pendingExpenses}</CBadge>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {advanceBalance > 0 ? (
                          <CBadge color="danger">₹{advanceBalance}</CBadge>
                        ) : (
                          <CBadge color="success">Cleared</CBadge>
                        )}
                      </CTableDataCell>
                      {/* <CTableDataCell>
                        <CBadge color="info">{op.settlements.length} months</CBadge>
                      </CTableDataCell> */}
                      {/* <CTableDataCell className="text-center">
                        <CButton
                          color="primary"
                          size="sm"
                          onClick={() => setActiveOperator({ ...op })}
                          style={{ borderRadius: '20px' }}
                        >
                          Manage
                        </CButton>
                      </CTableDataCell> */}
                      <CTableDataCell className="text-center">
                        <CButton
                          color="warning"
                          size="sm"
                          onClick={() => openAdvanceModal(op)}
                          style={{ borderRadius: '20px' }}
                        >
                          Add Advance
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="info"
                          size="sm"
                          onClick={() => openAdvanceHistoryModal(op)}
                          style={{ borderRadius: '20px' }}
                        // disabled={getSettledAdvances(op).length === 0}
                        >
                          View History
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="primary"
                          size="sm"
                          onClick={() => openManageModal(op)}
                          style={{ borderRadius: '20px' }}
                        >
                          Manage
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* ---------------- MODAL ---------------- */}

      {activeOperator && (
        <CModal visible size="xl" onClose={() => setActiveOperator(null)} backdrop="static">
          <CModalHeader style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <h5 className="mb-0 fw-bold">Salary Settlement — {activeOperator.name}</h5>
          </CModalHeader>

          <CModalBody className="p-4">
            {/* SUMMARY CARDS */}
            <CRow className="mb-4">
              <CCol md={3}>
                <CCard className="text-center border-0 shadow-sm">
                  <CCardBody>
                    <div className="text-muted small mb-1">Base Salary</div>
                    <div className="h4 fw-bold text-primary mb-0">₹{activeOperator.payment}</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={3}>
                <CCard className="text-center border-0 shadow-sm">
                  <CCardBody>
                    <div className="text-muted small mb-1">Expenses</div>
                    <div className="h4 fw-bold text-danger mb-0">- ₹{expenseTotal}</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={3}>
                <CCard className="text-center border-0 shadow-sm">
                  <CCardBody>
                    <div className="text-muted small mb-1">Advance Adjustment</div>
                    <div className="h4 fw-bold text-warning mb-0">- ₹{netAdvance}</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={3}>
                <CCard className="text-center border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <CCardBody>
                    <div className="text-white small mb-1">Net Payable</div>
                    <div className="h4 fw-bold text-white mb-0">₹{netPayable}</div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* EXPENSES */}
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              overflowX: 'auto',
            }}>
              <CCard className="mb-4 border-0 shadow-sm">
                <CCardHeader style={{ background: '#f3f4f6' }}>
                  <h6 className="mb-0 fw-bold">Expenses for This Month</h6>
                </CCardHeader>
                <CCardBody className="p-0">
                  <CTable className="mb-0">
                    <CTableHead style={{ background: '#fafafa' }}>
                      <CTableRow>
                        <CTableHeaderCell>Expense Type</CTableHeaderCell>
                        <CTableHeaderCell>Amount</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Deduct This Month</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {activeOperator.expenses.map(e => (
                        <CTableRow key={e.id} style={{ background: e.deduct ? '#fef3c7' : 'white' }}>
                          <CTableDataCell>
                            <span className="fw-semibold">{e.label}</span>
                          </CTableDataCell>
                          <CTableDataCell>
                            <span className="fw-bold text-danger">₹{e.amount}</span>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CFormCheck
                              checked={e.deduct}
                              onChange={() => toggleExpense(e.id)}
                              style={{ transform: 'scale(1.2)' }}
                            />
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </div>

            {/* ADVANCES */}
            <CCard className="mb-4 border-0 shadow-sm">
              <div style={{
                maxHeight: '200px',
                overflowY: 'auto',
                overflowX: 'auto',
              }}>
                <CCardHeader style={{ background: '#f3f4f6' }}>
                  <h6 className="mb-0 fw-bold">Advances</h6>
                </CCardHeader>
                <CCardBody className="p-0">
                  <CTable className="mb-0">
                    <CTableHead style={{ background: '#fafafa' }}>
                      <CTableRow>
                        <CTableHeaderCell>Date</CTableHeaderCell>
                        <CTableHeaderCell>Advance</CTableHeaderCell>
                        <CTableHeaderCell>Repaid</CTableHeaderCell>
                        <CTableHeaderCell>Balance</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">
                          Deduct This Month
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>

                    <CTableBody>
                      {activeOperator.advances.length === 0 ? (
                        <CTableRow>
                          <CTableDataCell colSpan={5} className="text-center text-muted">
                            No pending advances
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        activeOperator.advances.map(a => (
                          <CTableRow
                            key={a.id}
                            style={{ background: a.apply ? '#fef3c7' : 'white' }}
                          >
                            <CTableDataCell>
                              {new Date(a.date).toLocaleDateString('en-IN')}
                            </CTableDataCell>

                            <CTableDataCell className="fw-bold text-danger">
                              ₹{Number(a.amount || 0).toLocaleString()}
                            </CTableDataCell>

                            <CTableDataCell className="fw-bold text-success">
                              ₹{Number(a.repaidAmount || 0).toLocaleString()}
                            </CTableDataCell>

                            <CTableDataCell className="fw-bold">
                              ₹{Number(a.balance || 0).toLocaleString()}
                            </CTableDataCell>


                            <CTableDataCell className="text-center">
                              <CFormCheck
                                checked={a.apply}
                                onChange={() =>
                                  setActiveOperator(prev => ({
                                    ...prev,
                                    advances: prev.advances.map(x =>
                                      x.id === a.id ? { ...x, apply: !x.apply } : x
                                    )
                                  }))
                                }
                                style={{ transform: 'scale(1.2)' }}
                              />
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      )}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </div>
            </CCard>


          </CModalBody>

          <CModalFooter>
            <CButton
              color="success"
              onClick={settleSalary}
              style={{ borderRadius: '20px', paddingLeft: '2rem', paddingRight: '2rem' }}
            >
              Settle Salary (₹{netPayable})
            </CButton>
            <CButton
              color="secondary"
              onClick={() => setActiveOperator(null)}
              style={{ borderRadius: '20px' }}
            >
              Cancel
            </CButton>
          </CModalFooter>

          {/* HISTORY */}

          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            overflowX: 'auto',
          }}>
            <CCard className="border-0 shadow-sm">
              <CCardHeader style={{ background: '#f3f4f6' }}>
                <h6 className="mb-0 fw-bold">Settlement History</h6>
              </CCardHeader>
              <CCardBody>
                {activeOperator.settlements.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <div style={{ fontSize: '3rem', opacity: 0.3 }}>📋</div>
                    <p>No settlements recorded yet</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <CTable hover className="mb-0">
                      <CTableHead style={{ background: '#fafafa' }}>
                        <CTableRow>
                          <CTableHeaderCell>Month</CTableHeaderCell>
                          <CTableHeaderCell>Amount Paid</CTableHeaderCell>
                          <CTableHeaderCell>Expenses Deducted</CTableHeaderCell>
                          <CTableHeaderCell>Advance Applied</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {activeOperator.settlements.map((s, i) => (
                          <CTableRow key={i}>
                            <CTableDataCell>
                              <CBadge color="primary" style={{ fontSize: '0.9rem' }}>{s.month}</CBadge>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="fw-bold text-success" style={{ fontSize: '1.1rem' }}>₹{(s.paid || 0).toLocaleString()}</span>
                            </CTableDataCell>
                            <CTableDataCell>
                              {s.expenses > 0 ? (
                                <div className="d-flex flex-wrap gap-1">
                                  {/* {s.expenses.map(e => ( */}
                                    <CBadge  color="warning" className="text-dark">
                                       ₹{s.expenses}
                                    </CBadge>
                                  {/* ))} */}
                                </div>
                              ) : (
                                <span className="text-muted">None</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              {s.advanceApplied > 0 ? (
                                <CBadge color="danger">₹{s.advanceApplied}</CBadge>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </div>

        </CModal>
      )}
      {/* ---------------- ADVANCE MODAL ---------------- */}
      {showAdvanceModal && selectedOperatorForAdvance && (
        <CModal visible size="lg" onClose={() => {
          setShowAdvanceModal(false);
          setSelectedOperatorForAdvance(null);
          setNewAdvanceAmount('');
          setNewAdvanceDate(new Date().toISOString().split('T')[0]);
          setNewAdvanceRemark('');
          setRepaymentAmounts({}); // Clear all repayment amounts
        }} backdrop="static">
          <CModalHeader style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
            <h5 className="mb-0 fw-bold">Advance Management — {selectedOperatorForAdvance.name}</h5>
          </CModalHeader>

          {/* <CModalBody className="p-4">
            {/* Add New Advance 
            <CCard className="mb-4 border-0 shadow-sm">
              <CCardHeader style={{ background: '#f3f4f6' }}>
                <h6 className="mb-0 fw-bold">Add New Advance</h6>
              </CCardHeader>
              <CCardBody>
                <CRow className="g-3">
                  <CCol md={4}>
                    <label className="form-label fw-semibold">Amount <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter amount"
                      value={newAdvanceAmount}
                      onChange={(e) => setNewAdvanceAmount(e.target.value)}
                      min="0"
                    />
                  </CCol>
                  <CCol md={4}>
                    <label className="form-label fw-semibold">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newAdvanceDate}
                      onChange={(e) => setNewAdvanceDate(e.target.value)}
                    />
                  </CCol>
                  <CCol md={4}>
                    <label className="form-label fw-semibold">Remark</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Optional remark"
                      value={newAdvanceRemark}
                      onChange={(e) => setNewAdvanceRemark(e.target.value)}
                    />
                  </CCol>
                </CRow>
                <div className="mt-3">
                  <CButton
                    color="success"
                    onClick={handleAddAdvance}
                    style={{ borderRadius: '20px' }}
                  >
                    Add Advance
                  </CButton>
                </div>
              </CCardBody>
            </CCard>

            {/* Pending Advances 
            <CCard className="border-0 shadow-sm">
              <CCardHeader style={{ background: '#fef3c7' }}>
                <h6 className="mb-0 fw-bold text-warning">
                  Pending Advances (Total: ₹{getTotalPendingAdvance(selectedOperatorForAdvance).toLocaleString()})
                </h6>
              </CCardHeader>
              <CCardBody className="p-0">
                {getPendingAdvances(selectedOperatorForAdvance).length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <div style={{ fontSize: '3rem', opacity: 0.3 }}>💰</div>
                    <p>No pending advances</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <CTable hover className="mb-0">
                      <CTableHead style={{ background: '#fafafa' }}>
                        <CTableRow>
                          <CTableHeaderCell>Date</CTableHeaderCell>
                          <CTableHeaderCell>Amount</CTableHeaderCell>
                          <CTableHeaderCell>Remark</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {getPendingAdvances(selectedOperatorForAdvance).map(adv => (
                          <CTableRow key={adv.id}>
                            <CTableDataCell>
                              <span className="fw-semibold">
                                {new Date(adv.date).toLocaleDateString('en-IN')}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="fw-bold text-danger" style={{ fontSize: '1.1rem' }}>
                                ₹{adv.amount.toLocaleString()}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              {adv.remark || <span className="text-muted">-</span>}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CButton
                                color="success"
                                size="sm"
                                onClick={() => handleMarkAdvanceRepaid(selectedOperatorForAdvance.id, adv.id)}
                                style={{ borderRadius: '20px' }}
                              >
                                Mark as Repaid
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                )}
              </CCardBody>
            </CCard>

            <CTable hover className="mb-0">
              <CTableHead style={{ background: '#fafafa' }}>
                <CTableRow>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Remark</CTableHeaderCell>
                  <CTableHeaderCell>Repayment Amount</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {getPendingAdvances(selectedOperatorForAdvance).map(adv => (
                  <CTableRow key={adv.id}>
                    <CTableDataCell>
                      <span className="fw-semibold">
                        {new Date(adv.date).toLocaleDateString('en-IN')}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className="fw-bold text-danger" style={{ fontSize: '1.1rem' }}>
                        ₹{adv.amount.toLocaleString()}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      {adv.remark || <span className="text-muted">-</span>}
                    </CTableDataCell>
                    <CTableDataCell>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Enter amount"
                        value={repaymentAmounts[adv.id] || ''}
                        onChange={(e) => handleRepaymentAmountChange(adv.id, e.target.value)}
                        min="0"
                        max={adv.amount}
                        style={{ width: '150px' }}
                      />
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="success"
                        size="sm"
                        onClick={() => handleMarkAdvanceRepaid(selectedOperatorForAdvance.id, adv.id)}
                        style={{ borderRadius: '20px' }}
                        disabled={!repaymentAmounts[adv.id] || parseFloat(repaymentAmounts[adv.id]) <= 0}
                      >
                        Settle
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

          </CModalBody> */}

          <CModalBody className="p-4">
            {/* Add New Advance */}
            <CCard className="mb-4 border-0 shadow-sm">
              <CCardHeader style={{ background: '#f3f4f6' }}>
                <h6 className="mb-0 fw-bold">Add New Advance</h6>
              </CCardHeader>
              <CCardBody>
                <CRow className="g-3">
                  <CCol md={4}>
                    <label className="form-label fw-semibold">Amount <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter amount"
                      value={newAdvanceAmount}
                      onChange={(e) => setNewAdvanceAmount(e.target.value)}
                      min="0"
                    />
                  </CCol>
                  <CCol md={4}>
                    <label className="form-label fw-semibold">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newAdvanceDate}
                      onChange={(e) => setNewAdvanceDate(e.target.value)}
                    />
                  </CCol>
                  <CCol md={4}>
                    <label className="form-label fw-semibold">Remark</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Optional remark"
                      value={newAdvanceRemark}
                      onChange={(e) => setNewAdvanceRemark(e.target.value)}
                    />
                  </CCol>
                </CRow>
                <div className="mt-3">
                  <CButton
                    color="success"
                    onClick={handleAddAdvance}
                    style={{ borderRadius: '20px' }}
                  >
                    Add Advance
                  </CButton>
                </div>
              </CCardBody>
            </CCard>

            {/* Pending Advances */}
            {/* <CModal visible size="lg" onClose={() => {
              setShowAdvanceHistoryModal(false);
              setSelectedOperatorForAdvance(null);
            }}></CModal> */}

            <CCard className="border-0 shadow-sm">
              <CCardHeader style={{ background: '#fef3c7' }}>
                <h6 className="mb-0 fw-bold text-warning">
                  Pending Advances (Total: ₹{getTotalPendingAdvance(selectedOperatorForAdvance)})
                </h6>
              </CCardHeader>
              <CCardBody className="p-0">
                {getPendingAdvances(selectedOperatorForAdvance).length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <div style={{ fontSize: '3rem', opacity: 0.3 }}>💰</div>
                    <p>No pending advances</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <CTable hover className="mb-0">
                      <CTableHead style={{ background: '#fafafa' }}>
                        <CTableRow>
                          <CTableHeaderCell>Date</CTableHeaderCell>
                          <CTableHeaderCell>Amount</CTableHeaderCell>
                          <CTableHeaderCell>Remark</CTableHeaderCell>
                          <CTableHeaderCell>Repayment Amount</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {getPendingAdvances(selectedOperatorForAdvance).map(adv => (
                          <CTableRow key={adv.id}>
                            <CTableDataCell>
                              <span className="fw-semibold">
                                {new Date(adv.advance_date || adv.date).toLocaleDateString('en-IN')}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="fw-bold text-danger" style={{ fontSize: '1.1rem' }}>
                                ₹{adv.amount.toLocaleString()}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              {adv.remark || <span className="text-muted">-</span>}
                            </CTableDataCell>
                            <CTableDataCell>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="Enter amount"
                                value={repaymentAmounts[adv.id] || ''}
                                // onChange={(e) => handleRepaymentAmountChange(adv.id, e.target.value)}
                                onChange={(e) => handleRepaymentAmountChange(adv.id, e.target.value, adv.amount)}
                                min="0"
                                max={adv.amount}
                                style={{ width: '150px' }}
                              />
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CButton
                                color="success"
                                size="sm"
                                onClick={() => handleMarkAdvanceRepaid(selectedOperatorForAdvance.id, adv.id)}
                                style={{ borderRadius: '20px' }}
                                disabled={!repaymentAmounts[adv.id] || parseFloat(repaymentAmounts[adv.id]) < 0}
                              >
                                Settle
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CModalBody>


          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setShowAdvanceModal(false);
                setSelectedOperatorForAdvance(null);
              }}
              style={{ borderRadius: '20px' }}
            >
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {/* ---------------- ADVANCE HISTORY MODAL ---------------- */}
      {showAdvanceHistoryModal && selectedOperatorForAdvance && (
        <CModal visible size="lg" onClose={() => {
          setShowAdvanceHistoryModal(false);
          setSelectedOperatorForAdvance(null);
        }}>


          <CModalHeader style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
            <h5 className="mb-0 fw-bold">Advance History — {selectedOperatorForAdvance.name}</h5>
          </CModalHeader>
          {/* here we will show history of not settled but repaid advances  */}
          <CModalBody>
            <CCard className="border-0 shadow-sm">
              <CCardHeader style={{ background: '#dbeafe' }}>
                <h6 className="mb-0 fw-bold text-primary">
                  Unsettled Advances
                </h6>
              </CCardHeader>
              <CCardBody className="p-0">
                {getRepaidUnsettledAdvances(selectedOperatorForAdvance).length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <div style={{ fontSize: '3rem', opacity: 0.3 }}>📋</div>
                    <p>No settled advances</p>
                  </div>
                ) : (
                  <div style={{
                    maxHeight: '250px',
                    overflowY: 'auto',
                    overflowX: 'auto',
                  }}>
                    <CTable hover className="mb-0">
                      <CTableHead style={{ background: '#fafafa' }}>
                        <CTableRow>
                          <CTableHeaderCell>Advance Date</CTableHeaderCell>
                          <CTableHeaderCell>Advance Amount</CTableHeaderCell>
                          <CTableHeaderCell>Repaid Amount</CTableHeaderCell>
                          <CTableHeaderCell>Remark</CTableHeaderCell>
                          <CTableHeaderCell>Repaid Date</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {getRepaidUnsettledAdvances(selectedOperatorForAdvance).map(adv => (
                          <CTableRow key={adv.id}>
                            <CTableDataCell>
                              <span className="fw-semibold">
                                {adv.date
                                  ? new Date(adv.date).toLocaleDateString('en-IN')
                                  : '-'}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="fw-bold text-danger" style={{ fontSize: '1.1rem' }}>
                                ₹{(adv.amount || 0).toLocaleString()}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="fw-bold text-success" style={{ fontSize: '1.1rem' }}>
                                ₹{(adv.repaidAmount || 0).toLocaleString()}
                              </span>
                              {/* {adv.repaidAmount < adv.amount && (
                                <CBadge color="warning" className="ms-2">
                                  Partial: ₹{(adv.amount - adv.repaidAmount).toLocaleString()} pending
                                </CBadge>
                              )} */}
                            </CTableDataCell>
                            <CTableDataCell>
                              {adv.remark || <span className="text-muted">-</span>}
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="fw-semibold text-success">
                                {adv.repaidDate ? new Date(adv.repaidDate).toLocaleDateString('en-IN') : '-'}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CBadge color={adv.repaidAmount >= adv.amount ? 'success' : 'warning'}>
                                {adv.repaidAmount >= adv.amount ? 'Fully Repaid' : 'Partially Repaid'}
                              </CBadge>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CModalBody>

          {/* <CModalHeader style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
            <h5 className="mb-0 fw-bold">Advance History — {selectedOperatorForAdvance.name}</h5>
          </CModalHeader> */}

          <CModalBody className="p-4">
            <CCard className="border-0 shadow-sm">
              <CCardHeader style={{ background: '#dbeafe' }}>
                <h6 className="mb-0 fw-bold text-primary">
                  Settled Advances (Total: ₹{getSettledAdvances(selectedOperatorForAdvance).reduce((sum, adv) => sum + adv.amount, 0).toLocaleString()})
                </h6>
              </CCardHeader>
              <CCardBody className="p-0">
                {getSettledAdvances(selectedOperatorForAdvance).length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <div style={{ fontSize: '3rem', opacity: 0.3 }}>📋</div>
                    <p>No settled advances</p>
                  </div>
                ) : (
                  <div style={{
                    maxHeight: '250px',
                    overflowY: 'auto',
                    overflowX: 'auto',
                  }}>
                    <CTable hover className="mb-0">
                      <CTableHead style={{ background: '#fafafa' }}>
                        <CTableRow>
                          <CTableHeaderCell>Advance Date</CTableHeaderCell>
                          <CTableHeaderCell>Advance Amount</CTableHeaderCell>
                          <CTableHeaderCell>Repaid Amount</CTableHeaderCell>
                          <CTableHeaderCell>Remark</CTableHeaderCell>
                          <CTableHeaderCell>Repaid Date</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {getSettledAdvances(selectedOperatorForAdvance).map(adv => (
                          <CTableRow key={adv.id}>
                            <CTableDataCell>
                              <span className="fw-semibold">
                                {new Date(adv.date).toLocaleDateString('en-IN')}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="fw-bold text-danger" style={{ fontSize: '1.1rem' }}>
                                ₹{adv.amount.toLocaleString()}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="fw-bold text-success" style={{ fontSize: '1.1rem' }}>
                                ₹{(adv.repaidAmount || 0).toLocaleString()}
                              </span>
                              {/* {adv.repaidAmount < adv.amount && (
                                <CBadge color="warning" className="ms-2">
                                  Partial: ₹{(adv.amount - adv.repaidAmount).toLocaleString()} pending
                                </CBadge>
                              )} */}
                            </CTableDataCell>
                            <CTableDataCell>
                              {adv.remark || <span className="text-muted">-</span>}
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="fw-semibold text-success">
                                {adv.repaidDate ? new Date(adv.repaidDate).toLocaleDateString('en-IN') : '-'}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CBadge color={adv.repaidAmount >= adv.amount ? 'success' : 'warning'}>
                                {adv.repaidAmount >= adv.amount ? 'Fully Repaid' : 'Partially Repaid'}
                              </CBadge>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                )}
              </CCardBody>
            </CCard>


          </CModalBody>

          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setShowAdvanceHistoryModal(false);
                setSelectedOperatorForAdvance(null);
              }}
              style={{ borderRadius: '20px' }}
            >
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  );
};

export default OperatorSalary;