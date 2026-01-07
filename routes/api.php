<?php

use App\Http\Controllers\AdvanceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\SubSubCategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\JarTrackerController;
use App\Http\Controllers\ExpenseTypeController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FileUpload;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MachineOperatorController;
use App\Http\Middleware\Authorization;
use App\Http\Controllers\CompanyInfoController;
use App\Http\Controllers\WhatsAppController;
use App\Http\Controllers\PaymentTrackerController; // Added controller
use App\Http\Controllers\MailController;
use App\Http\Controllers\CsvUploadController;
use App\Http\Controllers\RazorpayController;
use App\Http\Controllers\CompanyReceiptController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\RawMaterialController;
use App\Http\Controllers\CompanyValidityController;
use App\Http\Controllers\MachineLogController;
use App\Http\Controllers\CompanyController;

use App\Http\Controllers\OnboardingPartnerController;
use App\Http\Controllers\OnboardingPartnerTypeController;
use App\Http\Controllers\CustomerOrdersController;
use App\Http\Controllers\DeadStockController;

// Import the TipicAdminDashboardController
use App\Http\Controllers\TipicAdminDashboardController;
use App\Http\Controllers\ProjectController;

use App\Http\Controllers\DrillingController;

use App\Http\Controllers\OtpController;
use App\Http\Controllers\OperatorController;
use App\Http\Controllers\TransactionController;

use App\Http\Controllers\MachineryController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\ProjectSummaryController;

use App\Http\Controllers\VendorPaymentController;
use App\Http\Controllers\MachinePriceController;
use App\Http\Controllers\OperatorReportDashboardController;
use App\Http\Controllers\UploadController;


use App\Http\Controllers\ProjectPaymentController;
//new one for repayment
use App\Http\Controllers\RepaymentController;
use App\Http\Controllers\SalaryController;

// List all repayments
Route::get('/repayments', [RepaymentController::class, 'index']);

// Specific routes must come BEFORE parameterized routes to avoid route conflicts
//Advance taken - MUST be before /repayments/{id} route
Route::put('/repayments/mark-advance-taken', [RepaymentController::class, 'markAdvanceTaken']);

//check here latest one
Route::post('/repayment/single', [RepaymentController::class, 'createSingleRepayment']);
// Advance payment (creates an advance invoice and matching repayment)
Route::post('/advance-payment', [RepaymentController::class, 'storeAdvance']);

// Create a new repayment
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/repayments', [RepaymentController::class, 'store']);
});

// Show a single repayment
Route::get('/repayments/{id}', [RepaymentController::class, 'show'])->name('repayments.show');

// Update a repayment
Route::put('/repayments/{id}', [RepaymentController::class, 'update'])->name('repayments.update');

// Delete a repayment
Route::delete('/repayments/{id}', [RepaymentController::class, 'destroy'])->name('repayments.destroy');

// Optional: Mark repayment as completed manually (if you want a special route)
Route::put('/repayments/{id}/complete', [RepaymentController::class, 'markAsCompleted'])->name('repayments.complete');


// List all project payments
Route::get('/project-payments', [ProjectPaymentController::class, 'index'])->name('project-payments.index');

// Show a single project payment
Route::get('/project-payments/{id}', [ProjectPaymentController::class, 'show'])->name('project-payments.show');

// Create a new project payment
Route::post('/project-payments', [ProjectPaymentController::class, 'store'])->name('project-payments.store');

// Update a project payment
Route::put('/project-payments/{id}', [ProjectPaymentController::class, 'update'])->name('project-payments.update');

// Delete a project payment
Route::delete('/project-payments/{id}', [ProjectPaymentController::class, 'destroy'])->name('project-payments.destroy');

Route::put('/project-payments/{id}/isPaid', [ProjectPaymentController::class, 'updateIsPaid']);





Route::get('/machine-logs/{id}', [MachineLogController::class, 'show']);


//check here
Route::put('/project-payments/{id}/status', [ProjectPaymentController::class, 'updatePaymentStatus']);

