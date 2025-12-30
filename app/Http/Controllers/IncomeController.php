<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Models\IncomeSummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class IncomeController extends Controller
{
    /**
     * GET all incomes
     */
    public function index(Request $request)
{
    $perPage   = $request->get('per_page', 10);
    $projectId = $request->get('project_id');

    $query = Income::with('project:id,project_name')
        ->orderBy('created_at', 'desc');

    if ($projectId) {
        $query->where('project_id', $projectId);
    }

    $incomes = $query->paginate($perPage);

    // Add project_name to each record without changing structure
    $incomes->getCollection()->transform(function ($income) {
        $income->project_name = $income->project?->project_name ?? null;
        unset($income->project);
        return $income;
    });

    // Summary totals (not paginated)
    $summaryQuery = \App\Models\IncomeSummary::query();

    if ($projectId) {
        $summaryQuery->where('project_id', $projectId);
    }

    $totalAmount = $summaryQuery->sum('total_amount');
    $pendingAmount = $summaryQuery->sum('pending_amount');

    return response()->json([
        'incomes' => $incomes,
        'summary' => [
            'total_amount' => $totalAmount,
            'pending_amount' => $pendingAmount,
        ]
    ]);
}



    /**
     * CREATE
     */
    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $validated = $request->validate([
                'project_id'      => 'required|integer',
                'po_no'            => 'required|string',
                'po_date'          => 'required|date',
                'invoice_no'       => 'required|string',
                'invoice_date'     => 'required|date',
                'basic_amount'     => 'required|numeric',
                'gst_amount'       => 'required|numeric',
                'billing_amount'   => 'required|numeric',
                'received_amount'  => 'required|numeric',
                'received_by'      => 'required|string',
                'senders_bank'     => 'required|string',
                'payment_type'     => 'required|in:imps,rtgs,upi,cash,cheque',
                'receivers_bank'   => 'required|string',
                'pending_amount'   => 'required|numeric',
                'remark'            => 'nullable|string',
            ]);

            $validated['company_id'] = auth()->user()->company_id;

            $income = Income::create($validated);

            $today = Carbon::today()->toDateString();

            $summary = IncomeSummary::where('company_id', $validated['company_id'])
                ->where('project_id', $validated['project_id'])
                ->whereDate('date', $today)
                ->first();

            if ($summary) {
                $summary->increment('invoice_count');
                $summary->total_amount += $validated['billing_amount'];
                $summary->pending_amount += $validated['pending_amount'];
                $summary->save();
            } else {
                IncomeSummary::create([
                    'company_id'     => $validated['company_id'],
                    'project_id'     => $validated['project_id'],
                    'date'            => $today,
                    'total_amount'   => $validated['billing_amount'],
                    'pending_amount' => $validated['pending_amount'],
                    'invoice_count'  => 1
                ]);
            }

            return response()->json([
                'message' => 'Income stored successfully',
                'data'    => $income
            ], 201);
        });
    }

    /**
     * UPDATE
     */
    public function update(Request $request, $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $income = Income::findOrFail($id);

            $validated = $request->validate([
                'project_id'      => 'sometimes|integer',
                'po_no'            => 'sometimes|string',
                'po_date'          => 'sometimes|date',
                'invoice_no'       => 'sometimes|string',
                'invoice_date'     => 'sometimes|date',
                'basic_amount'     => 'sometimes|numeric',
                'gst_amount'       => 'sometimes|numeric',
                'billing_amount'   => 'sometimes|numeric',
                'received_amount'  => 'sometimes|numeric',
                'received_by'      => 'sometimes|string',
                'senders_bank'     => 'sometimes|string',
                'payment_type'     => 'sometimes|in:imps,rtgs,upi,cash,cheque',
                'receivers_bank'   => 'sometimes|string',
                'pending_amount'   => 'sometimes|numeric',
                'remark'            => 'nullable|string',
            ]);

            $today = Carbon::parse($income->created_at)->toDateString();

            $summary = IncomeSummary::where('company_id', $income->company_id)
                ->where('project_id', $income->project_id)
                ->whereDate('date', $today)
                ->first();

            if ($summary) {
                $summary->total_amount -= $income->billing_amount;
                $summary->pending_amount -= $income->pending_amount;
                $summary->save();
            }

            $income->update($validated);

            if ($summary) {
                $summary->total_amount += $income->billing_amount;
                $summary->pending_amount += $income->pending_amount;
                $summary->save();
            }

            return response()->json([
                'message' => 'Income updated successfully',
                'data'    => $income
            ], 200);
        });
    }

    /**
     * DELETE
     */
    public function destroy($id)
    {
        return DB::transaction(function () use ($id) {
            $income = Income::findOrFail($id);

            $today = Carbon::parse($income->created_at)->toDateString();

            $summary = IncomeSummary::where('company_id', $income->company_id)
                ->where('project_id', $income->project_id)
                ->whereDate('date', $today)
                ->first();

            if ($summary) {
                $summary->total_amount -= $income->billing_amount;
                $summary->pending_amount -= $income->pending_amount;
                $summary->decrement('invoice_count');
                $summary->save();
            }

            $income->delete();

            return response()->json([
                'message' => 'Income deleted successfully'
            ], 200);
        });
    }
}
