<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\ExpenseSummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Helpers\ImageCompressor;
use App\Models\ExpenseType;
use App\Models\OperatorExpense;
use Carbon\Carbon;
use Illuminate\Validation\Rule as ValidationRule;
use Livewire\Attributes\Rule;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $companyId = $request->query('company_id');   // ✅ from frontend
        $userType = $user?->type; // null-safe when unauthenticated
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');
        $customerId = $request->query('customerId');
        $machineId = $request->query('machineId'); // ✅ New Filter
        $expenseId = $request->query('expenseId'); // ✅ New Filter
        $perPage = $request->query('perPage', 50);
        $cursor = $request->query('cursor');

        try {
            // If user is authenticated, enforce allowed user types.
            if ($user && !in_array($userType, [0, 1, 2])) {
                return response()->json(['error' => 'Not Allowed'], 403);
            }

            if (!$companyId) {
                return response()->json(['error' => 'company_id is required'], 422);
            }

            $query = Expense::with(['expenseType:id,name,expense_category', 'project:id,project_name,customer_name', 'machine:id,machine_name'])
                ->where('company_id', $companyId);

            $summary = null;

            // Apply Filters
            if ($machineId) {
                $query->where('machine_id', $machineId);
            }
            if ($expenseId) {
                $query->where('expense_id', $expenseId);
            }

            if ($customerId) {
                $query->where('project_id', $customerId);
                 // Note: Logic suggests custom summary for customer filter, but we should respect dates too if provided?
                 // Current logic prioritizes customerId over dates for summary?
                 // Let's stick to the structure but allow combining dates + machine + expense.
            }
            
            if ($startDate && $endDate) {
                $query->whereBetween('expense_date', [$startDate, $endDate]);
                
                // Summary Calculation
                // If we have specific filters (machine, expense, customer), the pre-calculated ExpenseSummary (grouped by date) is not sufficient.
                // We need to calculate sum from the filtered expenses.
                if ($machineId || $expenseId || $customerId) {
                     $summary = (clone $query)->selectRaw('SUM(total_price) as totalExpense')->first();
                } else {
                    $summary = DB::table('expense_summaries')
                        ->where('company_id', $companyId)
                        ->whereBetween('expense_date', [$startDate, $endDate])
                        ->selectRaw('SUM(total_expense) as totalExpense')
                        ->first();
                }
            } elseif ($customerId) {
                  // Fallback for customer only (no dates)
                  $summary = Expense::where('company_id', $companyId)
                    ->where('project_id', $customerId)
                    ->selectRaw('SUM(total_price) as totalExpense')
                    ->first();
            } else {
                return response()->json(['error' => 'Either Dates or CustomerId must be provided'], 422);
            }

            $query->orderBy('id', 'desc');
            $expenses = $query->cursorPaginate($perPage, ['*'], 'cursor', $cursor);

            $data = collect($expenses->items())->map(function ($expense) {
                return array_merge($expense->toArray(), [
                    // Use the Project's customer_name field explicitly
                    'customer_name' => $expense->project->customer_name ?? null,
                    'customer_address' => null,
                    'machine_name' => $expense->machine->machine_name ?? null, // Map machine name
                ]);
            });

            return response()->json([
                'data' => $data,
                'next_cursor' => $expenses->nextCursor()?->encode(),
                'has_more_pages' => $expenses->hasMorePages(),
                'totalExpense' => $summary->totalExpense ?? 0,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function index1(Request $request)
    {
        try {
            $companyId = $request->query('company_id');

            if (!$companyId) {
                return response()->json(['error' => 'company_id is required'], 422);
            }

            $expenses = Expense::with([
                'expenseType:id,name,expense_category',
                'project:id,project_name'
            ])
                ->where('company_id', $companyId)
                ->orderBy('id', 'desc')
                ->get();

            return response()->json([
                $expenses,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }



    // public function store(Request $request)
    // {
    //     $user = Auth::user();

    //     $request->validate([
    //         'company_id' => 'required|integer',
    //         'expense_date' => 'required|date',
    //         'price' => 'required|numeric|min:0',
    //         'qty' => 'required|numeric|min:0',
    //         'total_price' => 'required|numeric|min:0',
    //         'contact' => 'nullable|numeric',
    //         'payment_by' => 'nullable|string',
    //         'payment_type' => 'nullable|string',
    //         'pending_amount' => 'nullable|numeric',
    //         'show' => 'nullable|boolean',
    //         'isGst' => 'nullable|boolean',
    //         'photoAvailable' => 'nullable|boolean',
    //         'photo_url' => 'nullable|file|mimes:jpg,jpeg,png',
    //         'photo_remark' => 'nullable|string',
    //         'bank_name' => 'nullable|string',
    //         'acc_number' => 'nullable|string',
    //         'ifsc' => 'nullable|string',
    //         'aadhar' => 'nullable|string',
    //         'pan' => 'nullable|string',
    //         'transaction_id' => 'nullable|string',
    //         'machine_id' => 'nullable|string',
    //         'customer_id' => 'nullable|integer',
    //     ]);

    //     $photoPath = null;
    //     if ($request->hasFile('photo_url')) {
    //         $photoPath = ImageCompressor::compressAndSave(
    //             $request->file('photo_url'),
    //             'bill',
    //             1024
    //         );
    //     }

    //     $expense = Expense::create([
    //         'project_id' => $request->project_id,
    //         'name' => $request->name,
    //         'expense_date' => $request->expense_date,
    //         'price' => $request->price,
    //         'qty' => $request->qty,
    //         'total_price' => $request->total_price,
    //         'expense_id' => $request->expense_id,
    //         'contact' => $request->contact,
    //         'payment_by' => $request->payment_by,
    //         'payment_type' => $request->payment_type,
    //         'pending_amount' => $request->pending_amount,
    //         'isGst' => $request->isGst,
    //         'photoAvailable' => $request->photoAvailable,
    //         'photo_url' => $photoPath,
    //         'photo_remark' => $request->photo_remark,
    //         'bank_name' => $request->bank_name,
    //         'acc_number' => $request->acc_number,
    //         'ifsc' => $request->ifsc,
    //         'aadhar' => $request->aadhar,
    //         'pan' => $request->pan,
    //         'transaction_id' => $request->transaction_id,
    //         'machine_id' => $request->machine_id,
    //         'show' => $request->show,
    //         'customer_id' => $request->customer_id,
    //         'company_id' => $request->company_id,   // ✅ frontend
    //         'created_by' => $user ? $user->id : 0,
    //         'updated_by' => $user ? $user->id : 0,
    //         'desc'=> $request->desc,
    //     ]);

    //     ExpenseSummary::updateOrCreate(
    //         [
    //             'expense_date' => $request->expense_date,
    //             'company_id' => $request->company_id, // ✅ frontend
    //             'project_id' => $request->project_id,
    //         ],
    //         [
    //             'total_expense' => DB::raw('total_expense + ' . $request->total_price),
    //             'expense_count' => DB::raw('expense_count + 1'),
    //         ]
    //     );

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Expense created successfully.',
    //         'expense' => $expense,
    //     ]);
    // }

    public function store(Request $request)
    {
        $expenseType = ExpenseType::findOrFail($request->expense_id);
        $user = Auth::user();

        // DB::beginTransaction();

        try {
            $category = strtolower($expenseType->expense_category ?? '');
            $name = strtolower($expenseType->name ?? '');
            
            if (
                str_contains($category, 'operator') || 
                str_contains($category, 'helper') || 
                str_contains($category, 'driver') ||
                str_contains($name, 'operator') || 
                str_contains($name, 'helper') || 
                str_contains($name, 'driver')
            ) {

                $request->validate([
                    'operator_id' => [
                        'required',
                        'integer',
                        ValidationRule::exists('users', 'id')->where(function ($query) {
                            $query->whereIn('type', [2, 4]);
                        }),
                    ],
                    'total_price' => 'required|numeric|min:0',
                    'desc'        => 'nullable|string',
                ]);
                OperatorExpense::create([
                    'operator_id'   => $request->operator_id,
                    'company_id'    =>  $user->company_id,
                    'about_expenses' => $request->desc,
                    'total_amount'  => $request->total_price,
                    'expense_date'  => $request->expense_date,
                    'created_at' => Carbon::now()->toDateString(),
                    'is_settle' => false,
                    'machine_id' => $request->machine_id,
                ]);
            } else {

                $request->validate([
                    'company_id' => 'required|integer',
                    'expense_date' => 'required|date',
                    'price' => 'required|numeric|min:0',
                    'qty' => 'required|numeric|min:0',
                    'total_price' => 'required|numeric|min:0',
                    'contact' => 'nullable|numeric',
                    'payment_by' => 'nullable|string',
                    'payment_type' => 'nullable|string',
                    'pending_amount' => 'nullable|numeric',
                    'show' => 'nullable|boolean',
                    'isGst' => 'nullable|boolean',
                    'photoAvailable' => 'nullable|boolean',
                    'photo_url' => 'nullable|file|mimes:jpg,jpeg,png',
                    'photo_remark' => 'nullable|string',
                    'bank_name' => 'nullable|string',
                    'acc_number' => 'nullable|string',
                    'ifsc' => 'nullable|string',
                    'aadhar' => 'nullable|string',
                    'pan' => 'nullable|string',
                    'transaction_id' => 'nullable|string',
                    'machine_id' => 'nullable|string',
                    'customer_id' => 'nullable|integer',
                    'operator_id' => 'nullable|integer',
                ]);

                $photoPath = null;
                if ($request->hasFile('photo_url')) {
                    $photoPath = ImageCompressor::compressAndSave(
                        $request->file('photo_url'),
                        'bill',
                        1024
                    );
                }

                $expense = Expense::create([
                    'project_id' => $request->project_id,
                    'name' => $request->name,
                    'expense_date' => $request->expense_date,
                    'price' => $request->price,
                    'qty' => $request->qty,
                    'total_price' => $request->total_price,
                    'expense_id' => $request->expense_id,
                    'contact' => $request->contact,
                    'payment_by' => $request->payment_by,
                    'payment_type' => $request->payment_type,
                    'pending_amount' => $request->pending_amount,
                    'isGst' => $request->isGst,
                    'photoAvailable' => $request->photoAvailable,
                    'photo_url' => $photoPath,
                    'photo_remark' => $request->photo_remark,
                    'bank_name' => $request->bank_name,
                    'acc_number' => $request->acc_number,
                    'ifsc' => $request->ifsc,
                    'aadhar' => $request->aadhar,
                    'pan' => $request->pan,
                    'transaction_id' => $request->transaction_id,
                    'machine_id' => $request->machine_id,
                    'show' => $request->show,
                    'customer_id' => $request->customer_id,
                    'company_id' => $request->company_id,   // ✅ frontend
                    'created_by' => $user ? $user->id : 0,
                    'updated_by' => $user ? $user->id : 0,
                    'desc' => $request->desc,
                ]);

                ExpenseSummary::updateOrCreate(
                    [
                        'expense_date' => $request->expense_date,
                        'company_id' => $request->company_id, // ✅ frontend
                        'project_id' => $request->project_id,
                    ],
                    [
                        'total_expense' => DB::raw('total_expense + ' . $request->total_price),
                        'expense_count' => DB::raw('expense_count + 1'),
                    ]
                );

                return response()->json([
                    'success' => true,
                    'message' => 'Expense created successfully.',
                    'expense' => $expense,
                ]);
            }

            // DB::commit();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            // DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        $user = Auth::user();
        $companyId = $request->company_id; // ✅ frontend
        $userType = $user->type;

        try {
            if (in_array($userType, [0, 1])) {
                $expense = Expense::where('id', $id)->where('company_id', $companyId)->first();
                if ($expense) {
                    return $expense;
                }
                return response()->json(['message' => 'Expense not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $companyId = $request->company_id; // ✅ frontend

        $request->validate([
            'company_id' => 'required|integer',
            'expense_id' => 'required|exists:expense_types,id',
            'expense_date' => 'required|date',
            'price' => 'required|numeric|min:0',
            'qty' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
            'show' => 'required|boolean',
            'payment_type' => 'required|string',
            'bank_name' => 'nullable|string',
            'acc_number' => 'nullable|string',
            'ifsc' => 'nullable|string',
            'aadhar' => 'nullable|string',
            'pan' => 'nullable|string',
            'transaction_id' => 'nullable|string',
            'machine_id' => 'nullable|string',
            'customer_id' => 'nullable|integer',
        ]);

        $expense = Expense::where('id', $id)->where('company_id', $companyId)->first();

        if (!$expense) {
            return response()->json(['message' => 'Expense not found'], 404);
        }

        $oldTotal = $expense->total_price;
        $oldDate = $expense->expense_date;
        $oldProjectId = $expense->project_id;

        $expense->update([
            'expense_id' => $request->expense_id,
            'name' => $request->name,
            'expense_date' => $request->expense_date,
            'price' => $request->price,
            'qty' => $request->qty,
            'desc' => $request->desc,
            'total_price' => $request->total_price,
            'show' => $request->show,
            'company_id' => $request->company_id,
            'updated_by' => $user->id,
            'payment_type' => $request->payment_type,
            'bank_name' => $request->bank_name,
            'acc_number' => $request->acc_number,
            'ifsc' => $request->ifsc,
            'aadhar' => $request->aadhar,
            'pan' => $request->pan,
            'transaction_id' => $request->transaction_id,
            'machine_id' => $request->machine_id,
            'customer_id' => $request->customer_id,
        ]);

        ExpenseSummary::where('expense_date', $oldDate)
            ->where('company_id', $companyId)
            ->where('project_id', $oldProjectId)
            ->update([
                'total_expense' => DB::raw('total_expense - ' . $oldTotal),
            ]);

        ExpenseSummary::updateOrCreate(
            [
                'expense_date' => $request->expense_date,
                'company_id' => $companyId,
                'project_id' => $request->project_id,
            ],
            [
                'total_expense' => DB::raw('total_expense + ' . $request->total_price),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Expense updated successfully.',
            'expense' => $expense,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $companyId = $request->company_id; // ✅ frontend

        $expense = Expense::where('id', $id)->where('company_id', $companyId)->first();

        if (!$expense) {
            return response()->json(['message' => 'Expense not found'], 404);
        }

        $total = $expense->total_price;
        $date = $expense->expense_date;
        $projectId = $expense->project_id;

        $expense->delete();

        ExpenseSummary::where('expense_date', $date)
            ->where('company_id', $companyId)
            ->where('project_id', $projectId)
            ->update([
                'total_expense' => DB::raw("total_expense - $total"),
                'expense_count' => DB::raw('expense_count - 1'),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Expense deleted successfully.',
        ]);
    }

    public function expenseReport(Request $request)
    {
        $user = Auth::user();
        $companyId = $request->company_id; // ✅ frontend
        $userType = $user->type;
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');
        $projectId = $request->query('projectId');
        $perPage = $request->query('perPage', 30);
        $cursor = $request->query('cursor');

        try {
            if (!in_array($userType, [0, 1, 2])) {
                return response()->json(['error' => 'Not Allowed'], 403);
            }

            if (!$startDate || !$endDate) {
                return response()->json(['error' => 'Dates are required'], 422);
            }

            $query = ExpenseSummary::leftJoin('projects', 'expense_summaries.project_id', '=', 'projects.id')
                ->where('expense_summaries.company_id', $companyId)
                ->whereBetween('expense_summaries.expense_date', [$startDate, $endDate]);

            if ($projectId) {
                $query->where('expense_summaries.project_id', $projectId);
            }

            $query->select(
                'expense_summaries.id',
                'expense_summaries.expense_date',
                'expense_summaries.total_expense',
                'projects.project_name'
            )->orderBy('expense_summaries.expense_date', 'desc');

            $summary = DB::table('expense_summaries')
                ->where('company_id', $companyId)
                ->whereBetween('expense_date', [$startDate, $endDate]);

            if ($projectId) {
                $summary->where('project_id', $projectId);
            }

            $summary = $summary->selectRaw('SUM(total_expense) as totalExpense')->first();

            $expenseRecords = $query->cursorPaginate($perPage, ['*'], 'cursor', $cursor);

            return response()->json([
                'data' => $expenseRecords->items(),
                'next_cursor' => $expenseRecords->nextCursor()?->encode(),
                'has_more_pages' => $expenseRecords->hasMorePages(),
                'total_expense' => $summary->totalExpense,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function machineExpenseReport(Request $request)
    {
        $user = Auth::user();
        $companyId = $request->query('company_id');
        $userType = $user->type;
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');

        try {
            if (!in_array($userType, [0, 1, 2])) {
                return response()->json(['error' => 'Not Allowed'], 403);
            }

            if (!$startDate || !$endDate) {
                return response()->json(['error' => 'Start and End date are required.'], 400);
            }

            // Get all machines for the company
            $machines = \App\Models\Machinery::where('company_id', $companyId)->get();

            $machineData = [];

            foreach ($machines as $machine) {
                // Get machine expenses (loss)
                $machineExpenses = Expense::where('company_id', $companyId)
                    ->where('machine_id', $machine->id)
                    ->whereBetween('expense_date', [$startDate, $endDate])
                    ->sum('total_price');

                // Get machine income (profit) from machine logs
                $machineIncome = \App\Models\MachineLog::where('company_id', $companyId)
                    ->where('machine_id', $machine->id)
                    ->where('status', 'completed')
                    ->whereBetween('work_date', [$startDate, $endDate])
                    ->get()
                    ->sum(function ($log) {
                        $startReading = floatval($log->start_reading ?? 0);
                        $endReading = floatval($log->end_reading ?? 0);
                        $netReading = max(0, $endReading - $startReading);
                        return $netReading * floatval($log->price_per_hour ?? 0);
                    });

                // Calculate net (profit - loss)
                $net = $machineIncome - $machineExpenses;

                $machineData[] = [
                    'id' => $machine->id,
                    'machine_name' => $machine->machine_name,
                    'reg_number' => $machine->reg_number,
                    'profit' => $machineIncome,
                    'loss' => $machineExpenses,
                    'net' => $net,
                    'sr_no' => count($machineData) + 1
                ];
            }

            // Calculate totals
            $totalProfit = collect($machineData)->sum('profit');
            $totalLoss = collect($machineData)->sum('loss');
            $totalNet = $totalProfit - $totalLoss;

            return response()->json([
                'data' => $machineData,
                'totalProfit' => $totalProfit,
                'totalLoss' => $totalLoss,
                'totalNet' => $totalNet,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

     /**
     * Get pending expenses for an operator
     */
    public function pending(Request $request)
    {
        $request->validate([
            'operator_id' => 'required|integer|exists:users,id',
        ]);

        $expenses = OperatorExpense::with('machine')
            ->where('operator_id', $request->operator_id)
            ->where('is_settle', false)
            ->orderBy('expense_date', 'asc')
            ->get([
                'id',
                'operator_id',
                'machine_id',
                'total_amount',
                'expense_date',
                'about_expenses'
            ]);

        return response()->json($expenses);
    }
}
