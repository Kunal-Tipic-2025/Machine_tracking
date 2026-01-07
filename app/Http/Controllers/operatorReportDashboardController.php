<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SalaryPayment;
use App\Models\AdvanceRecord;
use App\Models\OperatorExpense;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OperatorReportDashboardController extends Controller
{
    /**
     * MAIN DASHBOARD SUMMARY
     */
    public function summary(Request $request)
    {
        $month = $request->get('month', now()->format('Y-m'));
        $companyId = $request->company_id;

        $totalSalaryPaid = SalaryPayment::where('company_id', $companyId)
            ->where('month', $month)
            ->sum('net_salary');

        $totalAdvancePending = AdvanceRecord::where('is_settle', false)
            ->whereIn('operator_id', function ($q) use ($companyId) {
                $q->select('id')
                    ->from('users')
                    ->where('company_id', $companyId)
                    ->where('type', 2);
            })
            ->sum('amount');

        $totalExpensePending = OperatorExpense::where('company_id', $companyId)
            ->where('is_settle', false)
            ->sum('total_amount');

        return response()->json([
            'month' => $month,
            'total_salary_paid' => $totalSalaryPaid,
            'total_advance_pending' => $totalAdvancePending,
            'total_expense_pending' => $totalExpensePending,
        ]);
    }

    /**
     * OPERATOR-WISE SUMMARY
     */
    public function operatorSummary(Request $request)
    {
        $companyId = $request->company_id;

        // $operators = User::where('company_id', $companyId)
        //     ->where('type', 2)
        //     ->withCount([
        //         'salaryPayments as total_salary_paid' => function ($q) {
        //             $q->select(DB::raw('COALESCE(SUM(net_salary),0)'));
        //         },
        //         'advances as pending_advances' => function ($q) {
        //             $q->where('is_settle', false);
        //         },
        //         'expenses as pending_expenses' => function ($q) {
        //             $q->where('is_settle', false);
        //         },
        //     ])
        //     ->get(['id', 'name']);



        $operators = User::where('company_id', $companyId)
            ->where('type', 2)
            ->withSum([
                'advances as pending_advances' => function ($q) {
                    $q->where('is_settle', false);
                }
            ], DB::raw('amount - COALESCE(repayment_amount, 0)'))

            ->withSum([
                'expenses as pending_expenses' => function ($q) {
                    $q->where('is_settle', false);
                }
            ], 'total_amount')
            ->withSum('salaryPayments as total_salary_paid', 'net_salary')
            ->get(['id', 'name']);


        return response()->json($operators);
    }

    /**
     * RECENT SALARY PAYMENTS
     */
    public function recentSalaries(Request $request)
    {
        $companyId = $request->company_id;

        $salaries = SalaryPayment::where('company_id', $companyId)
            ->with('operator:id,name')
            ->latest('paid_at')
            ->limit(10)
            ->get();

        return response()->json($salaries);
    }


    //salary history of operator
    public function salaryHistory(Request $request)
    {
        $request->validate([
            'operator_id' => 'required|integer|exists:users,id',
            'company_id'  => 'required|integer',
            'month'       => 'nullable|string|size:7',
            'from_date'   => 'nullable|date',
            'to_date'     => 'nullable|date',
        ]);

        $query = SalaryPayment::where('operator_id', $request->operator_id)
            ->where('company_id', $request->company_id)
            ->with([
                'advances:id,operator_id,amount,repayment_amount,settled_in_salary_id',
                'expenses:id,operator_id,total_amount,settled_in_salary_id'
            ])
            ->orderBy('month', 'desc');

        // Optional filters
        if ($request->month) {
            $query->where('month', $request->month);
        }

        if ($request->from_date && $request->to_date) {
            $query->whereBetween('paid_at', [
                $request->from_date,
                $request->to_date
            ]);
        }

        $salaryHistory = $query->paginate(10);

        return response()->json([
            'operator' => User::select('id', 'name', 'mobile')
                ->find($request->operator_id),
            'salary_history' => $salaryHistory
        ]);
    }
}
