<?php

// namespace App\Http\Controllers;

// use App\Models\Project;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;

// class ProjectController extends Controller
// {
//     public function allProject()
//     {
//         return Project::all();
//     }


//     public function myProjects()
// {
//     $user = Auth::user();

//     if ($user->type == 1) {
//         // Admin (type 1) → show all projects within their company
//         $projects = Project::with(['supervisor:id,name', 'user:id,name'])
//             ->where('company_id', $user->company_id)
//             ->get();
//     } elseif ($user->type == 2) {
//         // Supervisor/User (type 2) → show only their projects within their company
//         $projects = Project::with(['supervisor:id,name', 'user:id,name'])
//             ->where('company_id', $user->company_id)
//             ->where(function ($query) use ($user) {
//                 $query->where('supervisor_id', $user->id)
//                       ->orWhere('user_id', $user->id);
//             })
//             ->get();
//     } else {
//         // Other types → return empty
//         $projects = collect([]);
//     }

//     return response()->json($projects);
// }









//     //  public function index()
//     // {
//     //     return Project::where('is_visible',1)->get();
//     // }
// //     public function index()
// // {
// //     $user = Auth::user();

// //     if ($user->type == 1) {
// //         // Admin → show all projects from their company only
// //         $projects = Project::where('company_id', $user->company_id)->get();
// //     } elseif ($user->type == 2) {
// //         // Supervisor/User → show only their allocated projects within their company
// //         $projects = Project::where('company_id', $user->company_id)
// //             ->where(function ($query) use ($user) {
// //                 $query->where('supervisor_id', $user->id)
// //                       ->orWhere('user_id', $user->id);
// //             })
// //             ->get();
// //     } else {
// //         // Other types → no projects
// //         $projects = collect([]);
// //     }

// //     return response()->json($projects);
// // }

// public function index(Request $request)
// {
//     $user = Auth::user();

//     // Base query with customer fields
//     $query = Project::select(
//             'id',
//             'project_name',
//             'customer_name',
//             'mobile_number',
//             'work_place',
//             'project_cost',
//             'gst_number',
//             'remark',
//             'start_date',
//             'end_date',
//             'company_id',
//             'user_id',
//             'supervisor_id',
//             'is_visible'
//         )
//         ->where('company_id', $user->company_id)
//         ->where('is_visible', true);

//     // Restrict for supervisor/user type
//     if ($user->type == 2) {
//         $query->where(function ($q) use ($user) {
//             $q->where('supervisor_id', $user->id)
//               ->orWhere('user_id', $user->id);
//         });
//     }

//     // Optional search
//     if ($request->has('searchQuery') && !empty($request->searchQuery)) {
//         $search = $request->searchQuery;
//         $query->where(function ($q) use ($search) {
//             $q->where('project_name', 'like', "%{$search}%")
//               ->orWhere('customer_name', 'like', "%{$search}%")
//               ->orWhere('mobile_number', 'like', "%{$search}%")
//               ->orWhere('work_place', 'like', "%{$search}%")
//               ->orWhere('project_cost', 'like', "%{$search}%");
//         });
//     }

//     $projects = $query->get()->map(function ($p) {
//         return [
//             'id'            => $p->id,
//             'project_name'  => $p->project_name,
//             'customer_id'   => $p->id, // or keep a real customer_id if exists
//             'customer_name' => $p->customer_name ?? 'N/A',
//             'mobile_number' => $p->mobile_number ?? 'N/A',
//             'work_place'    => $p->work_place,
//             'project_cost'  => $p->project_cost,
//             'gst_number'    => $p->gst_number,
//             'remark'        => $p->remark,
//             'start_date'    => $p->start_date,
//             'end_date'      => $p->end_date,
//             'customer'      => [
//                 'name'    => $p->customer_name ?? 'N/A',
//                 'address' => $p->work_place ?? 'N/A',
//                 'mobile'  => $p->mobile_number ?? 'N/A',
//             ]
//         ];
//     });

//     return response()->json($projects);
// }




//     // public function store(Request $request)
//     // {
//     //     $data = $request->validate([
//     //         'project_name' => 'required|string|max:255',
//     //         'work_place'   => 'nullable|string|max:255',
//     //         'start_date'   => 'nullable|date',
//     //         'end_date'     => 'nullable|date',
//     //         'is_visible'   => 'boolean',
//     //         'remark'       => 'nullable|string',
//     //     ]);

//     //     $project = Project::create($data);
//     //     return response()->json($project, 201);
//     // }
//     public function store(Request $request)
// {
//     $user = auth()->user(); // Get logged-in user

