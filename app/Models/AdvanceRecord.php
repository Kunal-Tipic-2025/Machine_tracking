<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdvanceRecord extends Model
{
    protected $table = 'advance_records';

    protected $fillable = [
        'operator_id',
        'amount',
        'advance_date',
        'is_settle',
        'settled_in_salary_id',
        'settled_at',
        'remark',
        'repayment_amount'
    ];

    protected $casts = [
        'advance_date' => 'date',
        'settled_at' => 'datetime',
        'is_settle' => 'boolean',
        'amount' => 'decimal:2',
    ];

    /* -------------------------
     | Relationships
     |--------------------------*/

     public function salaryPayment()
{
    return $this->belongsTo(SalaryPayment::class, 'settled_in_salary_id');
}

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    // public function salaryCycle()
    // {
    //     return $this->belongsTo(SalaryCycle::class, 'settled_in_salary_id');
    // }

    /* -------------------------
     | Query Scopes
     |--------------------------*/

    public function scopePending($query)
    {
        return $query->where('is_settle', false);
    }

    public function scopeSettled($query)
    {
        return $query->where('is_settle', true);
    }
}
