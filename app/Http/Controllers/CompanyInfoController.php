<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyInfo;
use App\Models\Plan;
use App\Models\User;
use App\Models\ExpenseType;
use Illuminate\Support\Str;


class CompanyInfoController extends Controller
{  
    public function index(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // If API Key (FakeApiUser: id=0, type=0)
    if ($user->id === 0) {
        return CompanyInfo::all();
    }

    // If Sanctum user, check type safely
    $type = $user->type ?? null;

    if ($type === 0) {
        return CompanyInfo::all();
    } elseif ($type === 3) {
        return CompanyInfo::where('refer_by_id', $user->id)->get();
    } elseif (!empty($user->company_id)) {
        return CompanyInfo::where('company_id', $user->company_id)->get();
    }

    // Fallback
    return response()->json(['error' => 'User type not recognized'], 403);
}

    
    public function store(Request $request)
{
    $request->validate([
        'land_mark' => 'required|string|max:255',
        'companyName' => 'required|string|max:255',
        'Tal' => 'string|max:255',
        'Dist' => 'string|max:255',
        'Pincode' => 'nullable|digits:6',
        'phone_no' => [
            'required',
            'digits:10',
            Rule::unique('users', 'mobile'),
            Rule::unique('company_info', 'phone_no')
        ],
        'email_id' => 'required|string|unique:company_info',
        'logo' => 'required|string',
        'sign' => 'required|string',
        'paymentQRCode' => 'required|string', 
        'appMode' => 'required|string',
        'subscribed_plan' => 'required|integer',
        'refer_by_id' => 'required',
        'subscription_validity' => 'required',
        'initials' => 'required|string|max:10' // new field for invoice prefix
    ]);

    // Save the company info to the database
    $CompanyInfo = new CompanyInfo;
    $CompanyInfo->company_name = $request->input('companyName');
    $CompanyInfo->land_mark = $request->input('land_mark');
    $CompanyInfo->tal = $request->input('Tal');
    $CompanyInfo->dist = $request->input('Dist');
    $CompanyInfo->pincode = $request->input('Pincode');
    $CompanyInfo->phone_no = $request->input('phone_no');
    $CompanyInfo->email_id = $request->input('email_id');
    $CompanyInfo->bank_name = $request->input('bank_name') ?? '';
    $CompanyInfo->account_no = $request->input('account_no') ?? '';
    $CompanyInfo->ifsc_code = $request->input('IFSC') ?? '';
    $CompanyInfo->logo = $request->input('logo'); 
    $CompanyInfo->sign = $request->input('sign');  
    $CompanyInfo->paymentQRCode = $request->input('paymentQRCode');  
    $CompanyInfo->appMode = $request->input('appMode');  
    $CompanyInfo->subscription_validity = $request->input('subscription_validity');  
    $CompanyInfo->refer_by_id = $request->input('refer_by_id');  
    $CompanyInfo->block_status = 0;

    // ✅ Handle Free Trial vs Normal plan
    $plan = Plan::find($request->subscribed_plan);
    if ($plan && str_contains(strtolower($plan->name), 'free trial')) {
        $CompanyInfo->subscribed_plan = $plan->id;
        $CompanyInfo->next_plan_id = $request->input('next_plan_id'); // chosen renewal
    } else {
        $CompanyInfo->subscribed_plan = $plan?->id;
        $CompanyInfo->next_plan_id = $plan?->id;
    }

    // NEW: Store initials in uppercase
    $CompanyInfo->initials = strtoupper($request->input('initials'));

    // NEW: Start invoice counter at 1
    $CompanyInfo->invoice_counter = 1;

    $CompanyInfo->save();
    
    // Get the saved company details
    $companyDetails = CompanyInfo::where('email_id', $request->input('email_id'))->firstOrFail();
    
    // Create default expense types for the new company
    $this->createDefaultExpenseTypes($companyDetails->company_id, $request->input('refer_by_id'));

    return response()->json([
        'message' => 'New company is registered successfully',
        'details' => $companyDetails
    ], 200);
}


