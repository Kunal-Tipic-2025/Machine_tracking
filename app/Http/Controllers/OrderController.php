<?php

// namespace App\Http\Controllers;
// use App\Models\OrderSummary;
// use App\Models\ExpenseSummary;
// use App\Models\CompanyInfo;
// use App\Models\Order;
// use App\Models\Expense;
// use App\Models\Customer;
// use App\Models\OrderDetail;
// use App\Models\PaymentTracker;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Cache;
// use Illuminate\Support\Facades\Auth;
// use Carbon\Carbon;

// use App\Models\WorkPointDetail;
// use App\Models\SurveyDetail;

// class OrderController extends Controller
// {
//     /**
//      * Display a listing of the resource.
//      *
//      * @return \Illuminate\Http\Response
//      */
//     public function index(Request $request)
//     {
//         $user = Auth::user();
//         $companyId = $user->company_id;
//         $invoiceType = $request->query('invoiceType');
//         $orderStatus = $request->query('orderStatus');
//         $perPage = $request->query('perPage', 25);
//         $cursor = $request->query('cursor');

//         try {
//             $query = Order::with(['project:id,project_name', 'customer:id,name,mobile', 'user:id,name,mobile', 'items'])
//                 ->where('company_id', $companyId)
//                 ->orderBy('id', 'desc');

//             if ($invoiceType !== null && $invoiceType > -1) {
//                 $query->where('invoiceType', $invoiceType);
//             }

//             if ($orderStatus !== null && $orderStatus > -1) {
//                 $query->where('orderStatus', $orderStatus);
//             }

//             $orders = $query->cursorPaginate(perPage: $perPage, cursorName: 'id', cursor: $cursor);

//             return response()->json([
//                 'data' => $orders->items(),
//                 'next_cursor' => $orders->nextCursor()?->encode(),
//                 'has_more_pages' => $orders->hasMorePages(),
//                 'filters' => [
//                     'invoiceType' => $invoiceType,
//                     'orderStatus' => $orderStatus
//                 ]
//             ]);

//         } catch (\Exception $e) {
//             return response()->json(['error' => $e->getMessage()], 500);
//         }
//     }

//     /**
//      * Display the specified resource.
//      *
//      * @param  int $id
//      * @return \Illuminate\Http\Response
//      */
//     public function show($id)
//     {
//         $order = Order::with('project', 'customer', 'items')->find($id);
//         $order->items = $order->items()->get();
//         $order->customer = Customer::find($order->customer_id);
//         return $order;
//     }

//     /**
//      * Store a newly created resource in storage.
//      *
//      * @param  \Illuminate\Http\Request  $request
//      * @return \Illuminate\Http\Response
//      */
// public function store(Request $request)
// {
//     $user = Auth::user();
//     $invoiceDate = Carbon::parse($request->invoiceDate)->format('Y-m-d');

//     // Get company info for invoice number
//     $company = CompanyInfo::findOrFail($user->company_id);
//     $invoiceNumber = $company->initials . '-' . $company->invoice_counter;

//     // Increment counter for the next invoice
//     $company->invoice_counter += 1;
//     $company->save();

//     // No profit calculation (no products/bPrice), set to 0
//     $profit = 0;

//     // Get paidAmount from request with default value
//     $paidAmount = $request->paidAmount ?? 0;

//     // Map invoiceType to orderStatus
//     $orderStatus = match ($request->invoiceType) {
//         1 => 3,  // Quotation
//         2 => 2,  // Proforma Invoice
//         3 => 1,  // Invoice
//         0 => 0,  // Cancelled
//         default => 1, // Default to Invoice
//     };

//     // Create order
//     $order = Order::create(
//         array_merge(
//             $request->all(),
//             [
//                 'project_id'     => $request->project_id,
//                 'customer_id'    => $request->customer_id,
//                 'profit'         => $profit,
//                 'orderStatus'    => $orderStatus,
//                 'company_id'     => $user->company_id,
//                 'invoice_number' => $invoiceNumber,
//                 'paidAmount'     => $paidAmount,
//                 'created_by'     => $user->id,
//                 'updated_by'     => $user->id,
//                 'totalAmount'    => $request->finalAmount ?? 0,
//                 'invoiceDate'    => $invoiceDate,
//             ]
//         )
//     );

