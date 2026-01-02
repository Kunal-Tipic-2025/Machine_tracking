<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Repayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'project_id',
        'invoice_id',
        'date',
        'total',
        'payment',
        'is_completed',
        'remaining',
        'from_advance',
        'is_advance',
        'advance_taken',
        'remark'
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'date' => 'date',
        'from_advance' => 'boolean',
        'is_advance' => 'boolean',
        'advance_taken' => 'boolean',
    ];

    // Relationships
    public function company()
    {
        return $this->belongsTo(CompanyInfo::class, 'company_id', 'company_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function invoice()
    {
        return $this->belongsTo(ProjectPayment::class, 'invoice_id');
    }
}
