<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceAdditionalCharge extends Model
{
    use HasFactory;
    protected $fillable = [
        'invoice_id',
        'company_id',
        'charge_type',
        'charge_type_id', // New
        'amount',
        'amount_deduct', // New
        'paid_amount',
        'is_paid',
        'date',
        'remark',
    ];

    protected $casts = [
        'amount_deduct' => 'boolean',
        'is_paid' => 'boolean',
    ];

    public function chargeDefinition()
    {
        return $this->belongsTo(ChargeType::class, 'charge_type_id');
    }
}