//     // ✅ Always store work detail items
//     if (!empty($request->items)) {
//         foreach ($request->items as $item) {
//             $od = new OrderDetail();
//             $od->order_id    = $order->id; // 🔑 explicitly set order_id
//             $od->work_type   = $item['work_type'] ?? '';
//             $od->qty         = $item['qty'] ?? 0;
//             $od->price       = $item['price'] ?? 0;
//             $od->total_price = $item['total_price'] ?? 0;
//             $od->remark      = $item['remark'] ?? null;
//             $od->save();
//         }
//     }

//     // Payment tracker updates
//     $finalAmount   = $request->finalAmount ?? 0;
//     $balanceAmount = $finalAmount - $paidAmount;

//     $paymentDetails = PaymentTracker::firstOrNew(['customer_id' => $request->customer_id]);
//     $paymentDetails->created_by = $user->id;
//     $paymentDetails->updated_by = $user->id;
//     $paymentDetails->amount -= $balanceAmount;
//     $paymentDetails->save();

//     // ✅ Only update OrderSummary if it's an Invoice
//     if ($order->invoiceType == 3) {
//         $summaryDate = Carbon::parse($request->deliveryDate)->format('Y-m-d');

//         OrderSummary::updateOrCreate(
//             ['invoice_date' => $summaryDate, 'company_id' => $user->company_id],
//             [
//                 'order_count'  => DB::raw('order_count + 1'),
//                 'total_amount' => DB::raw("total_amount + {$finalAmount}"),
//                 'paid_amount'  => DB::raw("paid_amount + {$paidAmount}")
//             ]
//         );
//     }

//     $order->items = $order->items()->get();

//     return response()->json(['success' => true, 'data' => $order, 'id' => $order->id], 201);
// }



//     public function summerySalesReport(Request $request)
//     {
//         $startDate = $request->query('startDate');
//         $endDate = $request->query('endDate');
//         $perPage = $request->query('perPage', 30);
//         $cursor = $request->query('cursor');

//         if (!$startDate || !$endDate) {
//             return response()->json(['error' => 'Start and End date are required.'], 400);
//         }

//         $user = Auth::user();
//         $companyId = $user->company_id;

//         try {
//             // Summary from order_summaries, only for invoiceType=3 (Invoice)
//             $summary = DB::table('order_summaries')
//                 ->join('orders', function ($join) use ($companyId) {
//                     $join->on('order_summaries.invoice_date', '=', 'orders.invoiceDate')
//                          ->where('orders.company_id', '=', $companyId)
//                          ->where('orders.invoiceType', '=', 3); // Only Invoices
//                 })
//                 ->where('order_summaries.company_id', $companyId)
//                 ->whereBetween('order_summaries.invoice_date', [$startDate, $endDate])
//                 ->selectRaw('
//                     SUM(order_summaries.total_amount) as totalAmount,
//                     SUM(order_summaries.paid_amount) as totalPaidAmount,
//                     SUM(order_summaries.total_amount - order_summaries.paid_amount) as totalRemainingAmount,
//                     SUM(order_summaries.order_count) as totalOrders
//                 ')
//                 ->first();

//             // Get expense summary
//             $expenseSummary = DB::table('expense_summaries')
//                 ->where('company_id', $companyId)
//                 ->whereBetween('expense_date', [$startDate, $endDate])
//                 ->selectRaw('SUM(total_expense) as totalExpenses')
//                 ->first();

//             $totalExpenses = $expenseSummary->totalExpenses ?? 0;
//             $totalProfitLoss = ($summary->totalAmount ?? 0) - $totalExpenses;

//             // Cursor-based paginated daily order summary, only for invoiceType=3
//             $query = DB::table('order_summaries')
//                 ->join('orders', function ($join) use ($companyId) {
//                     $join->on('order_summaries.invoice_date', '=', 'orders.invoiceDate')
//                          ->where('orders.company_id', '=', $companyId)
//                          ->where('orders.invoiceType', '=', 3); // Only Invoices
//                 })
//                 ->where('order_summaries.company_id', $companyId)
//                 ->whereBetween('order_summaries.invoice_date', [$startDate, $endDate])
//                 ->select('order_summaries.invoice_date', 'order_summaries.invoice_date as invoiceDate', 'order_summaries.total_amount as totalAmount', 'order_summaries.paid_amount as paidAmount', 'order_summaries.order_count as orderCount')
//                 ->orderBy('order_summaries.invoice_date');

//             $orders = $query->cursorPaginate($perPage, ['invoice_date'], 'cursor', $cursor);

