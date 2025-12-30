<?php

// namespace App\Http\Controllers;

// use Illuminate\Support\Facades\Auth;

// use Illuminate\Http\Request;
// use App\Models\MachineLog;

// class MachineLogController extends Controller
// {
//     public function storeStart(Request $request)
//     {
//          // Check for authenticated user
//         $user = auth()->user();
//         if (!$user) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }

//         // Check for company_id
//         if (!$user->company_id) {
//             return response()->json(['message' => 'Company ID missing for this user'], 422);
//         }

//         $userId = $user->id;
//         $companyId = $user->company_id;

//         $validated = $request->validate([
//             'project_id' => 'required|integer',
//             'operator_id' => 'required|integer',
//             'date' => 'required|string',
//             'machine_id' => 'required|integer',
//             'machine_start' => 'required|string',
//             'machine_start_pic' => 'nullable|string',
//         ]);

//         $data = $request->all();
//         $reading = MachineLog::create([
//                 'company_id'   => $companyId,
//                 'user_id'      => $userId,
//                 'project_id'   => $validated['project_id'],
//                 'work_date'     => $validated['date'],
//                 'machine_id'    => $validated['machine_id'],
//                 'operator_id'   => $validated['operator_id'],
//                 'start_reading' => $validated['machine_start'] ?? null,
//                 'start_photo' => $validated['machine_start_pic'] ?? null,
//         ]);


//         return response()->json([
//             'message' => 'Start reading saved successfully',
//             'data' => $reading
//         ], 201);
//     }

//     // Step 2: Get Pending (status = started)
//     public function getPending(Request $request)
//     {
//         $request->validate([
//             'project_id' => 'required|integer',
//         ]);

//         $pending = MachineLog::where('project_id', $request->project_id)
//                     ->where('status', 'started')
//                     ->get();

//         return response()->json($pending);
//     }

//     // Step 3: Store End Reading
//     public function storeEnd(Request $request, $id)
//     {
//         $request->validate([
//             'machine_end' => 'required|string',
//             'machine_end_pic' => 'nullable|string',
//         ]);

//         $reading = MachineLog::findOrFail($id);

//         $reading->end_reading = $request->machine_end;
//         $reading->end_photo = $request->machine_end_pic;
//         $reading->status = 'completed';
//         $reading->save();

//         return response()->json([
//             'message' => 'End reading updated successfully',
//             'data' => $reading
//         ]);
//     }
//     public function index()
//     {
//         return MachineLog::all();
//     }
// }



// namespace App\Http\Controllers;

// use Illuminate\Support\Facades\Auth;
// use Illuminate\Http\Request;
// use App\Models\MachineLog;

// class MachineLogController extends Controller
// {
//     public function storeStart(Request $request)
//     {
//          // Check for authenticated user
//         $user = auth()->user();
//         if (!$user) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }

//         // Check for company_id
//         if (!$user->company_id) {
//             return response()->json(['message' => 'Company ID missing for this user'], 422);
//         }

//         $userId = $user->id;
//         $companyId = $user->company_id;

//         $validated = $request->validate([
//             'project_id' => 'required|integer',
//             'operator_id' => 'required|integer',
//             'date' => 'required|string',
//             'machine_id' => 'required|integer',
//             'mode_id' => 'required|integer|exists:machine_prices,id', // ✅ NEW: Validation for mode_id (adjust table/column if needed)
//             'machine_start' => 'required|string',
//             'machine_start_pic' => 'nullable|string',
//         ]);

//         $data = $request->all();
//         $reading = MachineLog::create([
//                 'company_id'   => $companyId,
//                 'user_id'      => $userId,
//                 'project_id'   => $validated['project_id'],
//                 'work_date'     => $validated['date'],
//                 'machine_id'    => $validated['machine_id'],
//                 'operator_id'   => $validated['operator_id'],
//                 'mode_id'       => $validated['mode_id'], // ✅ NEW: Include mode_id in creation
//                 'start_reading' => $validated['machine_start'] ?? null,
//                 'start_photo' => $validated['machine_start_pic'] ?? null,
//         ]);


//         return response()->json([
//             'message' => 'Start reading saved successfully',
//             'data' => $reading
//         ], 201);
//     }

//     // Step 2: Get Pending (status = started)
//     public function getPending(Request $request)
//     {
//         $request->validate([
//             'project_id' => 'required|integer',
//         ]);