// Route::get('/machine-price', [MachinePriceController::class, 'index'])->name('machine-price.index');
// Route::get('/machine-price/{id}', [MachinePriceController::class, 'show'])->name('machine-price.show');
// Route::post('/machine-price', [MachinePriceController::class, 'store'])->name('machine-price.store');
// Route::put('/machine-price/{id}', [MachinePriceController::class, 'update'])->name('machine-price.update');
// Route::delete('/machine-price/{id}', [MachinePriceController::class, 'destroy'])->name('machine-price.destroy');




Route::get('/expense', [ExpenseController::class, 'index'])->name('expense.index');
Route::get('/expense/{id}', [ExpenseController::class, 'show'])->name('expense.show');
// Route::post('/expense', [ExpenseController::class, 'store'])->name('expense.store');
Route::put('/expense/{id}', [ExpenseController::class, 'update'])->name('expense.update');
Route::delete('/expense/{id}', [ExpenseController::class, 'destroy'])->name('expense.destroy');
Route::get('/expense-report', [ExpenseController::class, 'expenseReport'])->name('expense.report');





// New debugging and sync routes
Route::post('/projects/{projectId}/sync-vendor-payments', [BudgetController::class, 'syncVendorPaymentsForProject']);
Route::get('/vendor-payments/{projectId}/debug', [VendorPaymentController::class, 'debugProject']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/project-summary', [ProjectSummaryController::class, 'index']);
    Route::get('/vendors', [OperatorController::class, 'showVendors']);
    Route::get('/vendor-payments/{projectId}', [VendorPaymentController::class, 'index']);
    Route::post('/vendor-payments/{vendorPaymentId}/pay', [VendorPaymentController::class, 'storePayment']);
    Route::get('/vendor-payments/{vendorPaymentId}/logs', [VendorPaymentController::class, 'logs']);
    Route::put('/vendor-payment-logs/{logId}', [VendorPaymentController::class, 'updateLog']);
    Route::delete('/vendor-payment-logs/{logId}', [VendorPaymentController::class, 'deleteLog']);
});



Route::middleware('auth:sanctum')->group(function () {
    Route::get('/budgets', [BudgetController::class, 'index']);
    Route::post('/budgets', [BudgetController::class, 'store']);
    Route::get('/budgets/{id}', [BudgetController::class, 'show']);
    Route::post('/budgets/{id}', [BudgetController::class, 'update']);
    Route::delete('/budgets/{id}', [BudgetController::class, 'destroy']);
});


// Admin Dashboard Routes - Protected by authentication middleware
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {

    // Main Dashboard Overview
    Route::get('/dashboard/overview', [TipicAdminDashboardController::class, 'getDashboardOverview']);

    // Individual Dashboard Components
    Route::get('/dashboard/sales-summary', [TipicAdminDashboardController::class, 'getAllCompaniesSales']);
    Route::get('/dashboard/partners-summary', [TipicAdminDashboardController::class, 'getSalesPartnersSummary']);
    Route::get('/dashboard/payment-overview', [TipicAdminDashboardController::class, 'getPaymentOverview']);
    Route::get('/dashboard/commission-summary', [TipicAdminDashboardController::class, 'getAllPartnersCommissionSummary']);
    Route::get('/dashboard/renewal-alerts', [TipicAdminDashboardController::class, 'getRenewalAlerts']);

    // Detailed Reports
    Route::get('/company/{companyId}/detailed-sales', [TipicAdminDashboardController::class, 'getCompanyDetailedSales']);
    Route::get('/partner/{partnerId}/detailed-commission', [TipicAdminDashboardController::class, 'getPartnerDetailedCommission']);

    // Trends and Analytics
    Route::get('/dashboard/monthly-trends', [TipicAdminDashboardController::class, 'getMonthlyTrends']);
});
Route::put('/projects/{id}/paidamount', [ProjectController::class, 'updatePaidAmount']);

