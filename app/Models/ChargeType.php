<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChargeType extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'local_name',
        'amount_deduct',
        'show',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'amount_deduct' => 'boolean',
        'show' => 'boolean',
    ];
}
