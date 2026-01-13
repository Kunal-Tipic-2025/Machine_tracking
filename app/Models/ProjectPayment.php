<?php
// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;
// use App\Models\Project;
// use App\Models\CompanyInfo;

// class ProjectPayment extends Model
// {
//     protected $table = 'project_payments';

//     protected $fillable = [
//         'project_id',
//         'company_id',
//         'total',
//         'paid_amount',
//         'worklog_ids'
//     ];

//     protected $casts = [
//         'worklog_ids' => 'array',
//     ];

//     public function project()
//     {
//         return $this->belongsTo(Project::class);
//     }

//     public function company()
// {
//     return $this->belongsTo(CompanyInfo::class, 'company_id');
// }

// }



namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectPayment extends Model
{
    protected $table = 'project_payments';

    protected $fillable = [
        'project_id',
        'customer_id',
        'company_id',
        'total',
        'paid_amount',
        'worklog_ids',
        'payment_mode',
        'invoice_number',
        'is_advance',
        'transaction_id',
        'remark',
        'is_fixed_bid'
    ];

    protected $casts = [
        'worklog_ids' => 'array',
        'is_advance' => 'boolean',
        'is_fixed_bid' => 'boolean',
    ];

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function company()
    {
        return $this->belongsTo(CompanyInfo::class, 'company_id');
    }

    public function repayments()
    {
        return $this->hasMany(Repayment::class, 'invoice_id');
    }

    public function additionalCharges()
{
    return $this->hasMany(InvoiceAdditionalCharge::class, 'invoice_id', 'invoice_number');
}
}