// Alternative route structure (if you prefer a different organization)
Route::middleware(['auth:sanctum'])->group(function () {

    Route::resource('projects', ProjectController::class);
    Route::get('/allProject', [ProjectController::class, 'allProject']);
    Route::get('/myProjects', [ProjectController::class, 'myProjects']);

    // ____________________________________________________________________________________________________ 
    // infra soft
    Route::post('/drilling', [DrillingController::class, 'store']);
    Route::get('/drilling', [DrillingController::class, 'index']);
    Route::get('/getDataByUserId', [DrillingController::class, 'getDataByUserId']);
    Route::get('/drilling-records', [DrillingController::class, 'invoice']);
    Route::get('/profitLossReport', [OrderController::class, 'profitLossReport']);
    Route::get('/drilling/filter', [DrillingController::class, 'filterRecords']);
    Route::put('/drilling/{id}', [DrillingController::class, 'update']);
    Route::get('/drilling/{id}', [DrillingController::class, 'getById']);
    Route::delete('/drilling/{id}', [DrillingController::class, 'destroy']);

    //Machine Tracking
    // Route::post('/machineLog', [MachineLogController::class, 'store']);
    Route::get('/machineLog', [MachineLogController::class, 'index']);
    Route::post('/start', [MachineLogController::class, 'storeStart']);
    Route::get('/pending', [MachineLogController::class, 'getPending']);
    Route::post('/end/{id}', [MachineLogController::class, 'storeEnd']);
    Route::put('/machine-logs/{id}/price', [MachineLogController::class, 'updatePrice']);

    Route::put('/machine-logs/{id}/isPaid', [MachineLogController::class, 'updateIsPaid']);
    // Or if you prefer POST: Route::post('/machine-logs/{id}/price', [MachineLogController::class, 'updatePrice']);

    //infra soft Samir

    Route::get('/operators-by-product', [TransactionController::class, 'getOperatorsByProduct']);
    Route::post('/transactions/pay', [TransactionController::class, 'storeTransaction']);
    Route::get('/supervisor-payments', [TransactionController::class, 'getSupervisorPayments']);
    // Get all operators
    Route::get('/operators', [OperatorController::class, 'index']);

    // Create new operator
    Route::post('/operators', [OperatorController::class, 'store']);

    // Get specific operator by ID
    Route::get('/operators/{id}', [OperatorController::class, 'show']);

    Route::get('/operatorsByCompanyId', [OperatorController::class, 'showComapnyIdWise']);
    Route::get('/operatorsByCompanyIdOperator', [OperatorController::class, 'showComapnyIdWiseOperator']);

    Route::get('/operatorsByType', [OperatorController::class, 'showTypeWise']);

    // Update specific operator
    Route::put('/operators/{id}', [OperatorController::class, 'update']);
    Route::patch('/operators/{id}', [OperatorController::class, 'update']); // optional for partial updates

    // Delete specific operator
    Route::delete('/operators/{id}', [OperatorController::class, 'destroy']);

    // users data
    Route::get('/usersData', [AuthController::class, 'getCompanyType2Users']);

    // ✅ List all machineries
    Route::get('/machineries', [MachineryController::class, 'index']);

    // ✅ Create new machinery
    Route::post('/machineries', [MachineryController::class, 'store']);

    // ✅ Get single machinery by ID
    Route::get('/machineries/{id}', [MachineryController::class, 'show']);

    // ✅ Update machinery
    Route::put('/machineries/{id}', [MachineryController::class, 'update']);
    //Route::patch('/machineries/{id}', [MachineryController::class, 'update']); // optional for partial update

    // ✅ Delete machinery
    Route::delete('/machineries/{id}', [MachineryController::class, 'destroy']);

    Route::get('/income', [IncomeController::class, 'index']);
    Route::post('/income', [IncomeController::class, 'store']);
    Route::put('/income/{id}', [IncomeController::class, 'update']);
    Route::delete('/income/{id}', [IncomeController::class, 'destroy']);


    // Salary settlement 
    Route::post('/salary/settle', [SalaryController::class, 'settle']);

    Route::get('/dashboard/summary', [OperatorReportDashboardController::class, 'summary']);
    Route::get('/dashboard/operator-summary', [OperatorReportDashboardController::class, 'operatorSummary']);
    Route::get('/dashboard/recent-salaries', [OperatorReportDashboardController::class, 'recentSalaries']);
    // routes/api.php
    Route::get('/operator-salary-history', [OperatorReportDashboardController::class, 'salaryHistory']);
    Route::get('/advances/pending', [AdvanceController::class, 'pending']);
    Route::post('/advances', [AdvanceController::class, 'store']);
    Route::post('/advances/settle', [AdvanceController::class, 'settle']);
    Route::get('/advances/settle', [AdvanceController::class, 'settledAdvanceHistory']);
    Route::get('/advances/repaid-unsettled', [AdvanceController::class, 'repaidButUnsettled']);
Route::get('/expenses/pending', [ExpenseController::class, 'pending']);

    // _____________________________________________________________________________________________________________________ 
    // Admin Dashboard Routes
    Route::prefix('admin/dashboard')->group(function () {
        Route::get('/overview', [TipicAdminDashboardController::class, 'getDashboardOverview']);
        Route::get('/sales-summary', [TipicAdminDashboardController::class, 'getAllCompaniesSales']);
        Route::get('/partners-summary', [TipicAdminDashboardController::class, 'getSalesPartnersSummary']);
        Route::get('/payment-overview', [TipicAdminDashboardController::class, 'getPaymentOverview']);
        Route::get('/commission-summary', [TipicAdminDashboardController::class, 'getAllPartnersCommissionSummary']);
        Route::get('/renewal-alerts', [TipicAdminDashboardController::class, 'getRenewalAlerts']);
        Route::get('/monthly-trends', [TipicAdminDashboardController::class, 'getMonthlyTrends']);
    });

    // Admin Company Routes
    Route::prefix('admin/company')->group(function () {
        Route::get('/{companyId}/detailed-sales', [TipicAdminDashboardController::class, 'getCompanyDetailedSales']);
    });

    // Admin Partner Routes
    Route::prefix('admin/partner')->group(function () {
        Route::get('/{partnerId}/detailed-commission', [TipicAdminDashboardController::class, 'getPartnerDetailedCommission']);
    });
});