//             return response()->json([
//                 'orders' => $orders->items(),
//                 'next_cursor' => $orders->nextCursor()?->encode(),
//                 'has_more_pages' => $orders->hasMorePages(),
//                 'summary' => [
//                     'sales' => [
//                         'totalAmount' => $summary->totalAmount ?? 0,
//                         'totalPaidAmount' => $summary->totalPaidAmount ?? 0,
//                         'totalRemainingAmount' => $summary->totalRemainingAmount ?? 0,
//                         'totalOrders' => $summary->totalOrders ?? 0,
//                     ],
//                     'profitLoss' => [
//                         'totalSales' => $summary->totalAmount ?? 0,
//                         'totalExpenses' => $totalExpenses,
//                         'totalProfitLoss' => $totalProfitLoss,
//                     ]
//                 ]
//             ]);

//         } catch (\Exception $e) {
//             return response()->json(['error' => 'Report generation failed: ' + $e->getMessage()], 500);
//         }
//     }

//     public function getMonthlyReportSummeries(Request $request)
//     {
//         $user = Auth::user();
//         $companyId = $user->company_id;
//         $year = $request->query('year', date('Y'));

//         try {
//             // Get monthly sales data from order_summaries, only for invoiceType=3 (Invoice)
//             $monthlySales = DB::table('order_summaries')
//                 ->join('orders', function ($join) use ($companyId) {
//                     $join->on('order_summaries.invoice_date', '=', 'orders.invoiceDate')
//                          ->where('orders.company_id', '=', $companyId)
//                          ->where('orders.invoiceType', '=', 3); // Only Invoices
//                 })
//                 ->where('order_summaries.company_id', $companyId)
//                 ->whereYear('order_summaries.invoice_date', $year)
//                 ->selectRaw('MONTH(order_summaries.invoice_date) as month, SUM(order_summaries.total_amount) as total')
//                 ->groupBy(DB::raw('MONTH(order_summaries.invoice_date)'))
//                 ->get()
//                 ->keyBy('month');

//             // Get monthly expense data
//             $monthlyExpenses = ExpenseSummary::where('company_id', $companyId)
//                 ->whereYear('expense_date', $year)
//                 ->selectRaw('MONTH(expense_date) as month, SUM(total_expense) as total')
//                 ->groupBy(DB::raw('MONTH(expense_date)'))
//                 ->get()
//                 ->keyBy('month');

//             // Initialize arrays for 12 months
//             $salesData = array_fill(0, 12, 0);
//             $expenseData = array_fill(0, 12, 0);
//             $PLdata = array_fill(0, 12, 0);

//             // Fill sales data
//             foreach ($monthlySales as $month => $data) {
//                 $salesData[$month - 1] = floatval($data->total);
//             }

//             // Fill expense data
//             foreach ($monthlyExpenses as $month => $data) {
//                 $expenseData[$month - 1] = floatval($data->total);
//             }

//             // Calculate P&L
//             for ($i = 0; $i < 12; $i++) {
//                 $PLdata[$i] = $salesData[$i] - $expenseData[$i];
//             }

//             $result = [
//                 'success' => true,
//                 'year' => $year,
//                 'monthlySales' => $salesData,
//                 'monthlyExpense' => $expenseData,
//                 'monthlyPandL' => $PLdata,
//                 'totals' => [
//                     'totalSales' => array_sum($salesData),
//                     'totalExpenses' => array_sum($expenseData),
//                     'totalPL' => array_sum($PLdata),
//                 ]
//             ];

//             return response()->json($result);
//         } catch (\Exception $e) {
//             return response()->json(['error' => 'Monthly summary report failed: ' + $e->getMessage()], 500);
//         }
//     }

//     public function profitLossReport(Request $request)
//     {
//         $startDate = $request->query('startDate');
//         $endDate = $request->query('endDate');

//         if (!$startDate || !$endDate) {
//             return response()->json(['error' => 'Start and End date are required.'], 400);
//         }

//         $user = Auth::user();
//         $companyId = $user->company_id;

//         try {
//             // Total WorkPoint Income
//             $workIncome = WorkPointDetail::where('company_id', $companyId)
//                 ->whereBetween('created_at', [$startDate, $endDate])
//                 ->sum('total');

//             // Total Survey Income
//             $surveyIncome = SurveyDetail::where('company_id', $companyId)
//                 ->whereBetween('created_at', [$startDate, $endDate])
//                 ->sum('total');

//             // Total Expenses
//             $totalExpenses = Expense::where('company_id', $companyId)
//                 ->whereBetween('expense_date', [$startDate, $endDate])
//                 ->sum('total_price');

