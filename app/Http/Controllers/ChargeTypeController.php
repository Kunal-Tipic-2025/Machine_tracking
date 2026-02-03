<?php

namespace App\Http\Controllers;

use App\Models\ChargeType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Ensure Auth is imported

class ChargeTypeController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // If user is not authenticated or doesn't have company_id, handle gracefully or rely on middleware
        // Assuming middleware handles auth.
        $companyId = $user->company_id;

        $query = ChargeType::where('company_id', $companyId);
        
        if (!$request->has('all')) {
            $query->where('show', 1);
        }

        $chargeTypes = $query->select('id', 'name', 'local_name', 'amount_deduct', 'show')
            ->get();

        return response()->json($chargeTypes);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'local_name' => 'nullable|string|max:255',
            'amount_deduct' => 'boolean',
            'show' => 'boolean',
        ]);

        $user = Auth::user();
        $companyId = $user->company_id;

        $chargeType = ChargeType::create([
            'company_id' => $companyId,
            'name' => $request->name,
            'local_name' => $request->local_name,
            'amount_deduct' => $request->amount_deduct ?? false,
            'show' => $request->show ?? true,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        return response()->json($chargeType, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'local_name' => 'nullable|string|max:255',
            'amount_deduct' => 'boolean',
            'show' => 'boolean',
        ]);

        $chargeType = ChargeType::where('id', $id)
            ->where('company_id', Auth::user()->company_id)
            ->firstOrFail();

        $chargeType->update([
            'name' => $request->name,
            'local_name' => $request->local_name,
            'amount_deduct' => $request->amount_deduct ?? false,
            'show' => $request->show ?? true,
            'updated_by' => Auth::user()->id,
        ]);

        return response()->json($chargeType);
    }

    public function destroy($id)
    {
        $chargeType = ChargeType::where('id', $id)
            ->where('company_id', Auth::user()->company_id)
            ->firstOrFail();

        // Soft delete by setting show to false, or hard delete?
        // Codebase seems to use 'show' flag for filtering in index.
        // Let's toggle 'show' to 0 (soft delete equivalent for this app's logic)
        $chargeType->update(['show' => false, 'updated_by' => Auth::user()->id]);
        
        return response()->json(['message' => 'Charge type deleted successfully']);
    }
}
