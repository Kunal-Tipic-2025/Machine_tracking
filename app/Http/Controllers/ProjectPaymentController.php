<?php

// namespace App\Http\Controllers;

// use App\Models\ProjectPayment;
// use Illuminate\Http\Request;
// use Illuminate\Validation\Rule;
// use Illuminate\Support\Facades\Log;

// class ProjectPaymentController extends Controller
// {
//     // List all payments with project & company info
//     public function index()
//     {
//         $payments = ProjectPayment::with(['project', 'company'])->get();
//         return response()->json($payments);
//     }

//     // Show a single payment
//     public function show($id)
//     {
//         $payment = ProjectPayment::with(['project', 'company'])->findOrFail($id);
//         return response()->json($payment);
//     }

//     // Create a new payment (company_id is sent from frontend, verified)
//     public function store(Request $request)
//     {
//         try {
//             $request->validate([
//                 'project_id' => [
//                     'required',
//                     'integer',
//                     Rule::exists('projects', 'id'),
//                 ],
//                 'company_id' => [
//                     'required',
//                     'integer',
//                     Rule::exists('company_info', 'company_id'), // ✅ verify that company_id exists
//                 ],
//                 'total' => 'required|numeric',
//                 'paid_amount' => 'nullable|numeric',
//                 'payment_mode' => 'nullable|string',
//                 'worklog_ids' => 'nullable|array',
//             ]);

//             // Create the payment record directly from validated data
//             $payment = ProjectPayment::create($request->all());

//             return response()->json($payment, 201);

//         } catch (\Exception $e) {
//             Log::error('Payment creation failed: ' . $e->getMessage(), [
//                 'trace' => $e->getTraceAsString(),
//                 'request_data' => $request->all(),
//             ]);

//             return response()->json([
//                 'message' => 'Failed to create payment.',
//                 'error' => $e->getMessage(),
//             ], 500);
//         }
//     }

//     // Update a payment
//     public function update(Request $request, $id)
//     {
//         $payment = ProjectPayment::findOrFail($id);

//         $request->validate([
//             'total' => 'nullable|numeric',
//             'paid_amount' => 'nullable|numeric',
//             'payment_mode' => 'nullable|string',
//             'worklog_ids' => 'nullable|array',
//         ]);

//         $payment->update($request->all());
//         return response()->json($payment);
//     }

//     // Delete a payment
//     public function destroy($id)
//     {
//         $payment = ProjectPayment::findOrFail($id);
//         $payment->delete();

//         return response()->json(['message' => 'Deleted successfully']);
//     }



//     // Update only paid_amount and payment_mode (nullable)
// public function updatePaymentStatus(Request $request, $id)
// {
//     $payment = ProjectPayment::findOrFail($id);

//     // Validate fields (nullable)
//     $request->validate([
//         'paid_amount' => 'nullable|numeric',
//         'payment_mode' => 'nullable|string',
//     ]);

//     // Update only the provided fields
//     $payment->update([
//         'paid_amount' => $request->paid_amount,
//         'payment_mode' => $request->payment_mode,
//     ]);

//     return response()->json([
//         'message' => 'Payment status updated successfully',
//         'payment' => $payment,
//     ]);
// }

// }




namespace App\Http\Controllers;

use App\Models\ProjectPayment;
use App\Models\Repayment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyInfo;
use Carbon\Carbon;

class ProjectPaymentController extends Controller
{
    // List all payments with project & company info
    // public function index()
    // {
    //     $payments = ProjectPayment::with(['project', 'company'])->get();
    //     return response()->json($payments);
    // }

    public function index()
    {
        $payments = ProjectPayment::with(['project', 'company', 'additionalCharges'])->get();

        $enrichedPayments = $payments->map(function ($payment) {
            return $this->enrichPaymentWithCharges($payment);
        });

        return response()->json($enrichedPayments);
    }

    private function enrichPaymentWithCharges($payment)
    {
        $additionalChargesTotal = $payment->additionalCharges->sum('amount');
        $additionalChargesPaid = $payment->additionalCharges->sum('paid_amount');

        return [
            'id' => $payment->id,
            'project_id' => $payment->project_id,
            'company_id' => $payment->company_id,
            'invoice_number' => $payment->invoice_number,
            'is_advance' => $payment->is_advance,
            'is_fixed_bid' => $payment->is_fixed_bid,
            'payment_mode' => $payment->payment_mode,
            'created_at' => $payment->created_at,
            // ✅ ADD THIS LINE - Include worklog_ids
            'worklog_ids' => $payment->worklog_ids,

            // Original amounts
            'base_total' => $payment->total,
            'base_paid_amount' => $payment->paid_amount,

            // Additional charges
            'additional_charges_total' => $additionalChargesTotal,
            'additional_charges_paid' => $additionalChargesPaid,

            // Combined totals
            'total' => $payment->total + $additionalChargesTotal,
            'paid_amount' => $payment->paid_amount + $additionalChargesPaid,
            'remaining' => ($payment->total + $additionalChargesTotal) - ($payment->paid_amount + $additionalChargesPaid),

            // Include relationships
            'project' => $payment->project,
            'company' => $payment->company,
            'additionalCharges' => $payment->additionalCharges,
        ];
    }