//         $pending = MachineLog::where('project_id', $request->project_id)
//                     ->where('status', 'started')
//                     ->get();

//         return response()->json($pending);
//     }

//     // Step 3: Store End Reading
//     public function storeEnd(Request $request, $id)
//     {
//         $request->validate([
//             'machine_end' => 'required|string',
//             'machine_end_pic' => 'nullable|string',
//             'mode_id' => 'sometimes|integer|exists:machine_prices,id', // ✅ NEW: Optional update for mode_id (if needed)
//         ]);

//         $reading = MachineLog::findOrFail($id);

//         $reading->end_reading = $request->machine_end;
//         $reading->end_photo = $request->machine_end_pic;
//         $reading->mode_id = $request->mode_id ?? $reading->mode_id; // ✅ NEW: Update mode_id if provided, else keep existing
//         $reading->status = 'completed';
//         $reading->save();

//         return response()->json([
//             'message' => 'End reading updated successfully',
//             'data' => $reading
//         ]);
//     }
//     public function index()
//     {
//         return MachineLog::all();
//     }
// }




// namespace App\Http\Controllers;

// use Illuminate\Support\Facades\Auth;
// use Illuminate\Http\Request;
// use App\Models\MachineLog;

// class MachineLogController extends Controller
// {
//     public function storeStart(Request $request)
//     {
//         // Check for authenticated user
//         $user = auth()->user();
//         if (!$user) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }

//         // Check for company_id
//         if (!$user->company_id) {
//             return response()->json(['message' => 'Company ID missing for this user'], 422);
//         }

//         $userId = $user->id;
//         $companyId = $user->company_id;

//         $validated = $request->validate([
//             'project_id' => 'required|integer',
//             'operator_id' => 'required|integer',
//             'date' => 'required|string',
//             'machine_id' => 'required|integer',
//             'mode_id' => 'required|integer|exists:machine_prices,id',
//             'machine_start' => 'required|string',
//             'machine_start_pic' => 'nullable|string',
//             'price_per_hour' => 'required|numeric|min:0', // ✅ New validation
//         ]);

//         $reading = MachineLog::create([
//             'company_id'     => $companyId,
//             'user_id'        => $userId,
//             'project_id'     => $validated['project_id'],
//             'work_date'      => $validated['date'],
//             'machine_id'     => $validated['machine_id'],
//             'operator_id'    => $validated['operator_id'],
//             'mode_id'        => $validated['mode_id'],
//             'price_per_hour' => $validated['price_per_hour'], // ✅ New field added
//             'start_reading'  => $validated['machine_start'] ?? null,
//             'start_photo'    => $validated['machine_start_pic'] ?? null,
//         ]);

//         return response()->json([
//             'message' => 'Start reading saved successfully',
//             'data' => $reading
//         ], 201);
//     }

//     public function getPending(Request $request)
//     {
//         $request->validate([
//             'project_id' => 'required|integer',
//         ]);

//         $pending = MachineLog::where('project_id', $request->project_id)
//                     ->where('status', 'started')
//                     ->get();

//         return response()->json($pending);
//     }

//     public function storeEnd(Request $request, $id)
//     {
//         $request->validate([
//             'machine_end' => 'required|string',
//             'machine_end_pic' => 'nullable|string',
//             'mode_id' => 'sometimes|integer|exists:machine_prices,id',
//             'price_per_hour' => 'sometimes|numeric|min:0', // ✅ Allow updating price_per_hour if needed
//         ]);

//         $reading = MachineLog::findOrFail($id);

//         $reading->end_reading = $request->machine_end;
//         $reading->end_photo = $request->machine_end_pic;
//         $reading->mode_id = $request->mode_id ?? $reading->mode_id;
//         $reading->price_per_hour = $request->price_per_hour ?? $reading->price_per_hour; // ✅ Update if provided
//         $reading->status = 'completed';
//         $reading->save();

//         return response()->json([
//             'message' => 'End reading updated successfully',
//             'data' => $reading
//         ]);
//     }

//     public function index()
//     {
//         return MachineLog::all();
//     }
// }



// namespace App\Http\Controllers;

// use Illuminate\Support\Facades\Auth;
// use Illuminate\Http\Request;
// use App\Models\MachineLog;
// use App\Models\MachinePrice;

