<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MachineLog extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'operator_id',
        'company_id',
        'work_date',
        'project_id',
        'machine_id',
        'start_reading',
        'start_photo',
        'end_reading',
        'end_photo',
        'status',
        'mode_id',
        'price_per_hour',
        'isPaid'
    ];
}
