<?php

namespace App\Http\Controllers;

use App\Models\AdvanceRecord;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdvanceController extends Controller
{
     public function pending(Request $request)
    {
        $request->validate([
            'operator_id' => 'required|integer|exists:users,id',
        ]);

        $advances = AdvanceRecord::where('operator_id', $request->operator_id)
            ->where('repayment_amount', null)
            ->orderBy('advance_date', 'asc')
            ->get([
                'id',
                'operator_id',
                'amount',
                'advance_date',
                'remark'
            ]);

        return response()->json($advances);
    }

     /**
     * Store a new advance for an operator
     */
    public function store(Request $request)
    {
        // 1️⃣ Validate request
        $request->validate([
            'operator_id'  => 'required|integer|exists:users,id',
            'company_id'   => 'required|integer',
            'amount'       => 'required|numeric|min:1',
            'advance_date' => 'required|date',
            'remark'       => 'nullable|string|max:255',
        ]);

        // 2️⃣ Create advance record
        $advance = AdvanceRecord::create([
            'operator_id'       => $request->operator_id,
            'amount'            => $request->amount,
            'repayment_amount'  => null,
            'advance_date'      => $request->advance_date,
            'is_settle'         => false,
            'settled_in_salary_id' => null,
            'settled_at'        => null,
            'remark'            => $request->remark,
        ]);

        // 3️⃣ Return response
        return response()->json([
            'message' => 'Advance added successfully',
            'data'    => $advance,
        ], 201);
    }

     /**
     * Settle an advance (mark as repaid)
     */
    public function settle(Request $request)
    {
        // 1️⃣ Validate request
        $request->validate([
            'advance_id'       => 'required|integer|exists:advance_records,id',
            'repayment_amount' => 'required|min:0',
        ]);

        // 2️⃣ Fetch advance
        $advance = AdvanceRecord::findOrFail($request->advance_id);

        // 3️⃣ Prevent double settlement
        // if ($advance->is_settle) {
        //     return response()->json([
        //         'message' => 'Advance already settled'
        //     ], 409);
        // }

        if($advance->repayment_amount){
            return response()->json([
                'message' => 'Advance already settled'
            ], 409);
        }

        // 4️⃣ Settle advance
        $advance->update([
            'repayment_amount' => $request->repayment_amount,
            'updated_at'       => Carbon::now(),
            // settled_in_salary_id stays NULL
        ]);

        // 5️⃣ Response
        return response()->json([
            'message' => 'Advance settled successfully',
            'data' => [
                'id'               => $advance->id,
                'operator_id'      => $advance->operator_id,
                'amount'           => $advance->amount,
                'repayment_amount' => $advance->repayment_amount,
                // 'is_settle'        => false,
                // 'settled_at'       => $advance->settled_at,
            ]
        ]);
    }

    
    /**
     * Get settled advance history for an operator
     */
    public function settledAdvanceHistory(Request $request)
    {
        $request->validate([
            'operator_id' => 'required|integer|exists:users,id',
        ]);

        $settledAdvances = AdvanceRecord::where('operator_id', $request->operator_id)
            ->where('is_settle', true)
            ->orderBy('settled_at', 'desc')
            ->get([
                'id',
                'amount',
                'repayment_amount',
                'advance_date',
                'settled_at',
                'remark',
                'updated_at'
            ]);

        return response()->json($settledAdvances);
    }



    public function repaidButUnsettled(Request $request)
{
    $request->validate([
        'operator_id' => 'required|integer|exists:users,id',
    ]);

    $advances = AdvanceRecord::where('operator_id', $request->operator_id)
        ->where('is_settle', false)
        ->whereNotNull('repayment_amount')
        ->orderBy('advance_date', 'desc')
        ->get([
            'id',
            'amount',
            'repayment_amount',
            'advance_date',
            'settled_at',
            'remark',
            'updated_at'
        ]);

    return response()->json($advances);
}

}
