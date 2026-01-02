<?php

namespace App\Http\Controllers;

use App\Models\WorkingType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkingTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $workingType = WorkingType::select('id','type_of_work')
            ->where('company_id', $user->company_id)->get();

        return response()->json($workingType, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $user = Auth::user();
        $companyId = $user->company_id;

        $validated = $request->validate([
            'type_of_work' => 'required|string|max:255'
        ]);

        // Avoid duplicate type per company
        $exists = WorkingType::where('company_id', $companyId)
            ->where('type_of_work', $validated['type_of_work'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Working type already exists for this company'
            ], 409);
        }

        
    $workingType = WorkingType::create([
        'type_of_work' => $validated['type_of_work'],
        'company_id'   => $companyId,
    ]);

        return response()->json([
            'message' => 'Working type created successfully',
            'data' => $workingType
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(WorkingType $workingType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WorkingType $workingType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WorkingType $workingType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkingType $workingType)
    {
        //
    }
}
