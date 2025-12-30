<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\MachineOperator;

class MachinePrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'machine_id',
        'price',
        'mode',
        'company_id',
    ];

    // This MUST be public and named exactly 'machine'
    public function machine()
    {
        return $this->belongsTo(MachineOperator::class); // Assumes foreign key is 'machine_id'
    }

    public function company()
    {
        // Reference company_info table
        return $this->belongsTo(CompanyInfo::class);
    }
}