//     $data = $request->validate([
//         'customer_name' => 'required|string|max:255',
//         'mobile_number' => 'required|string|max:255',
//         'project_name'  => 'required|string|max:255', 
//         'project_cost'  => 'required|string|max:255',
//         'work_place'    => 'nullable|string|max:255',
//         'start_date'    => 'nullable|date',
//         'end_date'      => 'nullable|date',
//         'is_visible'    => 'boolean',
//         'remark'        => 'nullable|string',
//         'supervisor_id' => 'nullable|numeric',   // numeric field
//         'commission'    => 'nullable|numeric',   // numeric field
//         'gst_number'    => 'nullable|string|max:255',
//     ]);

//     // Add user and company automatically
//     $data['user_id'] = $user->id;
//     $data['company_id'] = $user->company_id;

//     $project = Project::create($data);

//     return response()->json($project, 201);
// }


//     public function show(Project $project)
//     {
//         return $project;
//     }

//     // public function update(Request $request, Project $project)
//     // {
//     //     $data = $request->validate([
//     //         'customer_name' => 'required|string|max:255',
//     //         'project_name' => 'nullable|string|max:255',
//     //         'work_place'   => 'nullable|string|max:255',
//     //         'start_date'   => 'nullable|date',
//     //         'end_date'     => 'nullable|date',
//     //         'is_visible'   => 'boolean',
//     //         'remark'       => 'nullable|string',
//     //     ]);

//     //     $project->update($data);
//     //     return response()->json($project);
//     // }
//     public function update(Request $request, $id)
// {
//     $project = Project::findOrFail($id);

//     if ($request->has('is_visible')) {
//         $request->validate([
//             'is_visible' => 'required|boolean'
//         ]);
//         $project->is_visible = $request->is_visible;
//         $project->save();

//         return response()->json([
//             'success' => true,
//             'message' => 'Visibility updated successfully',
//             'project' => $project
//         ]);
//     }

//     // existing full update logic for other fields
//     $request->validate([
//           'customer_name' => 'required|string|max:255',
//         'mobile_number' => 'required|string|max:255',
//         'project_name'  => 'required|string|max:255', 
//         'project_cost'  => 'required|string|max:255',
//         'work_place'    => 'nullable|string|max:255',
//         'start_date'    => 'nullable|date',
//         'end_date'      => 'nullable|date',
//         'is_visible'    => 'boolean',
//         'remark'        => 'nullable|string',
//         'supervisor_id' => 'nullable|numeric',   // numeric field
//         'commission'    => 'nullable|numeric',   // numeric field
//         'gst_number'    => 'nullable|string|max:255',
//     ]);
//     $project->update($request->all());

//     return response()->json(['success' => true, 'message' => 'Project updated']);
// }


//     public function destroy(Project $project)
//     {
//         $project->delete();
//         return response()->json(null, 204);
//     }
// }