//             // Total Sales (income)
//             $totalSales = $workIncome + $surveyIncome;

//             // Profit/Loss
//             $profitLoss = $totalSales - $totalExpenses;

//             return response()->json([
//                 'summary' => [
//                     'sales' => [
//                         'totalSales' => $totalSales,
//                         'workIncome' => $workIncome,
//                         'surveyIncome' => $surveyIncome,
//                     ],
//                     'expenses' => [
//                         'totalExpenses' => $totalExpenses,
//                     ],
//                     'profitLoss' => [
//                         'profitLossAmount' => $profitLoss,
//                         'status' => $profitLoss >= 0 ? 'Profit' : 'Loss'
//                     ]
//                 ]
//             ]);

//         } catch (\Exception $e) {
//             return response()->json(['error' => 'Report generation failed: ' + $e->getMessage()], 500);
//         }
//     }
// }



namespace App\Http\Controllers;
use App\Models\OrderSummary;
use App\Models\ExpenseSummary;
use App\Models\CompanyInfo;
use App\Models\Order;
use App\Models\Expense;
use App\Models\Customer;
use App\Models\OrderDetail;
use App\Models\PaymentTracker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use App\Models\WorkPointDetail;
use App\Models\SurveyDetail;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $companyId = $user->company_id;
        $invoiceType = $request->query('invoiceType');
        $orderStatus = $request->query('orderStatus');
        $perPage = $request->query('perPage', 25);
        $cursor = $request->query('cursor');

        try {
            $query = Order::with(['project:id,project_name', 'customer:id,name,mobile', 'user:id,name,mobile', 'items'])
                ->where('company_id', $companyId)
                ->orderBy('id', 'desc');

            if ($invoiceType !== null && $invoiceType > -1) {
                $query->where('invoiceType', $invoiceType);
            }

            if ($orderStatus !== null && $orderStatus > -1) {
                $query->where('orderStatus', $orderStatus);
            }

            $orders = $query->cursorPaginate(perPage: $perPage, cursorName: 'id', cursor: $cursor);

            return response()->json([
                'data' => $orders->items(),
                'next_cursor' => $orders->nextCursor()?->encode(),
                'has_more_pages' => $orders->hasMorePages(),
                'filters' => [
                    'invoiceType' => $invoiceType,
                    'orderStatus' => $orderStatus
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $order = Order::with('project', 'customer', 'items')->find($id);
        $order->items = $order->items()->get();
        $order->customer = Customer::find($order->customer_id);

        // Load selected machine details if selectedMachines exists
        if ($order->selectedMachines && is_array($order->selectedMachines) && count($order->selectedMachines) > 0) {
            $order->selectedMachinesDetails = \App\Models\MachineOperator::whereIn('id', $order->selectedMachines)->get();
        } else {
            $order->selectedMachinesDetails = collect([]);
        }

        return response()->json($order);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $invoiceDate = Carbon::parse($request->invoiceDate)->format('Y-m-d');

        // Get company info for invoice number
        $company = CompanyInfo::findOrFail($user->company_id);
        $invoiceNumber = $company->initials . '-' . $company->invoice_counter;

        // Increment counter for the next invoice
        $company->invoice_counter += 1;
        $company->save();

        // No profit calculation (no products/bPrice), set to 0
        $profit = 0;

        // Get paidAmount from request with default value
        $paidAmount = $request->paidAmount ?? 0;

        // Map invoiceType to orderStatus
        $orderStatus = match ($request->invoiceType) {
            1 => 3,  // Quotation
            2 => 2,  // Proforma Invoice
            3 => 1,  // Invoice
            0 => 0,  // Cancelled
            default => 1, // Default to Invoice
        };

        // Create order
        $order = Order::create(
            array_merge(
                $request->all(),
                [
                    'project_id'         => $request->project_id,
                    'customer_id'        => $request->customer_id,
                    'selected_machine_id' => $request->selectedMachineId ?? null, // ✅ Save selected machine ID
                    'profit'             => $profit,
                    'orderStatus'        => $orderStatus,
                    'company_id'         => $user->company_id,
                    'invoice_number'     => $invoiceNumber,
                    'paidAmount'         => $paidAmount,
                    'created_by'         => $user->id,
                    'updated_by'         => $user->id,
                    'totalAmount'        => $request->finalAmount ?? 0,
                    'invoiceDate'        => $invoiceDate,
                ]
            )
        );

        // ✅ Always store work detail items
        if (!empty($request->items)) {
            foreach ($request->items as $item) {
                $od = new OrderDetail();
                $od->order_id    = $order->id; // 🔑 explicitly set order_id
                $od->work_type   = $item['work_type'] ?? '';
                $od->qty         = $item['qty'] ?? 0;
                $od->price       = $item['price'] ?? 0;
                $od->total_price = $item['total_price'] ?? 0;
                $od->remark      = $item['remark'] ?? null;
                $od->save();
            }
        }

        // Payment tracker updates
        $finalAmount   = $request->finalAmount ?? 0;
        $balanceAmount = $finalAmount - $paidAmount;

        $paymentDetails = PaymentTracker::firstOrNew(['customer_id' => $request->customer_id]);
        $paymentDetails->created_by = $user->id;
        $paymentDetails->updated_by = $user->id;
        $paymentDetails->amount -= $balanceAmount;
        $paymentDetails->save();

        // ✅ Only update OrderSummary if it's an Invoice
        if ($order->invoiceType == 3) {
            $summaryDate = Carbon::parse($request->deliveryDate)->format('Y-m-d');

            OrderSummary::updateOrCreate(
                ['invoice_date' => $summaryDate, 'company_id' => $user->company_id],
                [
                    'order_count'  => DB::raw('order_count + 1'),
                    'total_amount' => DB::raw("total_amount + {$finalAmount}"),
                    'paid_amount'  => DB::raw("paid_amount + {$paidAmount}")
                ]
            );
        }

        $order->items = $order->items()->get();

        // Load selected machine details in response
        if ($order->selected_machine_id) {
            $order->selectedMachine = \App\Models\MachineOperator::find($order->selected_machine_id); // Assuming MachineOperator model
        }

        return response()->json(['success' => true, 'data' => $order, 'id' => $order->id], 201);
    }

    public function summerySalesReport(Request $request)
    {
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');
        $perPage = $request->query('perPage', 30);
        $cursor = $request->query('cursor');

        if (!$startDate || !$endDate) {
            return response()->json(['error' => 'Start and End date are required.'], 400);
        }

        $user = Auth::user();
        $companyId = $user->company_id;

        try {
            // Summary from order_summaries, only for invoiceType=3 (Invoice)
            $summary = DB::table('order_summaries')
                ->join('orders', function ($join) use ($companyId) {
                    $join->on('order_summaries.invoice_date', '=', 'orders.invoiceDate')
                         ->where('orders.company_id', '=', $companyId)
                         ->where('orders.invoiceType', '=', 3); // Only Invoices
                })
                ->where('order_summaries.company_id', $companyId)
                ->whereBetween('order_summaries.invoice_date', [$startDate, $endDate])
                ->selectRaw('
                    SUM(order_summaries.total_amount) as totalAmount,
                    SUM(order_summaries.paid_amount) as totalPaidAmount,
                    SUM(order_summaries.total_amount - order_summaries.paid_amount) as totalRemainingAmount,
                    SUM(order_summaries.order_count) as totalOrders
                ')
                ->first();

            // Get expense summary
            $expenseSummary = DB::table('expense_summaries')
                ->where('company_id', $companyId)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->selectRaw('SUM(total_expense) as totalExpenses')
                ->first();

            $totalExpenses = $expenseSummary->totalExpenses ?? 0;
            $totalProfitLoss = ($summary->totalAmount ?? 0) - $totalExpenses;

            // Cursor-based paginated daily order summary, only for invoiceType=3
            $query = DB::table('order_summaries')
                ->join('orders', function ($join) use ($companyId) {
                    $join->on('order_summaries.invoice_date', '=', 'orders.invoiceDate')
                         ->where('orders.company_id', '=', $companyId)
                         ->where('orders.invoiceType', '=', 3); // Only Invoices
                })
                ->where('order_summaries.company_id', $companyId)
                ->whereBetween('order_summaries.invoice_date', [$startDate, $endDate])
                ->select('order_summaries.invoice_date', 'order_summaries.invoice_date as invoiceDate', 'order_summaries.total_amount as totalAmount', 'order_summaries.paid_amount as paidAmount', 'order_summaries.order_count as orderCount')
                ->orderBy('order_summaries.invoice_date');

            $orders = $query->cursorPaginate($perPage, ['invoice_date'], 'cursor', $cursor);

            return response()->json([
                'orders' => $orders->items(),
                'next_cursor' => $orders->nextCursor()?->encode(),
                'has_more_pages' => $orders->hasMorePages(),
                'summary' => [
                    'sales' => [
                        'totalAmount' => $summary->totalAmount ?? 0,
                        'totalPaidAmount' => $summary->totalPaidAmount ?? 0,
                        'totalRemainingAmount' => $summary->totalRemainingAmount ?? 0,
                        'totalOrders' => $summary->totalOrders ?? 0,
                    ],
                    'profitLoss' => [
                        'totalSales' => $summary->totalAmount ?? 0,
                        'totalExpenses' => $totalExpenses,
                        'totalProfitLoss' => $totalProfitLoss,
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Report generation failed: ' + $e->getMessage()], 500);
        }
    }

    public function getMonthlyReportSummeries(Request $request)
    {
        $user = Auth::user();
        $companyId = $user->company_id;
        $year = $request->query('year', date('Y'));

        try {
            // Get monthly sales data from order_summaries, only for invoiceType=3 (Invoice)
            $monthlySales = DB::table('order_summaries')
                ->join('orders', function ($join) use ($companyId) {
                    $join->on('order_summaries.invoice_date', '=', 'orders.invoiceDate')
                         ->where('orders.company_id', '=', $companyId)
                         ->where('orders.invoiceType', '=', 3); // Only Invoices
                })
                ->where('order_summaries.company_id', $companyId)
                ->whereYear('order_summaries.invoice_date', $year)
                ->selectRaw('MONTH(order_summaries.invoice_date) as month, SUM(order_summaries.total_amount) as total')
                ->groupBy(DB::raw('MONTH(order_summaries.invoice_date)'))
                ->get()
                ->keyBy('month');

            // Get monthly expense data
            $monthlyExpenses = ExpenseSummary::where('company_id', $companyId)
                ->whereYear('expense_date', $year)
                ->selectRaw('MONTH(expense_date) as month, SUM(total_expense) as total')
                ->groupBy(DB::raw('MONTH(expense_date)'))
                ->get()
                ->keyBy('month');

            // Initialize arrays for 12 months
            $salesData = array_fill(0, 12, 0);
            $expenseData = array_fill(0, 12, 0);
            $PLdata = array_fill(0, 12, 0);

            // Fill sales data
            foreach ($monthlySales as $month => $data) {
                $salesData[$month - 1] = floatval($data->total);
            }

            // Fill expense data
            foreach ($monthlyExpenses as $month => $data) {
                $expenseData[$month - 1] = floatval($data->total);
            }

            // Calculate P&L
            for ($i = 0; $i < 12; $i++) {
                $PLdata[$i] = $salesData[$i] - $expenseData[$i];
            }

            $result = [
                'success' => true,
                'year' => $year,
                'monthlySales' => $salesData,
                'monthlyExpense' => $expenseData,
                'monthlyPandL' => $PLdata,
                'totals' => [
                    'totalSales' => array_sum($salesData),
                    'totalExpenses' => array_sum($expenseData),
                    'totalPL' => array_sum($PLdata),
                ]
            ];

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Monthly summary report failed: ' + $e->getMessage()], 500);
        }
    }

    public function profitLossReport(Request $request)
    {
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');

        if (!$startDate || !$endDate) {
            return response()->json(['error' => 'Start and End date are required.'], 400);
        }

        $user = Auth::user();
        $companyId = $user->company_id;

        try {
            // Total WorkPoint Income
            $workIncome = WorkPointDetail::where('company_id', $companyId)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('total');

            // Total Survey Income
            $surveyIncome = SurveyDetail::where('company_id', $companyId)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('total');

            // Total Expenses
            $totalExpenses = Expense::where('company_id', $companyId)
                ->whereBetween('expense_date', [$startDate, $endDate])
                ->sum('total_price');

            // Total Sales (income)
            $totalSales = $workIncome + $surveyIncome;

            // Profit/Loss
            $profitLoss = $totalSales - $totalExpenses;

            return response()->json([
                'summary' => [
                    'sales' => [
                        'totalSales' => $totalSales,
                        'workIncome' => $workIncome,
                        'surveyIncome' => $surveyIncome,
                    ],
                    'expenses' => [
                        'totalExpenses' => $totalExpenses,
                    ],
                    'profitLoss' => [
                        'profitLossAmount' => $profitLoss,
                        'status' => $profitLoss >= 0 ? 'Profit' : 'Loss'
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Report generation failed: ' + $e->getMessage()], 500);
        }
    }
}