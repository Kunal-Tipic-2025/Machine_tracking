<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalaryCycle extends Model
{
    protected $table = 'salary_cycles';

    protected $fillable = [
        'operator_id',
        'month',
        'base_salary',
        'status',
        'salary_paid_at',
    ];

    protected $casts = [
        'salary_paid_at' => 'datetime',
        'base_salary' => 'decimal:2',
    ];

    /* -------------------------
     | Relationships
     |--------------------------*/

    // Operator (no FK, logical relation only)
  public function operator()
{
    return $this->belongsTo(User::class, 'operator_id')
                ->where('type', 2); // operator type
}


    // One salary payment per cycle
    public function payment()
    {
        return $this->hasOne(SalaryPayment::class, 'salary_cycle_id');
    }

    // Advances settled in this salary
    public function advances()
    {
        return $this->hasMany(AdvanceRecord::class, 'settled_in_salary_id');
    }

    // Expenses settled in this salary
    public function expenses()
    {
        return $this->hasMany(OperatorExpense::class, 'settled_in_salary_id');
    }

    /* -------------------------
     | Query Scopes (Useful)
     |--------------------------*/

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopeForMonth($query, string $month)
    {
        return $query->where('month', $month);
    }
}