// <?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    // Get all projects (Admin view)
    public function allProject()
    {
         $user = Auth::user();

          $projects = Project::where('company_id', $user->company_id)
                ->get();

        return  $projects;
    }

    // Get projects for the logged-in user
    public function myProjects()
    {
        $user = Auth::user();

        if ($user->type == 1) {
            // Admin → all projects in the company
            $projects = Project::with(['supervisor:id,name', 'user:id,name'])
                ->where('company_id', $user->company_id)
                ->get();
        }

        
        //temporary all projects 
         elseif ($user->type == 2) {
            // Supervisor/User → only their projects
           $projects = Project::with(['user:id,name'])
                ->where('company_id', $user->company_id)
                ->get();
        }  
        else {
            $projects = collect([]);
        }

        return response()->json($projects);
    }

    // Index with optional search
    //This is used for searching purpose
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Project::select(
            'id','project_name','customer_name','mobile_number','work_place',
            'project_cost','gst_number','remark','start_date','end_date', 'paidamount',
            'company_id','user_id','supervisor_id','is_visible','operator_id','machine_id'
        )
        ->where('company_id', $user->company_id)
        ->where('is_visible', true);



        if ($request->has('searchQuery') && !empty($request->searchQuery)) {
            $search = $request->searchQuery;
            $query->where(function ($q) use ($search) {
                $q->where('project_name', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('mobile_number', 'like', "%{$search}%")
                  ->orWhere('work_place', 'like', "%{$search}%")
                  ->orWhere('project_cost', 'like', "%{$search}%");
            });
        }

        $projects = $query->get()->map(function ($p) {
            return [
                'id'            => $p->id,
                'project_name'  => $p->project_name,
                'company_id'  => $p->company_id,
                'customer_name' => $p->customer_name ?? 'N/A',
                'mobile_number' => $p->mobile_number ?? 'N/A',
                'work_place'    => $p->work_place,
                'project_cost'  => $p->project_cost,
                'gst_number'    => $p->gst_number,
                'remark'        => $p->remark,
                'start_date'    => $p->start_date,
                'end_date'      => $p->end_date,
                'paidamount'    => $p->paidamount,
                'operator_id'   => $p->operator_id ?? [0], // JSON array
                'machine_id'    => $p->machine_id ?? [],
                'customer'      => [
                    'name'    => $p->customer_name ?? 'N/A',
                    'address' => $p->work_place ?? 'N/A',
                    'mobile'  => $p->mobile_number ?? 'N/A',
                ]
            ];
        });

        return response()->json($projects);
    }

    // Store a new project
    public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'customer_name' => 'required|string|max:255',
            'mobile_number' => 'required|string|max:255',
            'project_name'  => 'nullable|string|max:255', 
            'project_cost'  => 'nullable|string|max:255',
            'work_place'    => 'nullable|string|max:255',
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|date',
            'is_visible'    => 'boolean',
            'remark'        => 'nullable|string',
            'supervisor_id' => 'nullable|numeric', 
            'commission'    => 'nullable|numeric', 
            'gst_number'    => 'nullable|string|max:255',
            'paidamount'    => 'nullable|numeric',
            'operator_id'   => 'nullable|array',       // Accept array
            // 'operator_id.*' => 'numeric',              // Each element must be numeric
            'machine_id'    => 'sometimes|array',       // Accept array
            'machine_id.*'  => 'numeric',              // Each element must be numeric
            '     '      => 'nullable|string|max:255',
        ]);

        $data['user_id'] = $user->id;
        $data['company_id'] = $user->company_id;

        // Default paidamount to 0 if not provided
        $data['paidamount'] = $data['paidamount'] ?? 0;
        $data['supervisor_id'] = $user->id ?? null; 

        $project = Project::create($data);

        return response()->json($project, 201);
    }

    // Show a single project
    public function show(Project $project)
    {
        return response()->json($project);
    }

    // Update a project
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        // Lightweight toggle-only update path for visibility
        $payload = $request->except(['_method']);
        if (array_key_exists('is_visible', $payload) && count($payload) === 1) {
            $request->validate([
                'is_visible' => 'required|boolean',
            ]);

            $project->is_visible = $request->boolean('is_visible');
            $project->save();

            return response()->json([
                'success' => true,
                'message' => 'Visibility updated successfully',
                'project' => $project,
            ]);
        }

        // Lightweight update path for operator assignment
        if (array_key_exists('operator_id', $payload) && count($payload) === 1) {
            $request->validate([
                'operator_id'   => 'nullable|array',
                'operator_id.*' => 'numeric',
            ]);

            $project->operator_id = $request->input('operator_id', []);
            $project->save();

            return response()->json([
                'success' => true,
                'message' => 'Project operators updated successfully',
                'project' => $project,
            ]);
        }

        // Lightweight update path for machine assignment
        if (array_key_exists('machine_id', $payload) && count($payload) === 1) {
            $request->validate([
                'machine_id'   => 'sometimes|array',
                'machine_id.*' => 'numeric',
            ]);

            $project->machine_id = $request->input('machine_id', []);
            $project->save();

            return response()->json([
                'success' => true,
                'message' => 'Project machines updated successfully',
                'project' => $project,
            ]);
        }

        // Full update path
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'mobile_number' => 'required|string|max:255',
            'project_name'  => 'nullable|string|max:255',
            'project_cost'  => 'nullable|string|max:255',
            'work_place'    => 'nullable|string|max:255',
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|date',
            'is_visible'    => 'boolean',
            'remark'        => 'nullable|string',
            'supervisor_id' => 'nullable|numeric',
            'commission'    => 'nullable|numeric',
            'gst_number'    => 'nullable|string|max:255',
            'paidamount'    => 'nullable|numeric',
            'operator_id'   => 'nullable|array',
            'operator_id.*' => 'numeric',
            'machine_id'    => 'sometimes|array',
            'machine_id.*'  => 'numeric',
        ]);

        $updateData = $request->all();
        if (!array_key_exists('paidamount', $updateData)) {
            // keep existing on partial updates; if provided but empty, set to 0
            // do nothing
        }
        $project->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Project updated',
            'project' => $project,
        ]);
    }




    // Update only the paid amount
public function updatePaidAmount(Request $request, $id)
{
    $project = Project::findOrFail($id);

    $request->validate([
        'paidamount' => 'required|numeric|min:0',
    ]);

    $project->paidamount = $request->input('paidamount');
    $project->save();

    return response()->json([
        'success' => true,
        'message' => 'Paid amount updated successfully',
        'project' => $project,
    ]);
}


    // Delete a project
    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(null, 204);
    }
}