    // Show a single payment
    // public function show($id)
    // {
    //     // ✅ Include repayments to show breakdown of payments (Cash vs Advance)
    //     $payment = ProjectPayment::with(['project', 'company', 'repayments'])->findOrFail($id);
    //     return response()->json($payment);
    // }

    public function show($id)
    {
        $payment = ProjectPayment::with(['project', 'company', 'repayments', 'additionalCharges'])->findOrFail($id);
        return response()->json($this->enrichPaymentWithCharges($payment));
    }
    // Create a new payment (company_id is sent from frontend, verified)
    // public function store(Request $request)
    // {
    //     try {
    //         $request->validate([
    //             'project_id' => [
    //                 'required',
    //                 'integer',
    //                 Rule::exists('projects', 'id'),
    //             ],
    //             'company_id' => [
    //                 'required',
    //                 'integer',
    //                 Rule::exists('company_info', 'company_id'),
    //             ],
    //             'total' => 'required|numeric',
    //             'paid_amount' => 'nullable|numeric',
    //             'payment_mode' => 'nullable|string',
    //             'worklog_ids' => 'nullable|array',
    //             'invoice_number' => 'required|string|max:100|unique:project_payments,invoice_number',
    //         ]);


    //          $user = Auth::user();
    //             $invoiceNumber = $company->initials . '-' . $company->invoice_counter;
    //             // Increment counter for the next invoice
    //             $company->invoice_counter += 1;
    //             $company->save();


    //         // Create payment record
    //         $payment = ProjectPayment::create($request->all());

    //         return response()->json($payment, 201);

    //     } catch (\Exception $e) {
    //         Log::error('Payment creation failed: ' . $e->getMessage(), [
    //             'trace' => $e->getTraceAsString(),
    //             'request_data' => $request->all(),
    //         ]);

