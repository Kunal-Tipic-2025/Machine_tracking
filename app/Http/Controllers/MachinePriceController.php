<?php

namespace App\Http\Controllers;

use App\Models\MachinePrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

  class MachinePriceController extends Controller
{
    // Display all records
    public function index()
    {
        // return response()->json(MachinePrice::with('machine')->get());
         try {
            $user = Auth::user();

            // Fetch only records that belong to the user's company
            $data = MachinePrice::with('machine')
                ->where('company_id', $user->company_id)
                ->get();

            if ($data->isEmpty()) {
                // Return empty list (not 404) so UI can render no-data states
                return response()->json([], 200);
            }

            return response()->json($data);

        } catch (\Exception $e) {
            \Log::error('Error fetching machine prices: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    // // Store a new record
    // public function store(Request $request)
    // {
        
    //     $validated = $request->validate([
    //         'machine_id' => 'required|integer',
    //         'price' => 'required|numeric',
    //         'mode' => 'required|string',
    //     ]);

    //     $machinePrice = MachinePrice::create($validated);
    //     return response()->json(['message' => 'Record created successfully', 'data' => $machinePrice]);
    // }


         public function store(Request $request)
    {
        try {
            $user = Auth::user();

            $validated = $request->validate([
                'price'      => 'required|numeric',
                'mode'       => 'required|string',
            ]);

            // Create record with company_id of logged-in user
            $machinePrice = MachinePrice::create([
                'company_id' => $user->company_id,
                'price'      => $validated['price'],
                'mode'       => $validated['mode'],
            ]);

            return response()->json([
                'message' => 'Record created successfully',
                'data'    => $machinePrice,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Error creating machine price: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
    
    // Show a single record
    public function show($id)
    {
        $machinePrice = MachinePrice::with('machine')->findOrFail($id);
        return response()->json($machinePrice);
    }

    // Update record
    public function update(Request $request, $id)
    {
        $machinePrice = MachinePrice::findOrFail($id);

        $validated = $request->validate([
            'price' => 'sometimes|numeric',
            'mode' => 'sometimes|string',
        ]);

        $machinePrice->update($validated);
        return response()->json(['message' => 'Record updated successfully', 'data' => $machinePrice]);
    }

    // Delete record
    public function destroy($id)
    {
        MachinePrice::findOrFail($id)->delete();
        return response()->json(['message' => 'Record deleted successfully']);
    }
}