Route::apiResource('partner-types', OnboardingPartnerTypeController::class);

// Onboarding Partner
Route::get('/partners', [OnboardingPartnerController::class, 'index']);
Route::get('/partnersCompany', [OnboardingPartnerController::class, 'indexCompany']);
Route::post('/partners/register', [OnboardingPartnerController::class, 'register']);

Route::get('/partners/{id}', [OnboardingPartnerController::class, 'show']);
Route::put('/partners/{id}', [OnboardingPartnerController::class, 'update']);
Route::delete('/partners/{id}', [OnboardingPartnerController::class, 'destroy']);


use App\Http\Controllers\PartnerDashboardController;
use App\Http\Controllers\WorkingTypeController;

// Public routes for partner authentication
Route::prefix('partners')->group(function () {
    Route::post('register', [OnboardingPartnerController::class, 'register']);
    Route::post('login', [OnboardingPartnerController::class, 'login']);
});



Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/index', [RawMaterialController::class, 'index']);
    Route::get('/visible', [RawMaterialController::class, 'visible']);
    Route::get('/company/{companyId}', [RawMaterialController::class, 'byCompany']);
    Route::get('/showAll', [RawMaterialController::class, 'showAll']);
    Route::post('/store', [RawMaterialController::class, 'store']);
    Route::put('/rawMaterial/{id}', [RawMaterialController::class, 'update']);
    Route::post('/updateRawMaterial', [RawMaterialController::class, 'updateRawMaterial']);
    Route::delete('/rawMaterial/{id}', [RawMaterialController::class, 'destroy']);
    //  Route::get('/serchRawMaterials', [RawMaterialController::class, 'searchByName']);
    Route::put('/rawMaterial/addQty/{id}', [RawMaterialController::class, 'addQty']);
    Route::get('/getMaterialByProject', [RawMaterialController::class, 'getMaterialByProject']);
    Route::get('/getRawMaterialsForSummary', [RawMaterialController::class, 'getRawMaterialsForSummary']);

    Route::post('/expense', [ExpenseController::class, 'store'])->name('expense.store');
});