// class MachineLogController extends Controller
// {
//     public function storeStart(Request $request)
//     {
//         // Check for authenticated user
//         $user = auth()->user();
//         if (!$user) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }

//         // Check for company_id
//         if (!$user->company_id) {
//             return response()->json(['message' => 'Company ID missing for this user'], 422);
//         }

//         $userId = $user->id;
//         $companyId = $user->company_id;

//         $validated = $request->validate([
//             'project_id' => 'required|integer',
//             'operator_id' => 'required|integer',
//             'date' => 'required|string',
//             'machine_id' => 'required|integer',
//             'mode_id' => 'required|integer|exists:machine_prices,id',
//             'machine_start' => 'required|string',
//             'machine_start_pic' => 'nullable|string',
//         ]);

//         // Fetch price from MachinePrice table using mode_id
//         $machinePrice = MachinePrice::find($validated['mode_id']);

//         if (!$machinePrice) {
//             return response()->json([
//                 'message' => 'Machine price not found for the selected mode'
//             ], 404);
//         }

//         $reading = MachineLog::create([
//             'company_id'     => $companyId,
//             'user_id'        => $userId,
//             'project_id'     => $validated['project_id'],
//             'work_date'      => $validated['date'],
//             'machine_id'     => $validated['machine_id'],
//             'operator_id'    => $validated['operator_id'],
//             'mode_id'        => $validated['mode_id'],
//             'price_per_hour' => $machinePrice->price, // Fetch price from MachinePrice
//             'start_reading'  => $validated['machine_start'] ?? null,
//             'start_photo'    => $validated['machine_start_pic'] ?? null,
//         ]);

//         return response()->json([
//             'message' => 'Start reading saved successfully',
//             'data' => $reading
//         ], 201);
//     }

//     public function getPending(Request $request)
//     {
//         $request->validate([
//             'project_id' => 'required|integer',
//         ]);

//         // $pending = MachineLog::where('project_id', $request->project_id)
//         //             ->where('status', 'started')
//         //             ->get();

//         $query = MachineLog::where('project_id', $request->project_id)
//             ->where('status', 'started');

//         // Check if user type is 2 (operator)
//         $user = Auth::user();

//         if ($user->type == 2) {
//             $query->where('operator_id', $user->id);
//         }

//         $pending = $query->get();

//         return response()->json($pending);
//     }

//     public function storeEnd(Request $request, $id)
//     {
//         $request->validate([
//             'machine_end' => 'required|string',
//             'machine_end_pic' => 'nullable|string',
//             'mode_id' => 'sometimes|integer|exists:machine_prices,id',
//         ]);

//         $reading = MachineLog::findOrFail($id);

//         $reading->end_reading = $request->machine_end;
//         $reading->end_photo = $request->machine_end_pic;

//         // If mode_id is being updated, fetch new price
//         if ($request->has('mode_id')) {
//             $machinePrice = MachinePrice::find($request->mode_id);

//             if (!$machinePrice) {
//                 return response()->json([
//                     'message' => 'Machine price not found for the selected mode'
//                 ], 404);
//             }

//             $reading->mode_id = $request->mode_id;
//             $reading->price_per_hour = $machinePrice->price;
//         }

//         $reading->status = 'completed';
//         $reading->save();

//         return response()->json([
//             'message' => 'End reading updated successfully',
//             'data' => $reading
//         ]);
//     }

//     //working here
//     public function updatePrice(Request $request, $id)
//     {
//         // Check for authenticated user
//         $user = auth()->user();
//         if (!$user) {
//             return response()->json(['message' => 'Unauthorized'], 401);
//         }

//         // Optional: Check if the log belongs to the user's company (add if needed)
//         // $log = MachineLog::where('id', $id)->where('company_id', $user->company_id)->firstOrFail();

//         $request->validate([
//             'price_per_hour' => 'required|numeric|min:0',
//         ]);

//         $log = MachineLog::findOrFail($id);

//         $log->price_per_hour = $request->price_per_hour;
//         $log->save();

//         return response()->json([
//             'message' => 'Price updated successfully',
//             'data' => $log
//         ], 200);
//     }

//     public function index()
//     {
//         return MachineLog::all();
//     }
// }






namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\MachineLog;
use App\Models\MachinePrice;

