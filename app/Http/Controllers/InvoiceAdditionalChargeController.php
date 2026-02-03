<?php

namespace App\Http\Controllers;

use App\Models\InvoiceAdditionalCharge;
use App\Models\User;
use Illuminate\Http\Request;


class InvoiceAdditionalChargeController extends Controller
{
    public function storeBulk(Request $request)
    {
        $request->validate([
            'invoice_id' => 'required|string',
            'company_id' => 'required|integer',
            'charges' => 'required|array',
            'charges.*.charge_type' => 'required|string',
            'charges.*.charge_type_id' => 'nullable|integer',
            'charges.*.amount' => 'required|numeric|min:0',
            'charges.*.amount_deduct' => 'nullable|boolean',
            'charges.*.remark' => 'nullable|string',
            'charges.*.is_paid' => 'nullable|boolean',
            'charges.*.date' => 'nullable|date',
        ]);

        foreach ($request->charges as $charge) {
            InvoiceAdditionalCharge::create([
                'invoice_id' => $request->invoice_id,
                'company_id' => $request->company_id,
                'charge_type' => $charge['charge_type'], // Name/Label
                'charge_type_id' => $charge['charge_type_id'] ?? null, // Link to DB
                'amount' => $charge['amount'],
                'amount_deduct' => $charge['amount_deduct'] ?? false,
                'remark' => $charge['remark'] ?? null,
                'is_paid' => false,
                'date' => $charge['date'] ?? now()->toDateString(),
            ]);
        }

        return response()->json([
            'message' => 'Additional charges saved successfully'
        ]);
    }


    public function getByInvoice($invoiceId)
    {
        return InvoiceAdditionalCharge::where('invoice_id', $invoiceId)
            ->with('chargeDefinition')
            ->orderBy('id', 'asc')
            ->get();
    }

    public function update(Request $request, $id)
    {
        $charge = InvoiceAdditionalCharge::findOrFail($id);

        $request->validate([
            'charge_type' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'remark' => 'nullable|string',
            'is_paid' => 'boolean',
        ]);

        $charge->update($request->only([
            'charge_type',
            'amount',
            'remark',
            'is_paid'
        ]));

        return response()->json([
            'message' => 'Additional charge updated successfully',
            'data' => $charge
        ]);
    }


    public function destroy($id)
    {
        InvoiceAdditionalCharge::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Additional charge removed'
        ]);
    }

    //update for sigle charge payment
//     public function updatePaidAmount(Request $request, $id)
// {
//     $request->validate([
//         'paid_amount' => 'required|numeric|min:0',
//     ]);

//     $charge = InvoiceAdditionalCharge::findOrFail($id);

//     // ❌ Do not allow overpayment
//     if ($request->paid_amount > $charge->amount) {
//         return response()->json([
//             'message' => 'Paid amount cannot exceed charge amount'
//         ], 422);
//     }

//     $charge->paid_amount = $request->paid_amount;

//     // ✅ Derived flag
//     $charge->is_paid = $charge->paid_amount >= $charge->amount;

//     $charge->save();

//     return response()->json([
//         'message' => 'Charge payment updated successfully',
//         'data' => $charge
//     ]);
// }

public function updatePaidAmount(Request $request, $id)
{
    $request->validate([
        'paid_amount' => 'required|numeric|min:0',
    ]);

    $charge = InvoiceAdditionalCharge::findOrFail($id);

    $currentPaid = $charge->paid_amount ?? 0;
    $incomingPaid = $request->paid_amount;

    // ❌ Prevent overpayment
    if ($currentPaid + $incomingPaid > $charge->amount) {
        return response()->json([
            'message' => 'Payment exceeds charge amount'
        ], 422);
    }

    // ✅ Accumulate payment
    $charge->paid_amount = $currentPaid + $incomingPaid;

    // ✅ Derived status
    $charge->is_paid = $charge->paid_amount >= $charge->amount;

    $charge->save();

    return response()->json([
        'message' => 'Charge payment updated',
        'data' => $charge
    ]);
}


//bulk auto settlement of charges
// public function autoSettleByInvoice(Request $request)
// {
//     $request->validate([
//         'invoice_id' => 'required|string',
//         'payable_amount' => 'required|numeric|min:0',
//     ]);

//     $remaining = $request->payable_amount;

//     $charges = InvoiceAdditionalCharge::where('invoice_id', $request->invoice_id)
//         ->orderBy('id', 'asc') // FIFO
//         ->get();

//     foreach ($charges as $charge) {
//         if ($remaining <= 0) break;

//         $pending = $charge->amount - $charge->paid_amount;
//         if ($pending <= 0) continue;

//         $settle = min($pending, $remaining);

//         $charge->paid_amount += $settle;
//         $charge->is_paid = $charge->paid_amount >= $charge->amount;
//         $charge->save();

//         $remaining -= $settle;
//     }

//     return response()->json([
//         'message' => 'Additional charges auto-settled',
//         'remaining_amount' => $remaining
//     ]);
// }

public function autoSettleByInvoice(Request $request)
{
    $request->validate([
        'invoice_id' => 'required|string',
        'payable_amount' => 'required|numeric|min:0',
    ]);

    $remaining = (float) $request->payable_amount;

    $charges = InvoiceAdditionalCharge::where('invoice_id', $request->invoice_id)
        ->orderBy('id', 'asc') // FIFO
        ->get();

    foreach ($charges as $charge) {
        if ($remaining <= 0) break;

        $amount = (float) $charge->amount;
        $paid   = (float) $charge->paid_amount;

        $pending = $amount - $paid;

        if ($pending <= 0) {
            continue;
        }

        $settleNow = min($pending, $remaining);
$settleNow = min($pending, $remaining);

        // ✅ accumulate, do NOT overwrite
        $charge->paid_amount = $paid + $settleNow;
        $charge->is_paid = ($charge->paid_amount >= $amount);
        $charge->save();

        $remaining -= $settleNow;
        
    }

    return response()->json([
        'message' => 'Additional charges settled',
        'remaining_unallocated' => $remaining
    ]);
}


}