// Protected routes for authenticated partners
Route::middleware(['auth:sanctum'])->group(function () {


    // Original Methods (for backward compatibility)
    Route::get('/partner/dashboard', [PartnerDashboardController::class, 'getDashboardData']);
    Route::get('/partner/commission-calculation', [PartnerDashboardController::class, 'getCommissionCalculation']);
    Route::get('/partner/monthly-commission-report', [PartnerDashboardController::class, 'getMonthlyCommissionReport']);
    Route::get('/partner/profile', [PartnerDashboardController::class, 'getPartnerProfile']);
    Route::get('/partner/company/{companyId}', [PartnerDashboardController::class, 'getCompanyDetails']);

    // NEW Receipt-based Commission Methods
    Route::get('/partner/receipt-based-commission', [PartnerDashboardController::class, 'getReceiptBasedCommission']);
    Route::get('/partner/yearly-receipt-commission-report', [PartnerDashboardController::class, 'getYearlyReceiptCommissionReport']);
    Route::get('/partner/company-commission-history/{companyId}', [PartnerDashboardController::class, 'getCompanyCommissionHistory']);

    Route::get('/customer/{customerId}/unpaid-orders', [CustomerOrdersController::class, 'getUnpaidOrders']);
    Route::post('/customer/{customerId}/allocate-payment', [CustomerOrdersController::class, 'allocatePaymentSmartly']);
    Route::post('/customer/{customerId}/return-money', [CustomerOrdersController::class, 'processReturnMoney']);
    Route::get('/customer/{customerId}/order-summary', [CustomerOrdersController::class, 'getCustomerOrderSummary']);
    Route::get('/customer/{customerId}/payment-history', [CustomerOrdersController::class, 'getCustomerPaymentHistory']);
    Route::put('/orders/{orderId}/payment', [CustomerOrdersController::class, 'updateOrderPayment']);
    Route::put('/order/{id}/address', [OrderController::class, 'updateAddress']);
});



