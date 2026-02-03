<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperatorExpense extends Model
{
    protected $fillable = [
        'operator_id',
        'company_id',
        'machine_id',
        'about_expenses',
        'total_amount',
        'is_settle',
        'expense_date',
        'settled_in_salary_id',
        'settled_at'
    ];

    protected $casts = [
        'expense_date' => 'date',
        'settled_at' => 'datetime',
        'is_settle' => 'boolean',
        'total_amount' => 'decimal:2'
    ];

    // public function salaryCycle()
    // {
    //     return $this->belongsTo(SalaryCycle::class, 'settled_in_salary_id');
    // }
    public function salaryPayment()
{
    return $this->belongsTo(SalaryPayment::class, 'settled_in_salary_id');
}

    public function machine()
    {
        return $this->belongsTo(MachineOperator::class, 'machine_id');
    }

}
