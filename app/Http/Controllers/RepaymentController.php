<?php

namespace App\Http\Controllers;

use App\Models\Repayment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\ProjectPayment;
use Carbon\Carbon;
use App\Models\CompanyInfo;


class RepaymentController extends Controller
{

    public function index(Request $request)
    {
        $companyId = $request->query('company_id');
        $projectId = $request->query('project_id');

        $query = Repayment::with(['company', 'project', 'invoice']);

        if ($companyId) {
            $query->where('company_id', $companyId);
        }

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $repayments = $query->get();

        return response()->json($repayments);
    }



    public function show($id)
    {
        $repayment = Repayment::with(['company', 'project', 'invoice'])->find($id);

        if (!$repayment) {
            return response()->json(['message' => 'Repayment not found'], 404);
        }

        return response()->json($repayment);
    }



    public function markAdvanceTaken(Request $request)
    {
        $companyId = $request->input('company_id');
        $projectId = $request->input('project_id');

        if (!$companyId || !$projectId) {
            return response()->json(['error' => 'company_id and project_id are required'], 400);
        }

        try {
            // Update all advance repayments where is_advance is true
            // Using true instead of 1 for better boolean handling
            $updated = DB::table('repayments')
                ->where('company_id', $companyId)
                ->where('project_id', $projectId)
                ->where('is_advance', true)
                ->update(['advance_taken' => true]);

            if ($updated === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No matching advance repayments found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => "Advance repayments marked as cleared successfully ($updated updated).",
                'updated_count' => $updated
            ]);
        } catch (\Exception $e) {
            \Log::error('markAdvanceTaken error: ' . $e->getMessage(), [
                'company_id' => $companyId,
                'project_id' => $projectId,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Database update failed',
                'details' => $e->getMessage()
            ], 500);
        }
    }



    //LATEST ONE 
    // public function store(Request $request)
    // {
    //     $user = Auth::user(); // Get the authenticated user
    //     $comid = $user->company_id;

    //     // 🧩 Step 1: Validate minimal input (only project_id and payment)
    //     $validated = $request->validate([
    //         'project_id' => 'required|integer|exists:projects,id',
    //         'payment' => 'required|numeric|min:0',
    //     ]);


    //     // 🧩 Step 2: Fetch eligible project payments for this company & project
    //     $eligiblePayments = ProjectPayment::where('company_id', $comid)
    //         ->where('project_id', $validated['project_id'])
    //         // ->whereColumn('paid_amount', '<', 'total') 
    //         //  ->where('project_number',$validated['invoice_id'])
    //         ->orderBy('created_at', 'asc')
    //         ->get();



    //     if ($eligiblePayments->isEmpty()) {
    //         return response()->json([
    //             'message' => 'No pending project payments found for this project under this company.'
    //         ], 404);
    //     }

    //     // ✅ Step 3: Use the first eligible payment (oldest pending invoice)
    //     $invoice = $eligiblePayments->first();

    //     // ✅ Step 4: Auto-fill other fields
    //     $validated['company_id'] = $user->company_id;
    //     $validated['invoice_id'] = $invoice->invoice_number;
    //     $validated['total'] = $invoice->total - $invoice->paid_amount;
    //     $validated['date'] = Carbon::now()->toDateString(); // current date

    //     // 🧮 Step 5: Auto-calculate remaining and completion
    //     $validated['remaining'] = $validated['total'] - $validated['payment'];
    //     $validated['is_completed'] = $validated['payment'] >= $validated['total'];

    //     // ✅ Step 6: Create repayment record
    //     $repayment = Repayment::create($validated);

    //     // ✅ Step 8: Return response
    //     return response()->json([
    //         'message' => 'Repayment created successfully',
    //         'linked_invoice' => $invoice,
    //         'data' => $repayment
    //     ], 201);
    // }



    // public function store(Request $request)
    // {
    //     $user = Auth::user();
    //     $companyId = $user->company_id;

    //     $validated = $request->validate([
    //         'project_id' => 'required|integer|exists:projects,id',
    //         'payment' => 'required|numeric|min:0',
    //     ]);

    //     $paymentAmount = $validated['payment'];

    //     // Fetch all invoices for this project & company, oldest first
    //     $invoices = ProjectPayment::where('company_id', $companyId)
    //         ->where('project_id', $validated['project_id'])
    //         ->orderBy('created_at', 'asc')
    //         ->get();

    //     if ($invoices->isEmpty()) {
    //         return response()->json([
    //             'message' => 'No project payments found for this project under this company.'
    //         ], 404);
    //     }

    //     $repayments = [];

    //     foreach ($invoices as $invoice) {
    //         // Calculate remaining amount for this invoice
    //         $invoiceRemaining = $invoice->total - $invoice->paid_amount;

    //         if ($invoiceRemaining <= 0) {
    //             continue; // Skip fully paid invoices
    //         }

    //         // Payment to apply on this invoice
    //         $applyPayment = min($paymentAmount, $invoiceRemaining);

    //         // Create repayment record
    //         $repaymentData = [
    //             'company_id' => $companyId,
    //             'project_id' => $validated['project_id'],
    //             'invoice_id' => $invoice->invoice_number,
    //             'payment' => $applyPayment,
    //             'total' => $invoiceRemaining,
    //             'remaining' => $invoiceRemaining - $applyPayment,
    //             'is_completed' => ($applyPayment >= $invoiceRemaining),
    //             'date' => Carbon::now()->toDateString(),
    //         ];

    //         $repayment = Repayment::create($repaymentData);
    //         $repayments[] = $repayment;

    //         // Update invoice paid_amount
    //         $invoice->paid_amount += $applyPayment;
    //         $invoice->save();

    //         // Reduce remaining payment
    //         $paymentAmount -= $applyPayment;

    //         // Stop if full payment amount has been allocated
    //         if ($paymentAmount <= 0) {
    //             break;
    //         }
    //     }

    //     return response()->json([
    //         'message' => 'Repayment(s) created successfully',
    //         'data' => $repayments
    //     ], 201);
    // }


    public function store(Request $request)
    {
        $user = Auth::user();
        $companyId = $user->company_id;

        $validated = $request->validate([
            'project_id' => 'required|integer|exists:projects,id',
            'payment' => 'required|numeric|min:0.01',
            'payment_mode' => 'nullable|string',
        ]);

        $incomingPayment = (float) $validated['payment'];

        DB::beginTransaction();

        try {
            // 1️⃣ Fetch invoices (oldest first)
            $invoices = ProjectPayment::where('company_id', $companyId)
                ->where('project_id', $validated['project_id'])
                ->orderBy('created_at', 'asc')
                ->get();

            if ($invoices->isEmpty()) {
                DB::rollBack();
                return response()->json([
                    'message' => 'No invoices found for this project.'
                ], 404);
            }

            // 2️⃣ Calculate TOTAL outstanding BEFORE mutation
            $totalOutstanding = 0;

            foreach ($invoices as $invoice) {
                $invoiceRemaining = max(0, $invoice->total - $invoice->paid_amount);
                $totalOutstanding += $invoiceRemaining;

                $chargesOutstanding = \App\Models\InvoiceAdditionalCharge::where(
                    'invoice_id',
                    $invoice->invoice_number
                )->sum(DB::raw('amount - IFNULL(paid_amount, 0)'));

                $totalOutstanding += max(0, $chargesOutstanding);
            }

            // 3️⃣ Reject overpayment
            if ($incomingPayment > $totalOutstanding) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Payment exceeds total outstanding balance',
                    'details' => [
                        'incoming_payment' => $incomingPayment,
                        'total_outstanding' => $totalOutstanding,
                        'excess_amount' => round($incomingPayment - $totalOutstanding, 2)
                    ]
                ], 422);
            }

            $remainingPayment = $incomingPayment;
            $repayments = [];

            // 4️⃣ Allocate payment invoice by invoice
            foreach ($invoices as $invoice) {

                if ($remainingPayment <= 0)
                    break;

                /** -------------------------------
                 *  A. Settle INVOICE amount
                 * ------------------------------- */
                $invoiceRemaining = max(0, $invoice->total - $invoice->paid_amount);

                if ($invoiceRemaining > 0) {
                    $invoicePayment = min($invoiceRemaining, $remainingPayment);

                    Repayment::create([
                        'company_id' => $companyId,
                        'project_id' => $validated['project_id'],
                        'invoice_id' => $invoice->invoice_number,
                        'payment' => $invoicePayment,
                        'total' => $invoiceRemaining,
                        'remaining' => $invoiceRemaining - $invoicePayment,
                        'is_completed' => ($invoicePayment >= $invoiceRemaining),
                        'payment_mode' => $validated['payment_mode'] ?? null,
                        'date' => now()->toDateString(),
                    ]);

                    $invoice->paid_amount += $invoicePayment;
                    $invoice->save();

                    $remainingPayment -= $invoicePayment;
                }

                if ($remainingPayment <= 0)
                    break;

                /** ---------------------------------
                 *  B. Settle ADDITIONAL CHARGES
                 * --------------------------------- */
                $charges = \App\Models\InvoiceAdditionalCharge::where(
                    'invoice_id',
                    $invoice->invoice_number
                )->orderBy('id', 'asc')->get();

                foreach ($charges as $charge) {
                    if ($remainingPayment <= 0)
                        break;

                    $chargeRemaining = max(
                        0,
                        $charge->amount - ($charge->paid_amount ?? 0)
                    );

                    if ($chargeRemaining <= 0)
                        continue;

                    $chargePayment = min($chargeRemaining, $remainingPayment);

                    Repayment::create([
                        'company_id' => $companyId,
                        'project_id' => $validated['project_id'],
                        'invoice_id' => $invoice->invoice_number,
                        'charge_id' => $charge->id,
                        'payment' => $chargePayment,
                        'total' => $chargeRemaining,
                        'remaining' => $chargeRemaining - $chargePayment,
                        'is_completed' => ($chargePayment >= $chargeRemaining),
                        'payment_mode' => $validated['payment_mode'] ?? null,
                        'date' => now()->toDateString(),
                    ]);

                    $charge->paid_amount += $chargePayment;
                    $charge->is_paid = ($charge->paid_amount >= $charge->amount);
                    $charge->save();

                    $remainingPayment -= $chargePayment;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment allocated successfully',
                'data' => [
                    'incoming_payment' => $incomingPayment,
                    'total_allocated' => $incomingPayment - $remainingPayment,
                    'remaining_unused' => round($remainingPayment, 2),
                ]
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Project repayment failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment'
            ], 500);
        }
    }

    // Create an advance payment: generate an invoice with payment_mode "Advance"
    // and a matching repayment entry linked by invoice_number
    public function storeAdvance(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|integer|exists:company_info,company_id',
            'project_id' => 'required|integer|exists:projects,id',
            'amount' => 'required|numeric|min:0.01',
        ]);

        // Generate new invoice number based on company initials and counter
        $company = CompanyInfo::where('company_id', $validated['company_id'])->firstOrFail();
        $invoiceNumber = $company->initials . '-' . str_pad($company->invoice_counter, 4, '0', STR_PAD_LEFT);
        $company->invoice_counter += 1;
        $company->save();

        // Create a fully paid ProjectPayment entry representing the advance invoice
        $payment = ProjectPayment::create([
            'project_id' => $validated['project_id'],
            'company_id' => $validated['company_id'],
            'total' => $validated['amount'],
            'paid_amount' => $validated['amount'],
            'payment_mode' => 'Advance',
            'worklog_ids' => null,
            'invoice_number' => $invoiceNumber,
        ]);

        // Create a matching repayment entry linked by invoice_number
        $repayment = Repayment::create([
            'company_id' => $validated['company_id'],
            'project_id' => $validated['project_id'],
            'invoice_id' => $invoiceNumber, // note: system stores invoice_number here
            'date' => Carbon::now()->toDateString(),
            'total' => $validated['amount'],
            'payment' => $validated['amount'],
            'is_completed' => true,
            'remaining' => 0,
        ]);

        return response()->json([
            'message' => 'Advance payment created successfully',
            'invoice' => $payment,
            'repayment' => $repayment,
        ], 201);
    }



    // public function store(Request $request)
    // {
    //     $user = Auth::user();
    //     $comid = $user->company_id;

    //     // Step 1: Validate input
    //     $validated = $request->validate([
    //         'project_id' => 'required|integer|exists:projects,id',
    //         'payment' => 'required|numeric|min:0',
    //         'invoice_id' => 'nullable|string', // now optional
    //     ]);

    //     // Step 2: Fetch eligible project payments
    //     $query = ProjectPayment::where('company_id', $comid)
    //         ->where('project_id', $validated['project_id'])
    //         // ->whereColumn('paidamount', '<', 'total') // pending invoices only
    //         ->orderBy('created_at', 'asc');

    //     // If invoice_id is provided, filter by it
    //     if (!empty($validated['invoice_id'])) {
    //         $query->where('invoice_number', $validated['invoice_id']);
    //     }

    //     $eligiblePayments = $query->get();

    //     if ($eligiblePayments->isEmpty()) {
    //         return response()->json([
    //             'message' => 'No pending project payments found for this project under this company.'
    //         ], 404);
    //     }

    //     // Step 3: Use the first eligible payment
    //     $invoice = $eligiblePayments->first();

    //     // Step 4: Auto-fill Repayment fields
    //     $validated['company_id'] = $comid;
    //     $validated['invoice_id'] = $invoice->invoice_number; // store invoice_number
    //     $validated['total'] = $invoice->total;
    //     $validated['date'] = Carbon::now()->toDateString();

    //     // Step 5: Calculate remaining & completion
    //     $validated['remaining'] = $validated['total'] - $validated['payment'];
    //     $validated['is_completed'] = $validated['payment'] >= $validated['total'];

    //     // Step 6: Create repayment
    //     $repayment = Repayment::create($validated);

    //     // Optional: update ProjectPayment paidamount
    //     // $invoice->paidamount += $validated['payment'];
    //     // $invoice->save();

    //     // Step 7: Return response
    //     return response()->json([
    //         'message' => 'Repayment created successfully',
    //         'linked_invoice' => $invoice,
    //         'data' => $repayment
    //     ], 201);
    // }







    public function createSingleRepayment(Request $request)
    {

        // Step 1: Validate frontend input
        $validated = $request->validate([
            'company_id' => 'required|integer',
            'project_id' => 'required|integer',
            'invoice_id' => 'required', // can be integer or string if invoice_number
            'payment' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'remaining' => 'required|numeric',
            'is_completed' => 'required|boolean',
            'date' => 'nullable|date',
            'remark' => 'nullable|string',
        ]);


        // Step 3: Create repayment
        $repayment = Repayment::create($validated);

        // Step 4: Return response
        return response()->json([
            'message' => 'Repayment created successfully',
            'data' => $repayment
        ], 201);
    }

















    // ✏️ Update an existing repayment
    public function update(Request $request, $id)
    {
        $repayment = Repayment::find($id);

        if (!$repayment) {
            return response()->json(['message' => 'Repayment not found'], 404);
        }

        $validated = $request->validate([
            'company_id' => 'sometimes|integer|exists:company_info,company_id',
            'project_id' => 'sometimes|integer|exists:projects,id',
            'invoice_id' => 'nullable|integer|exists:project_payments,id',
            'date' => 'sometimes|date',
            'total' => 'sometimes|numeric|min:0',
            'payment' => 'sometimes|numeric|min:0',
            'is_completed' => 'boolean',
        ]);

        // 🧮 Recalculate remaining and completion when needed
        $total = $validated['total'] ?? $repayment->total;
        $payment = $validated['payment'] ?? $repayment->payment;

        $validated['remaining'] = $total - $payment;
        $validated['is_completed'] = $payment >= $total;

        $repayment->update($validated);

        return response()->json([
            'message' => 'Repayment updated successfully',
            'data' => $repayment
        ]);
    }

    // ❌ Delete a repayment
    public function destroy($id)
    {
        $repayment = Repayment::find($id);

        if (!$repayment) {
            return response()->json(['message' => 'Repayment not found'], 404);
        }

        $repayment->delete();

        return response()->json(['message' => 'Repayment deleted successfully']);
    }
}
