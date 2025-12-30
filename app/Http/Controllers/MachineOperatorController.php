<?php

namespace App\Http\Controllers;

use App\Models\MachineOperator;
use Illuminate\Http\Request;

use App\Models\Operator;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Auth;

class MachineOperatorController extends Controller
{

    public function getOperatorsAttribute()
    {
        $operatorIds = json_decode($this->operator_id, true);

        return Operator::whereIn('id', $operatorIds)->get();
    }
    // Show all machine-operator assignments
    public function index()
    {
        try {
            $user = Auth::user();
            $data = MachineOperator::where('company_id', $user->company_id)->get();

            if ($data->isEmpty()) {
                // Return an empty array with 200 so frontend can handle gracefully
                return response()->json([] , 200);
            }

            // Load the operators manually
            $data->each(function ($machine) {
                $machine->operators = $machine->operators; // Calls the accessor
            });

            return response()->json($data);
        } catch (\Exception $e) {
            \Log::error('Error fetching machine operators: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }


    // Store a new machine with operators
    //    public function store(Request $request)
    // {
    //     // Validate the request
    //     $request->validate([
    //         'machine_name' => 'required|string|max:255',
    //         'operator_id'  => 'required|array', // Changed from order_id to operator_id
    //         // 'operator_id.*' => 'exists:operators,id', // Changed from order_id to operator_id
    //     ]);

    //     // Create MachineOperator record (store operator IDs as JSON under operator_id)
    //     $machineOperator = MachineOperator::create([
    //         'machine_name' => $request->machine_name,
    //         'operator_id'  => $request->operator_id, // Changed from order_id to operator_id
    //         'register_number' => $request->register_number,
    //         'ownership_type'  => $request->ownership_type,
    //     ]);

    //     return response()->json([
    //         'message' => 'Machine created and assigned to operators successfully!',
    //         'data'    => $machineOperator->load('operators'),
    //     ], 201);
    // }





    public function store(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'machine_name' => 'required|string|max:255',
                'operator_id'  => 'nullable|array', // Changed from order_id to operator_id
                'mode_id'  => 'nullable|array',
            ]);

            $user = Auth::user();


            // Create MachineOperator record (store operator IDs as JSON under operator_id)
            $machineOperator = MachineOperator::create([
                'machine_name'    => $request->machine_name,
                'operator_id'     => $request->operator_id?? [], // Changed from order_id to operator_id
                'register_number' => $request->register_number,
                'ownership_type'  => $request->ownership_type,
                'price_per_reading' => $request->price_per_reading,
                'company_id'        => $user->company_id,
                'mode_id'         => $request->mode_id?? [],
            ]);

            return response()->json([
                'message' => 'Machine created and assigned to operators successfully!',
                'data' => $machineOperator->toArray() + ['operators' => $machineOperator->operators],
            ], 201);
        }
        // catch (\Illuminate\Validation\ValidationException $e) {
        //     // Return validation errors with 422 status code
        //     return response()->json([
        //         'message' => 'Validation failed',
        //         'errors'  => $e->errors(),
        //     ], 422);

        // } catch (\Exception $e) {
        //     // Return general errors with 500 status code
        //     return response()->json([
        //         'message' => 'An error occurred while creating the machine',
        //         'error'   => $e->getMessage(),
        //     ], 500);
        // }

        catch (\Illuminate\Database\QueryException $e) {
            // Check for duplicate entry errors
            if ($e->errorInfo[1] == 1062) {
                // Extract which unique field caused the duplicate
                $message = 'A record with this value already exists.';
                if (str_contains($e->getMessage(), 'machine_operator_register_number_unique')) {
                      $message = 'Registration number already exists.';
                }

                // if (str_contains($e->getMessage(), 'machine_operator_machine_name_unique')) {
                //     return response()->json([
                //         'message' => 'Machine name already exists.',
                //         'error' => $e->getMessage()
                //     ], 200);
                // }

             return response()->json([
            'success' => false,
            'message' => $message,
        ], 409);
    }

            // Generic DB error fallback
            return response()->json([
                'message' => 'Database error occurred.',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Catch-all fallback for any other issue
            return response()->json([
                'message' => 'An unexpected error occurred while creating the machine',
                'error' => $e->getMessage(),
            ], 500);
        }
    }










    // Show a single record
    public function show($id)
    {
        $data = MachineOperator::with('operators')->findOrFail($id);
        return response()->json($data);
    }
    public function update(Request $request, $id)
    {
        try {
            $machineOperator = MachineOperator::findOrFail($id);

            $request->validate([
                'machine_name'     => 'sometimes|string|max:255',
                'operator_id'      => 'sometimes|array',
                // 'operator_id.*'    => 'exists:operators,id',
                'register_number'  => 'sometimes|string|max:255',
                'ownership_type'   => 'sometimes|string|max:255',
                'price_per_reading' => 'nullable|numeric|min:0',
                'mode_id'      => 'sometimes|array',
            ]);

            // Update machine name
            if ($request->has('machine_name')) {
                $machineOperator->machine_name = $request->machine_name;
            }

            // Update operator IDs (store directly in JSON/array column)
            if ($request->has('operator_id')) {
                $machineOperator->operator_id = $request->operator_id;
            }

            // Update mode IDs (store directly in JSON/array column)
            if ($request->has('mode_id')) {
                $machineOperator->mode_id = $request->mode_id;
            }

            // Update register number
            if ($request->has('register_number')) {
                $machineOperator->register_number = $request->register_number;
            }

            // Update ownership type
            if ($request->has('ownership_type')) {
                $machineOperator->ownership_type = $request->ownership_type;
            }

            if ($request->has('price_per_reading')) {
                $machineOperator->price_per_reading = $request->price_per_reading;
            }

            $machineOperator->save();

            return response()->json([
                'message' => 'Machine-operator record updated!',
                'data'    => $machineOperator, // return updated record
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Machine-operator not found',
                'error'   => $e->getMessage(),
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while updating the record',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }


    // Delete a record
    public function destroy($id)
    {
        $machineOperator = MachineOperator::findOrFail($id);
        $machineOperator->delete();

        return response()->json(['message' => 'Machine-operator record deleted!']);
    }
}
