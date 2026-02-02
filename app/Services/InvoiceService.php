<?php

namespace App\Services;

use App\Models\ProjectPayment;

class InvoiceService
{
    /**
     * Calculate all totals for an invoice, ensuring logical consistency.
     *
     * @param ProjectPayment $invoice
     * @return array
     */
    public function calculateInvoiceTotals(ProjectPayment $invoice)
    {
        // 1. Work Order Amount (Base amount from the main invoice record)
        // Adjust column name if 'total' is not the correct column for Work Order Amount.
        // Based on previous context, 'total' seems to be the column.
        $workOrderAmount = (float) $invoice->total;

        // 2. Calculate Additional Charges
        // Ensure relation is loaded or load it
        if (!$invoice->relationLoaded('additionalCharges')) {
            $invoice->load('additionalCharges');
        }

        $additionalChargesTotal = $invoice->additionalCharges->sum('amount');
        $additionalChargesPaid = $invoice->additionalCharges->sum('paid_amount');

        // 3. Calculate Work Order Paid Amount
        // CRITICAL FIX: The 'paid_amount' column on ProjectPayment might contain
        // the GRAND TOTAL paid (legacy data) or just the Work Order paid.
        // We must CLAMP it to the workOrderAmount to prevent double counting
        // if it accidentally includes charge payments or overpayments.
        
        $rawPaidAmount = (float) $invoice->paid_amount;
        
        // Logic: The 'paid_amount' column should nominally track the Work Order payment.
        // If it exceeds Work Order Amount, it *might* be an overpayment OR legacy data
        // where it included charge payments. 
        // To be safe and avoid negative remaining amounts, we cap it.
        $workOrderPaid = min($rawPaidAmount, $workOrderAmount);

        // 4. Calculate Grand Totals
        $grandTotal = $workOrderAmount + $additionalChargesTotal;
        $totalPaid = $workOrderPaid + $additionalChargesPaid;
        
        // 5. Calculate Remaining
        // Ensure it is never negative.
        $remainingAmount = max(0, $grandTotal - $totalPaid);
        
        // 6. Detailed Status
        $status = 'Pending';
        if ($remainingAmount <= 0.01) {
            $status = 'Paid';
        } elseif ($totalPaid > 0) {
            $status = 'Partial';
        }

        return [
            'work_order_amount' => $workOrderAmount,
            'work_order_paid' => $workOrderPaid, // Added missing key
            'work_order_remaining' => max(0, $workOrderAmount - $workOrderPaid),
            'additional_charges_total' => $additionalChargesTotal,
            'additional_charges_paid' => $additionalChargesPaid,
            'grand_total' => $grandTotal,
            'total_paid' => $totalPaid,
            'remaining_amount' => $remainingAmount,
            'status' => $status,
            'raw_db_paid_amount' => $rawPaidAmount // Debug info
        ];
    }
}