// Admin routes for partner management
Route::middleware(['auth:sanctum'])->prefix('admin/partners')->group(function () {
    Route::get('/', [OnboardingPartnerController::class, 'index']);
    Route::get('company-list', [OnboardingPartnerController::class, 'indexCompany']);
    Route::get('show/{id}', [OnboardingPartnerController::class, 'show']);
    Route::put('update/{id}', [OnboardingPartnerController::class, 'update']);
    Route::delete('delete/{id}', [OnboardingPartnerController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->post('/product/media', [ProductController::class, 'uploadProductImage']);

// If you need authenticated routes, wrap them in middleware:
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/company/update-validity', [CompanyValidityController::class, 'updateValidity']);
    Route::get('/company/subscription-status', [CompanyValidityController::class, 'checkSubscriptionStatus']);
    Route::get('/company/renewal-history', [CompanyValidityController::class, 'renewalHistory']);
    Route::post('/product/media/multiple', [ProductController::class, 'uploadMultipleImages']);
    Route::post('/product/media/{id}', [ProductController::class, 'updateDescription']);
    Route::get('/product-sizes', [ProductController::class, 'getProductSizesStock']);



    Route::get('/product/{id}/media', fn($id) => \App\Models\ProductMedia::where('product_id', $id)->get());
    Route::delete('/product/media/{id}', fn($id) => \App\Models\ProductMedia::findOrFail($id)->delete());
});

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
Route::post('/sendBill', [WhatsAppController::class, 'sendBill']);

Route::post('/whatsapp/receiveMessage', [WhatsAppController::class, 'receiveMessage']);
Route::post('/whatsapp/incomingMessage', [WhatsAppController::class, 'incomingMessage']);


//public API's
Route::post('/register', [AuthController::class, 'register']);
Route::post('/partners/login', [OnboardingPartnerController::class, 'login']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/mobileLogin', [AuthController::class, 'mobileLogin']);

Route::post('/reset-password-link', [MailController::class, 'sendEmail']);
Route::post('/newPassword', [MailController::class, 'resetPassword']);


Route::get('/criticalStock', [RawMaterialController::class, 'criticalStock']);
Route::get('/csv-download', [RawMaterialController::class, 'downloadDemoCsv']);
Route::post('/uploadCSVRawMaterial', [RawMaterialController::class, 'uploadCsvRawMaterial']);
Route::post('/uploadBulk', [RawMaterialController::class, 'bulkUpdate']);
Route::post('/upload', [UploadController::class, 'store']);

// Route::get('/serchRawMaterials', [RawMaterialController::class, 'searchByName']);

//Private
Route::post('/rawMaterialAdd', [RawMaterialController::class, 'store'])->middleware('auth:sanctum');
Route::middleware(['auth:sanctum'])->get('/getRawMaterialsByParam/{isPackaging}', [RawMaterialController::class, 'getRawMaterialsByParam']);

//Secured API's
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/uploadCSVRawMaterial', [RawMaterialController::class, 'uploadCsvRawMaterial']);
    Route::post('/uploadBulk', [RawMaterialController::class, 'bulkUpdate']);
    Route::get('/raw-materials/{id}/logs', [RawMaterialController::class, 'getMaterialLogs']);
    Route::post('/raw-materials/add-quantity', [RawMaterialController::class, 'addQuantity']);
    Route::post('/raw-materials/used-quantity', [RawMaterialController::class, 'usedQuantity']);
    Route::put('/company/{id}/toggle-blocks', [CompanyInfoController::class, 'toggleBlockStatus']);
    Route::post('/changePassword', [AuthController::class, 'changePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logoutEverywhere', [AuthController::class, 'logoutEverywhere']);
    Route::post('/registerUser', [AuthController::class, 'registerUser']);
    Route::put('/appUsers', [AuthController::class, 'update']);
    Route::put('/userUpdated/{id}', [AuthController::class, 'userUpdated']);
    Route::get('/appUsers', [AuthController::class, 'allUsers']);
    Route::resource('product', ProductController::class);
    Route::resource('expenseType', ExpenseTypeController::class);
    // Route::get('/expense-report', [ExpenseController::class, 'expenseReport']);
    Route::get('/searchRawMaterials', [RawMaterialController::class, 'searchByName']);
    Route::post('/dead-stock', [DeadStockController::class, 'store']);
    Route::get('/dead-stock', [DeadStockController::class, 'index']);

    // Route::resource('expense',ExpenseController::class);
    // Route::put('/expense/{id}', [ExpenseController::class, 'update']);
    // Route::post('/expense', [ExpenseController::class, 'store']);
    Route::resource('order', OrderController::class);
    Route::put('/order/{id}/cancel', [OrderController::class, 'cancelledOrder']);

    // Route::get('/reportSales', [OrderController::class, 'Sales']);
    Route::get('/googleMapData', [OrderController::class, 'googleMapData']);
    Route::get('/totalDeliveries', [OrderController::class, 'totalDeliverie']);

    Route::post('/newStock', [ProductController::class, 'newStock'])->name('newStock');
    Route::get('/stock', [ProductController::class, 'stock'])->name('stock');
    Route::resource('category', CategoryController::class);
    Route::resource('subCategory', SubCategoryController::class);
    Route::resource('subSubCategory', SubSubCategoryController::class);
    Route::resource('customer', CustomerController::class);
    Route::get('/searchCustomer', [CustomerController::class, 'search']);
    Route::get('/customerHistory', [CustomerController::class, 'history']);
    Route::get('/customerBookings', [CustomerController::class, 'booking']);
    Route::get('/creditReport', [CustomerController::class, 'creditReport']);
    Route::resource('jarTracker', JarTrackerController::class);
    Route::post('/product/updateQty', [ProductController::class, 'updateQty']);
    Route::post('/fileUpload', [FileUpload::class, 'fileUpload']);

    Route::get('/getMonthlyReportSummeries', [DrillingController::class, 'getMonthlyReportSummeries']);

    Route::get('/customerReport', [OrderController::class, 'customerReport'])->name('customerReport');
    Route::resource('companies', CompanyInfoController::class);
    Route::get('/companiesget', [CompanyInfoController::class, 'index']);
    Route::post('/company/check-duplicate', [CompanyInfoController::class, 'checkDuplicate']);
    Route::put('/orders/{id}/updateReturnMoney', [OrderController::class, 'updateReturnMoney']);
    Route::put('/updateorder/{id}', [OrderController::class, 'updateDelivery']);

    //CSV Upload 
    Route::post('/uploadProducts', [CsvUploadController::class, 'uploadProducts']);
    Route::post('/product/{id}/update-quantity', [ProductController::class, 'updateQuantity']);


    Route::delete('/appUsers/delete/{id}', [AuthController::class, 'deleteUser']);

    // Enhanced company receipt routes
    Route::get('/company-receipts/subscription-history', [CompanyReceiptController::class, 'getSubscriptionHistory']);
    Route::get('/company-receipts/renewal-stats', [CompanyReceiptController::class, 'getRenewalStats']);
    Route::put('/company-receipts/{id}/status', [CompanyReceiptController::class, 'updateStatus']);
    Route::get('/company-receipts/{id}', [CompanyReceiptController::class, 'show']);
    Route::delete('/company-receipts/{id}', [CompanyReceiptController::class, 'destroy']);


    // Added routes for payment tracking
    Route::resource('paymentTracker', PaymentTrackerController::class);
    Route::get('/paymentTrackerReport', [PaymentTrackerController::class, 'generateReport']);
    Route::put('/paymentTracker/{id}', [PaymentTrackerController::class, 'update']);
    Route::put('/payment-tracker/{customerId}/update-amount', [PaymentTrackerController::class, 'updateAmount']);

    //receipt
    Route::post('/company-receipt', [CompanyReceiptController::class, 'store']);
    Route::post('/company/update-plan', [CompanyValidityController::class, 'updatePlan']);

    Route::get('/company-receipts', [CompanyReceiptController::class, 'index']);
    Route::resource('plan', PlanController::class);
    Route::post('/upgrade-preview', [PlanController::class, 'previewUpgrade']);
    Route::get('/detailsForCompany', [CompanyInfoController::class, 'plansAndPartners']);
    //RazorPay API's
    Route::post('/create-order', [RazorpayController::class, 'createOrder']);
    Route::post('/verify-payment', [RazorpayController::class, 'verifyPayment']);

    Route::get('/reportSales', [OrderController::class, 'reportSales']);
    Route::get('/summerySalesReport', [OrderController::class, 'summerySalesReport']);
    Route::get('/workLogSummaryReport', [DrillingController::class, 'workLogSummaryReport']);
    Route::get('/reportProductWiseEarnings', [OrderController::class, 'productWiseEarnings']);
    Route::post('/bulkCustomerCreation', [CustomerController::class, 'bulkCustomerCreation']);

    // API route for expense report (used in ReportOptions 2 & 3)

    // For example: custom report endpoint

    // Onboarding Partner Type

    //Kunal
    Route::get('/machine-wise-hours', [MachineLogController::class, 'getMachineWiseBreakdown']);
    Route::get('/project-wise-hours', [MachineLogController::class, 'getprojectWiseBreakdown']);
    Route::get('/workingType', [WorkingTypeController::class, 'index']);
    Route::post('/saveWorkingType', [WorkingTypeController::class, 'store']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // Get subscription status for a company
    Route::get('/company/subscription-status/{companyId}', [CompanyInfoController::class, 'getSubscriptionStatus']);

    // Update subscription validity
    Route::post('/company/update-validity', [CompanyInfoController::class, 'updateSubscriptionValidity']);

    // Alternative route for getting current user's company subscription status
    Route::get('/my-subscription-status', function () {
        $user = Auth::user();
        if ($user->type == 1 && $user->company_id) {
            return app(CompanyInfoController::class)->getSubscriptionStatus($user->company_id);
        }
        return response()->json(['message' => 'No company associated with user'], 404);
    });
});


Route::middleware('auth.apikey')->group(function () {

    // ===== SPECIFIC ROUTES FIRST (Before resource routes) =====

    // Company specific routes
    Route::post('/company/check-duplicate', [CompanyInfoController::class, 'checkDuplicate']);
    Route::post('/company/update-subscription', [CompanyInfoController::class, 'updateCompanyValidity']);
    Route::put('/company/{id}/toggle-block', [CompanyInfoController::class, 'toggleBlockStatus']);
    Route::get('/detailsForCompany', [CompanyInfoController::class, 'plansAndPartners']);

    // Receipt specific routes (BEFORE the {id} route)
    Route::get('/company-receipts/subscription-history', [CompanyReceiptController::class, 'getSubscriptionHistory']);
    Route::get('/company-receipts/renewal-stats', [CompanyReceiptController::class, 'getRenewalStats']);
    Route::get('/company-receipts', [CompanyReceiptController::class, 'index']);
    Route::post('/company-receipt', [CompanyReceiptController::class, 'store']);
    Route::put('/company-receipts/{id}/status', [CompanyReceiptController::class, 'updateStatus']);
    Route::get('/company-receipts/{id}', [CompanyReceiptController::class, 'show']);
    Route::delete('/company-receipts/{id}', [CompanyReceiptController::class, 'destroy']);

    // File upload
    Route::post('/fileUpload', [FileUpload::class, 'fileUpload']);

    // User registration
    Route::post('/registerUser', [AuthController::class, 'registerUser']);

    // ===== RESOURCE ROUTES LAST =====
    Route::resource('company', CompanyInfoController::class);
    Route::resource('plan', PlanController::class);
});


// Route::post('/drilling', [DrillingController::class, 'store']);
// Route::get('/drilling', [DrillingController::class, 'index']);
// Route::get('/drilling-records', [DrillingController::class, 'invoice']);
//  Route::get('/profitLossReport', [OrderController::class, 'profitLossReport']);

Route::post('send', [AuthController::class, 'send']);
Route::post('verify', [AuthController::class, 'verify']);

//Website side OTP Send and verification
Route::post('/customer-send-otp', [ScrappingController::class, 'sendOtp']);
Route::post('/customer-verify-otp', [ScrappingController::class, 'verifyOTP']);
Route::post('/customer-submit-enquiry', [ScrappingController::class, 'submitEnquiry']);


//Tiva Admin side Email verification
// Route::get('/send-email', [MailController::class, 'index']);
Route::post('/reset-password-link', [MailController::class, 'sendEmail']);
Route::post('/resetPassword', [MailController::class, 'resetPassword']);
Route::post('/send-otp', [OtpController::class, 'sendOtp']);
Route::post('/verify-otp', [OtpController::class, 'verifyOtp']);


//working here 



// List all machine-operator assignments
Route::group(['middleware' => ['auth:sanctum']], function () {

    //All operator
    // Route::get('/all-operators', [MachineOperatorController::class, 'index']);


    Route::get('/machine-operators', [MachineOperatorController::class, 'index']);

    // Store a new machine-operator assignment
    Route::post('/machine-operators', [MachineOperatorController::class, 'store']);

    // Show a single machine-operator assignment
    Route::get('/machine-operators/{id}', [MachineOperatorController::class, 'show']);

    // Update a machine-operator assignment
    Route::put('/machine-operators/{id}', [MachineOperatorController::class, 'update']);

    // Delete a machine-operator assignment
    Route::delete('/machine-operators/{id}', [MachineOperatorController::class, 'destroy']);


    Route::get('/machine-price', [MachinePriceController::class, 'index'])->name('machine-price.index');
    Route::get('/machine-price/{id}', [MachinePriceController::class, 'show'])->name('machine-price.show');
    Route::post('/machine-price', [MachinePriceController::class, 'store'])->name('machine-price.store');
    Route::put('/machine-price/{id}', [MachinePriceController::class, 'update'])->name('machine-price.update');
    Route::delete('/machine-price/{id}', [MachinePriceController::class, 'destroy'])->name('machine-price.destroy');
    //shreeyog
    Route::get('/machineries1', [MachineOperatorController::class, 'index']);
    Route::get('/machine-expense-report', [ExpenseController::class, 'machineExpenseReport'])->name('expense.machine-report');
    Route::get('/expense1', [ExpenseController::class, 'index1'])->name('expense.index1');
    Route::get('/machines', [MachineryController::class, 'index'])->name('machines.index');


    //Kunal

});