class MachineLogController extends Controller
{
    public function storeStart(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (!$user->company_id) {
            return response()->json(['message' => 'Company ID missing for this user'], 422);
        }

        $userId = $user->id;
        $companyId = $user->company_id;

        $validated = $request->validate([
            'project_id' => 'required|integer',
            'operator_id' => 'required|integer',
            'date' => 'required|string',
            'machine_id' => 'required|integer',
            'mode_id' => 'required|integer|exists:machine_prices,id',
            'machine_start' => 'required|string',
            'machine_start_pic' => 'nullable|string',
        ]);

        $machinePrice = MachinePrice::find($validated['mode_id']);

        if (!$machinePrice) {
            return response()->json(['message' => 'Machine price not found for the selected mode'], 404);
        }

        $reading = MachineLog::create([
            'company_id'     => $companyId,
            'user_id'        => $userId,
            'project_id'     => $validated['project_id'],
            'work_date'      => $validated['date'],
            'machine_id'     => $validated['machine_id'],
            'operator_id'    => $validated['operator_id'],
            'mode_id'        => $validated['mode_id'],
            'price_per_hour' => $machinePrice->price,
            'start_reading'  => $validated['machine_start'] ?? null,
            'start_photo'    => $validated['machine_start_pic'] ?? null,
            'isPaid'         => 0, // 👈 default unpaid
        ]);

        return response()->json([
            'message' => 'Start reading saved successfully',
            'data' => $reading
        ], 201);
    }

    public function getPending(Request $request)
    {
        $request->validate([
            'project_id' => 'required|integer',
        ]);

        $query = MachineLog::where('project_id', $request->project_id)
            ->where('status', 'started');

        $user = Auth::user();
        if ($user->type == 2) {
            $query->where('operator_id', $user->id);
        }

        $pending = $query->get();

        return response()->json($pending);
    }

    public function storeEnd(Request $request, $id)
    {
        $request->validate([
            'machine_end' => 'required|string',
            'machine_end_pic' => 'nullable|string',
            'mode_id' => 'sometimes|integer|exists:machine_prices,id',
        ]);

        $reading = MachineLog::findOrFail($id);

        $reading->end_reading = $request->machine_end;
        $reading->end_photo = $request->machine_end_pic;

        if ($request->has('mode_id')) {
            $machinePrice = MachinePrice::find($request->mode_id);
            if (!$machinePrice) {
                return response()->json(['message' => 'Machine price not found for the selected mode'], 404);
            }

            $reading->mode_id = $request->mode_id;
            $reading->price_per_hour = $machinePrice->price;
        }

        $reading->status = 'completed';
        $reading->save();

        return response()->json([
            'message' => 'End reading updated successfully',
            'data' => $reading
        ]);
    }

    public function updatePrice(Request $request, $id)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'price_per_hour' => 'required|numeric|min:0',
        ]);

        $log = MachineLog::findOrFail($id);
        $log->price_per_hour = $request->price_per_hour;
        $log->save();

        return response()->json([
            'message' => 'Price updated successfully',
            'data' => $log
        ], 200);
    }

    // ✅ New function to update or toggle isPaid
    public function updateIsPaid(Request $request, $id)
    {
        $request->validate([
            'isPaid' => 'required|boolean',
        ]);

        $log = MachineLog::findOrFail($id);
        $log->isPaid = $request->isPaid;
        $log->save();

        return response()->json([
            'message' => 'isPaid status updated successfully',
            'data' => $log
        ], 200);
    }

  public function index()
{
    try {
        $user = Auth::user();

        // Fetch machine logs that belong to the user's company
        $data = MachineLog::where('company_id', $user->company_id)
            ->get();

        return response()->json($data, 200);

    } catch (\Exception $e) {
        \Log::error('Error fetching machine logs: ' . $e->getMessage());

        return response()->json([
            'status' => 'error',
            'message' => 'Internal Server Error',
            'details' => $e->getMessage()
        ], 500);
    }
}






    //not sure
    public function show($id)
{
    try {
        // Fetch only the machine log row without relationships
        $log = MachineLog::find($id);

        if (!$log) {
            return response()->json([
                'message' => 'Machine log not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Machine log fetched successfully',
            'data' => $log
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error fetching machine log',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function index1(Request $request)
{
    $query = MachineLog::query();
 
    if ($request->has('company_id')) {
        $query->where('company_id', $request->company_id);
    }
 
    return response()->json($query->get());
}

}
