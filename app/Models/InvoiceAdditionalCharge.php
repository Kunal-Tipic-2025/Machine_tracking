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
        'amount',
         'paid_amount',
        'is_paid',
        'date',
        'remark',
    ];
}