    //         return response()->json([
    //             'message' => 'Failed to create payment.',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'project_id' => [
                    'required',
                    'integer',
                    Rule::exists('projects', 'id'),
                ],
                'company_id' => [
                    'required',
                    'integer',
                    Rule::exists('company_info', 'company_id'),
                ],
                'total' => 'required|numeric',
                'paid_amount' => 'nullable|numeric',
                'payment_mode' => 'nullable|string',
                'worklog_ids' => 'nullable|array',
                'is_advance' => 'nullable|boolean',
                'is_fixed_bid' => 'nullable|boolean',

                // ✅ new optional fields
                'transaction_id' => 'nullable|string|max:255',
                'mode' => 'nullable|string|max:50',
                'remark' => 'nullable|string|max:1000',
            ]);

            // ✅ Fetch company details
            $company = CompanyInfo::where('company_id', $request->company_id)->firstOrFail();

            // ✅ Generate invoice number
            $invoiceNumber = $company->initials . '-' . str_pad($company->invoice_counter, 4, '0', STR_PAD_LEFT);
            $company->invoice_counter += 1;
            $company->save();

            // ✅ Determine advance/fixed bid flag
            $isAdvance = (bool) $request->is_advance;
            $isFixedBid = (bool) $request->is_fixed_bid;

            // ✅ Determine final mode to store
            $finalMode = ($isAdvance || $isFixedBid)
                ? ($request->mode ?? ($isFixedBid ? 'Fixed Bid' : 'Advance'))
                : ($request->payment_mode ?? 'Normal');

            // ✅ Create main payment record
            $payment = ProjectPayment::create([
                'project_id' => $request->project_id,
                'company_id' => $request->company_id,
                'total' => $request->total,
                'paid_amount' => $request->paid_amount ?? 0,
                'payment_mode' => $finalMode, // 👈 always one source of truth
                'worklog_ids' => $request->worklog_ids,
                'invoice_number' => $invoiceNumber,
                'is_advance' => $isAdvance,
                'transaction_id' => $request->transaction_id,
                'remark' => $request->remark,
                'is_fixed_bid' => $isFixedBid,
            ]);

            // ✅ If advance, immediately mark repayment
            if ($isAdvance) {
                Repayment::create([
                    'company_id' => $request->company_id,
                    'project_id' => $request->project_id,
                    'invoice_id' => $payment->invoice_number,
                    'date' => Carbon::now()->toDateString(),
                    'total' => $payment->total,
                    'payment' => $payment->total,
                    'remaining' => 0,
                    'is_completed' => true,
                    'from_advance' => false,
                    'is_advance' => true,
                ]);
            }

            // ✅ If Fixed Bid and has paid amount, mark repayment
            if ($isFixedBid && $request->paid_amount > 0) {
                Repayment::create([
                    'company_id' => $request->company_id,
                    'project_id' => $request->project_id,
                    'invoice_id' => $payment->invoice_number,
                    'date' => Carbon::now()->toDateString(),
                    'total' => $payment->total,
                    'payment' => $request->paid_amount,
                    'remaining' => max(0, $payment->total - $request->paid_amount),
                    'is_completed' => ($payment->total - $request->paid_amount) <= 0,
                    'from_advance' => false,
                    'is_advance' => false,
                ]);
            }

            // ✅ Auto-apply available advance to non-advance invoices
            $advanceAppliedNow = 0.0;
            $availableAdvanceBefore = 0.0;

            // ❌ Disable auto-settlement for Fixed Bid as per user request
            /*
            if (!$isAdvance && !$isFixedBid) {
                $advanceTotal = ProjectPayment::where('company_id', $request->company_id)
                    ->where('project_id', $request->project_id)
                    ->where('is_advance', true)
                    ->sum('total');

                $advanceApplied = Repayment::where('company_id', $request->company_id)
                    ->where('project_id', $request->project_id)
                    ->where('from_advance', true)
                    ->sum('payment');

                $availableAdvance = max(0, $advanceTotal - $advanceApplied);
                $availableAdvanceBefore = $availableAdvance;

                $alreadyPaid = (float)($payment->paid_amount ?? 0);
                $remainingForInvoice = max(0, $payment->total - $alreadyPaid);
                $applyAmount = min($availableAdvance, $remainingForInvoice);

                if ($applyAmount > 0) {
                    Repayment::create([
                        'company_id'   => $request->company_id,
                        'project_id'   => $request->project_id,
                        'invoice_id'   => $payment->id,
                        'date'         => Carbon::now()->toDateString(),
                        'total'        => $remainingForInvoice,
                        'payment'      => $applyAmount,
                        'remaining'    => $remainingForInvoice - $applyAmount,
                        'is_completed' => $applyAmount >= $remainingForInvoice,
                        'from_advance' => true,
                        'is_advance'   => false,
                    ]);

                    $payment->paid_amount = $alreadyPaid + $applyAmount;
                    $payment->save();

                    $advanceAppliedNow = $applyAmount;
                }
            }
            */

            return response()->json([
                'id' => $payment->id,
                'project_id' => $payment->project_id,
                'company_id' => $payment->company_id,
                'total' => $payment->total,
                'paid_amount' => $payment->paid_amount,
                'payment_mode' => $payment->payment_mode,
                'invoice_number' => $payment->invoice_number,
                'advance_applied' => $advanceAppliedNow,
                'available_advance_before' => $availableAdvanceBefore,
                'is_advance' => $payment->is_advance,
                'transaction_id' => $payment->transaction_id,
                'remark' => $payment->remark,
                'is_fixed_bid' => $payment->is_fixed_bid,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Payment creation failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Failed to create payment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    // Update a payment
    public function update(Request $request, $id)
    {
        $payment = ProjectPayment::findOrFail($id);

        $request->validate([
            'total' => 'nullable|numeric',
            'paid_amount' => 'nullable|numeric',
            'payment_mode' => 'nullable|string',
            'worklog_ids' => 'nullable|array',
            'invoice_number' => 'nullable|string|max:100|unique:project_payments,invoice_number,' . $payment->id,
        ]);

        $payment->update($request->all());
        return response()->json($payment);
    }

    // Delete a payment
    public function destroy($id)
    {
        $payment = ProjectPayment::findOrFail($id);
        $payment->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    // Update only paid_amount and payment_mode (nullable)
    // public function updatePaymentStatus(Request $request, $id)
    // {
    //     $payment = ProjectPayment::findOrFail($id);

    //     $request->validate([
    //         'paid_amount' => 'nullable|numeric',
    //         'payment_mode' => 'nullable|string',
    //         'invoice_number' => 'nullable|string|max:100|unique:project_payments,invoice_number,' . $payment->id,
    //     ]);

    //     $payment->update([
    //         'paid_amount' => $request->paid_amount,
    //         'payment_mode' => $request->payment_mode,
    //         'invoice_number' => $request->invoice_number ?? $payment->invoice_number,
    //     ]);

    //     return response()->json([
    //         'message' => 'Payment status updated successfully',
    //         'payment' => $payment,
    //     ]);
    // }


    public function updatePaymentStatus(Request $request, $id)
    {
        $payment = ProjectPayment::findOrFail($id);

        // Validate fields
        $request->validate([
            'paid_amount' => 'required|numeric|min:0',
            'payment_mode' => 'nullable|string',
        ]);

        $incomingPayment = (float) $request->paid_amount;

        if ($incomingPayment < 0) {
            return response()->json([
                'success' => false,
                'message' => 'Payment amount must be greater than 0'
            ], 422);
        }

        // Start database transaction
        \DB::beginTransaction();

        try {
            // Step 1: Calculate remaining amount for invoice
            $invoiceTotal = (float) $payment->total;
            $invoiceAlreadyPaid = (float) $payment->paid_amount;
            $invoiceRemaining = $invoiceTotal - $invoiceAlreadyPaid;

            $remainingPayment = $incomingPayment;

            // Step 2: Allocate to invoice first
            $invoicePayment = 0;
            if ($invoiceRemaining > 0) {
                $invoicePayment = min($invoiceRemaining, $remainingPayment);
                $payment->paid_amount = $invoiceAlreadyPaid + $invoicePayment;
                $remainingPayment -= $invoicePayment;
            }

            // Step 3: Get additional charges for this invoice (in order)
            $additionalCharges = \App\Models\InvoiceAdditionalCharge::where('invoice_id', $payment->invoice_number)
                ->orderBy('id', 'asc')
                ->get();

            $chargesSettled = [];

            $additionalChargesOutstanding = $additionalCharges->sum(function ($c) {
                return max(0, (float) $c->amount - (float) ($c->paid_amount ?? 0));
            });


            // Step 4: Settle additional charges in order
            if ($remainingPayment > 0 && $additionalCharges->count() > 0) {
                foreach ($additionalCharges as $charge) {
                    if ($remainingPayment <= 0)
                        break;

                    $chargeTotal = (float) $charge->amount;
                    $chargeAlreadyPaid = (float) ($charge->paid_amount ?? 0);
                    $chargeRemaining = $chargeTotal - $chargeAlreadyPaid;

                    if ($chargeRemaining > 0) {
                        $chargePayment = min($chargeRemaining, $remainingPayment);

                        // Update charge
                        $charge->paid_amount = $chargeAlreadyPaid + $chargePayment;
                        $charge->is_paid = ($charge->paid_amount >= $charge->amount);
                        $charge->save();

                        $remainingPayment -= $chargePayment;

                        $chargesSettled[] = [
                            'charge_id' => $charge->id,
                            'charge_type' => $charge->charge_type,
                            'amount_paid' => $chargePayment,
                            'is_fully_paid' => $charge->is_paid
                        ];
                    }
                }
            }

            // Step 5: Check if there's still excess payment
            // if ($remainingPayment > 0.01) { // Using 0.01 to handle floating point precision
            //     \DB::rollBack();
            //     return response()->json([
            //         'success' => false,
            //         'message' => 'Payment amount exceeds total outstanding balance',
            //         'details' => [
            //             'incoming_payment' => $incomingPayment,
            //             'invoice_remaining' => $invoiceRemaining,
            //             'additional_charges_total' => $additionalCharges->sum(function ($c) {
            //                 return (float) $c->amount - (float) ($c->paid_amount ?? 0);
            //             }),
            //             'total_outstanding' => $invoiceRemaining + $additionalCharges->sum(function ($c) {
            //                 return (float) $c->amount - (float) ($c->paid_amount ?? 0);
            //             }),
            //             'excess_amount' => round($remainingPayment, 2)
            //         ]
            //     ], 422);
            // }

            if ($remainingPayment > 0.01) {
                \DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'Payment amount exceeds total outstanding balance',
                    'details' => [
                        'incoming_payment' => $incomingPayment,
                        'invoice_remaining' => $invoiceRemaining,
                        'additional_charges_total' => $additionalChargesOutstanding,
                        'total_outstanding' => $invoiceRemaining + $additionalChargesOutstanding,
                        'excess_amount' => round($remainingPayment, 2)
                    ]
                ], 422);
            }

            // Step 6: Update payment mode if provided
            if ($request->has('payment_mode')) {
                $payment->payment_mode = $request->payment_mode;
            }

            // Step 7: Save the payment record
            $payment->save();

            // Commit transaction
            \DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment updated successfully',
                'data' => [
                    'payment' => $payment,
                    'invoice_payment' => $invoicePayment,
                    'charges_settled' => $chargesSettled,
                    'total_allocated' => $incomingPayment
                ]
            ]);

        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Payment status update failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'payment_id' => $id,
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment: ' . $e->getMessage()
            ], 500);
        }
    }
}
