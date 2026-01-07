<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalaryPayment extends Model
{
    protected $fillable = [
        'operator_id',
        'company_id',
        'month',
        'base_salary',
        'total_expense_deducted',
        'total_advance_deducted',
        'net_salary',
        'paid_at',
        'remark',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'base_salary' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'total_expense_deducted' => 'decimal:2',
        'total_advance_deducted' => 'decimal:2',
    ];

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id')
                    ->where('type', 2);
    }

    public function advances()
    {
        return $this->hasMany(AdvanceRecord::class, 'settled_in_salary_id');
    }

    public function expenses()
    {
        return $this->hasMany(OperatorExpense::class, 'settled_in_salary_id');
    }
}

