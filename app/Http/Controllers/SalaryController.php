<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\SalaryPayment;
use App\Models\AdvanceRecord;
use App\Models\OperatorExpense;
use Carbon\Carbon;

class SalaryController extends Controller
{

//Salary is recorded once per operator per month
// Selected advances are settled
// Selected expenses are settled
// Net salary is calculated correctly
// No double payment possible
// If anything fails → rollback

    public function settle(Request $request)
    {
        $request->validate([
            'operator_id'   => 'required|integer|exists:users,id',
            'company_id'    => 'required|integer',
            'month'         => 'required|string|size:7',
            'base_salary'   => 'required|numeric|min:0',
            'advance_ids'   => 'array',
            'expense_ids'   => 'array',
        ]);

        // 🔒 Prevent double salary for same month
        $alreadyPaid = SalaryPayment::where('operator_id', $request->operator_id)
            ->where('month', $request->month)
            ->exists();

        if ($alreadyPaid) {
            return response()->json([
                'message' => 'Salary already settled for this month'
            ], 409);
        }

        return DB::transaction(function () use ($request) {

            // 1️⃣ Calculate totals
            $totalAdvance = AdvanceRecord::whereIn('id', $request->advance_ids ?? [])
                ->where('operator_id', $request->operator_id)
                ->where('is_settle', false)
                ->sum(DB::raw('amount - repayment_amount'));

            $totalExpense = OperatorExpense::whereIn('id', $request->expense_ids ?? [])
                ->where('operator_id', $request->operator_id)
                ->where('is_settle', false)
                ->sum('total_amount');

            $netSalary = $request->base_salary - $totalAdvance - $totalExpense;

            if ($netSalary < 0) {
                abort(422, 'Net salary cannot be negative');
            }

            // 2️⃣ Create salary payment
            $salaryPayment = SalaryPayment::create([
                'operator_id' => $request->operator_id,
                'company_id' => $request->company_id,
                'month' => $request->month,
                'base_salary' => $request->base_salary,
                'total_expense_deducted' => $totalExpense,
                'total_advance_deducted' => $totalAdvance,
                'net_salary' => $netSalary,
                'paid_at' => now(),
                'remark' => $request->remark,
            ]);

            // 3️⃣ Settle advances
            AdvanceRecord::whereIn('id', $request->advance_ids ?? [])
                ->update([
                    'is_settle' => true,
                    'repayment_amount' => DB::raw('amount'),
                    'settled_in_salary_id' => $salaryPayment->id,
                    'settled_at' => now(),
                ]);

            // 4️⃣ Settle expenses
            OperatorExpense::whereIn('id', $request->expense_ids ?? [])
                ->update([
                    'is_settle' => true,
                    'settled_in_salary_id' => $salaryPayment->id,
                    'settled_at' => now(),
                ]);

            return response()->json([
                'message' => 'Salary settled successfully',
                'data' => $salaryPayment
            ], 201);
        });
    }
}