    public function checkDuplicate(Request $request)
{
    $request->validate([
        'email_id' => 'required|email',
        'phone_no' => 'required|digits:10',
    ]);

    $emailExists = CompanyInfo::where('email_id', $request->email_id)->exists();
    $mobileExists = CompanyInfo::where('phone_no', $request->phone_no)->exists();

    $userMobileExists = User::where('mobile', $request->phone_no)->exists();

    $errors = [];
    if ($emailExists) {
        $errors['email_id'] = 'This email is already taken.';
    }
    if ($mobileExists || $userMobileExists) {
        $errors['phone_no'] = 'This mobile number is already taken.';
    }

    if (!empty($errors)) {
        return response()->json(['errors' => $errors], 422);
    }

    return response()->json(['message' => 'Unique'], 200);
}

   
/**
 * Create default expense types for a new company
 */
private function createDefaultExpenseTypes($companyId, $createdBy)
{
    $defaultExpenseTypes = [
    [
        'name' => 'Diesel Expenses',
        'localName' => 'डिझेल खर्च',
        'expense_category' => 'Other Expense',
        'desc' => 'Diesel related expenses',
        'show' => 1
    ],
    [
        'name' => 'Operator Expenses',
        'localName' => 'ऑपरेटर खर्च',
        'expense_category' => 'Operator Expense',
        'desc' => 'Expenses related to operator work',
        'show' => 1
    ],
    [
        'name' => 'Operator Salary',
        'localName' => 'ऑपरेटर पगार',
        'expense_category' => 'Operator Expense',
        'desc' => 'Monthly operator salary',
        'show' => 1
    ],
    [
        'name' => 'Advance Salary',
        'localName' => 'अॅडव्हान्स पगार',
        'expense_category' => 'Operator Expense',
        'desc' => 'Advance given on salary',
        'show' => 1
    ],
    [
        'name' => 'Blasting Expense',
        'localName' => 'ब्लास्टिंग खर्च',
        'expense_category' => 'Other Expense',
        'desc' => 'Blasting related expenses',
        'show' => 1
    ],
    [
        'name' => 'Machine Maintenance',
        'localName' => 'मशीन देखभाल',
        'expense_category' => 'Machine Expense',
        'desc' => 'Machine maintenance and repairs',
        'show' => 1
    ],
    [
        'name' => 'Machine Servicing',
        'localName' => 'मशीन सर्व्हिसिंग',
        'expense_category' => 'Machine Expense',
        'desc' => 'Machine servicing costs',
        'show' => 1
    ],
    [
        'name' => 'Other',
        'localName' => 'इतर खर्च',
        'expense_category' => 'Other Expense',
        'desc' => 'Miscellaneous expenses',
               'show' => 1
    ]
];

    foreach ($defaultExpenseTypes as $expenseType) {
        ExpenseType::create([
            'company_id' => $companyId,
            'name' => $expenseType['name'],
            'localName' => $expenseType['localName'],
            'expense_category' => $expenseType['expense_category'],
            'desc' => $expenseType['desc'],
            'show' => $expenseType['show'],
            'slug' => Str::slug($expenseType['name']), // slug generated here
            'is_active' => 1,
            'created_by' => $createdBy,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return CompanyInfo::where('company_id', $id)->firstOrFail();
    }

    public function plansAndPartners(){
        $plans = Plan::all();
        $users = User::where('type', 3)->get();
        //Return plans and users in single json object
        return response()->json(['plans' => $plans, 'users' => $users],
        200);
    }

   public function update(Request $request, $id)
{
    $companyInfo = CompanyInfo::where('company_id', $id)->firstOrFail();

    $request->validate([
        'company_name' => 'required|string|max:255',
        'land_mark' => 'required|string|max:255',
        'tal' => 'required|string|max:255',
        'dist' => 'required|string|max:255',
        'pincode' => 'required|digits:6',
        'phone_no' => [
            'required',
            'digits:10',
            Rule::unique('company_info', 'phone_no')->ignore($companyInfo->company_id, 'company_id')
        ],
        'email_id' => [
            'required',
            'email',
            Rule::unique('company_info', 'email_id')->ignore($companyInfo->company_id, 'company_id')
        ],
        'bank_name' => 'nullable|string|max:255',
        'account_no' => 'nullable|string|max:255',
        'IFSC_code' => 'nullable|string|max:255',
        'logo' => 'nullable|string',
        'sign' => 'nullable|string',
        'paymentQRCode' => 'nullable|string',
        'appMode' => 'nullable|string',
        'initials' => 'required|string|max:10'
    ]);

    // Update all fields
    $companyInfo->company_name = $request->input('company_name');
    $companyInfo->land_mark = $request->input('land_mark');
    $companyInfo->Tal = $request->input('tal');
    $companyInfo->Dist = $request->input('dist');
    $companyInfo->pincode = $request->input('pincode');
    $companyInfo->phone_no = $request->input('phone_no');
    $companyInfo->email_id = $request->input('email_id');
    $companyInfo->bank_name = $request->input('bank_name') ?? '';
    $companyInfo->account_no = $request->input('account_no') ?? '';
    $companyInfo->ifsc_code = $request->input('IFSC_code') ?? '';

    // Plan handling
    if ($request->has('subscribed_plan')) {
        $plan = Plan::find($request->subscribed_plan);
        if ($plan) {
            $companyInfo->subscribed_plan = $plan->id;
        }
    }

    // ✅ Always honor frontend's next_plan_id if present
    if ($request->filled('next_plan_id')) {
        $companyInfo->next_plan_id = $request->next_plan_id;
    }

    // Handle optional fields
    if ($request->has('logo') && $request->input('logo') !== null) {
        $companyInfo->logo = $request->input('logo');
    }
    if ($request->has('sign') && $request->input('sign') !== null) {
        $companyInfo->sign = $request->input('sign');
    }
    if ($request->has('paymentQRCode') && $request->input('paymentQRCode') !== null) {
        $companyInfo->paymentQRCode = $request->input('paymentQRCode');
    }
    if ($request->has('appMode') && $request->input('appMode') !== null) {
        $companyInfo->appMode = $request->input('appMode');
    }

    // Store initials in uppercase (same as store method)
    $companyInfo->initials = strtoupper($request->input('initials'));

    $companyInfo->save();

    return response()->json([
        'message' => 'Company info updated successfully',
        'details' => $companyInfo
    ], 200);
}


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = Auth::user();
        if($user->type==0) {
            $company = CompanyInfo::where('company_id', $id)->firstOrFail();
            return $company->delete();
        }
        return response()->json(['message' => 'Not allowed'], 401); 
    }

    /**
 * Get subscription status for a company
 *
 * @param  int  $companyId
 * @return \Illuminate\Http\Response
 */
public function getSubscriptionStatus($companyId)
{
    $user = Auth::user();
    
    // Check if user has permission to view this company's subscription
    if ($user->type == 0) {
        // Admin can view any company
        $company = CompanyInfo::where('company_id', $companyId)->firstOrFail();
    } elseif ($user->type == 1 && $user->company_id == $companyId) {
        // Company admin can view their own company
        $company = CompanyInfo::where('company_id', $companyId)->firstOrFail();
    } elseif ($user->type == 3) {
        // Partner can view companies they referred
        $company = CompanyInfo::where('company_id', $companyId)
                             ->where('refer_by_id', $user->id)
                             ->firstOrFail();
    } else {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // Calculate subscription status
    $subscriptionValidity = $company->subscription_validity;
    $today = now()->startOfDay();
    $validityDate = \Carbon\Carbon::parse($subscriptionValidity)->startOfDay();
    
    $daysRemaining = $today->diffInDays($validityDate, false);
    $isExpired = $daysRemaining < 0;
    $isExpiringSoon = $daysRemaining <= 30 && $daysRemaining >= 0;
    
    // Get plan details if needed
    $plan = null;
    if ($company->subscribed_plan) {
        $plan = Plan::find($company->subscribed_plan);
    }

    return response()->json([
        'company_id' => $company->company_id,
        'subscription_validity' => $company->subscription_validity,
        'subscribed_plan' => $company->subscribed_plan,
        'plan_details' => $plan,
        'days_remaining' => $daysRemaining,
        'is_expired' => $isExpired,
        'is_expiring_soon' => $isExpiringSoon,
        'status' => $isExpired ? 'expired' : ($isExpiringSoon ? 'expiring_soon' : 'active'),
        'validity_date_formatted' => $validityDate->format('Y-m-d'),
        'block_status' => $company->block_status
    ], 200);
}

/**
 * Update subscription validity for a company
 *
 * @param  \Illuminate\Http\Request  $request
 * @return \Illuminate\Http\Response
 */
public function updateSubscriptionValidity(Request $request)
{
    $user = Auth::user();
    
    $request->validate([
        'company_id' => 'required|integer',
        'valid_till' => 'required|date',
        'plan_id' => 'nullable|integer'
    ]);

    $companyId = $request->input('company_id');
    
    // Check if user has permission to update this company's subscription
    if ($user->type == 0) {
        // Admin can update any company
        $company = CompanyInfo::where('company_id', $companyId)->firstOrFail();
    } elseif ($user->type == 1 && $user->company_id == $companyId) {
        // Company admin can update their own company (for renewals)
        $company = CompanyInfo::where('company_id', $companyId)->firstOrFail();
    } elseif ($user->type == 3) {
        // Partner can update companies they referred
        $company = CompanyInfo::where('company_id', $companyId)
                             ->where('refer_by_id', $user->id)
                             ->firstOrFail();
    } else {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // Update subscription validity
    $company->subscription_validity = $request->input('valid_till');
    
    if ($request->has('plan_id') && $request->input('plan_id')) {
        $company->subscribed_plan = $request->input('plan_id');
    }
    
    $company->save();

    return response()->json([
        'success' => true,
        'message' => 'Subscription validity updated successfully',
        'company_id' => $company->company_id,
        'subscription_validity' => $company->subscription_validity,
        'subscribed_plan' => $company->subscribed_plan
    ], 200);
}

/**
 * Block or unblock a company
 *
 * @param  \Illuminate\Http\Request  $request
 * @param  int  $id
 * @return \Illuminate\Http\Response
 */
public function toggleBlockStatus(Request $request, $id)
{
    $user = Auth::user();
    
    $request->validate([
        'block_status' => 'required|boolean'
    ]);

    // Check if user has permission to block/unblock companies
    if ($user->type == 0) {
        // Admin can block/unblock any company
        $company = CompanyInfo::where('company_id', $id)->firstOrFail();
    } elseif ($user->type == 3) {
        // Partner can block/unblock companies they referred
        $company = CompanyInfo::where('company_id', $id)
                             ->where('refer_by_id', $user->id)
                             ->firstOrFail();
    } else {
        return response()->json(['message' => 'Unauthorized to perform this action'], 403);
    }

    // Update only the block status
    $company->block_status = $request->input('block_status');
    $company->save();

    $action = $company->block_status ? 'blocked' : 'unblocked';
    
    return response()->json([
        'success' => true,
        'message' => "Company '{$company->company_name}' has been {$action} successfully",
        'company_id' => $company->company_id,
        'company_name' => $company->company_name,
        'block_status' => $company->block_status
    ], 200);
}

/**
 * Get the next plan ID for a company
 *
 * @param  int  $companyId
 * @return \Illuminate\Http\Response
 */
public function getNextPlanId($companyId)
{
    $user = Auth::user();

    // Check permissions
    if ($user->type == 0) {
        $company = CompanyInfo::where('company_id', $companyId)->firstOrFail();
    } elseif ($user->type == 1 && $user->company_id == $companyId) {
        $company = CompanyInfo::where('company_id', $companyId)->firstOrFail();
    } elseif ($user->type == 3) {
        $company = CompanyInfo::where('company_id', $companyId)
                             ->where('refer_by_id', $user->id)
                             ->firstOrFail();
    } else {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // If no next plan assigned
    if (!$company->next_plan_id) {
        return response()->json([
            'success' => true,
            'company_id' => $company->company_id,
            'next_plan_id' => null,
            'next_plan_details' => null
        ]);
    }

    // Fetch next plan details
    $nextPlan = Plan::find($company->next_plan_id);

    return response()->json([
        'success' => true,
        'company_id' => $company->company_id,
        'next_plan_id' => $company->next_plan_id,
        'next_plan_details' => $nextPlan
    ], 200);
}

/**
 * Update subscription validity for a company
 * ONLY ACCESSIBLE BY ADMIN (userType 0)
 *
 * @param  \Illuminate\Http\Request  $request
 * @return \Illuminate\Http\Response
 */
public function updateCompanyValidity(Request $request)
{
    $user = Auth::user();
    
    // Only allow admin (type 0) to update subscription validity
    if ($user->type != 0) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized. Only administrators can update subscription validity.'
        ], 403);
    }
    
    $request->validate([
        'company_id' => 'required|integer',
        'valid_till' => 'required|date'
    ]);

    $companyId = $request->input('company_id');
    
    // Admin can update any company
    $company = CompanyInfo::where('company_id', $companyId)->first();
    
    if (!$company) {
        return response()->json([
            'success' => false,
            'message' => 'Company not found'
        ], 404);
    }

    // Update only subscription_validity column
    $company->subscription_validity = $request->input('valid_till');
    $company->save();

    return response()->json([
        'success' => true,
        'message' => 'Subscription validity updated successfully',
        'data' => [
            'company_id' => $company->company_id,
            'company_name' => $company->company_name,
            'subscription_validity' => $company->subscription_validity
        ]
    ], 200);
}

}