<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'mobile_number',
        'supervisor_id',
        'company_id',
        'user_id',
        'project_name',
        'project_cost',
        'work_place',
        'start_date',
        'end_date',
        'is_visible',
        'remark',
        'commission',
        'paidamount',
        'gst_number',
        'operator_id',
        'machine_id'
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'operator_id' => 'array',
        'machine_id' => 'array',
    ];


    public function supervisor()
{
    return $this->belongsTo(User::class, 'supervisor_id');
}

public function user()
{
    return $this->belongsTo(User::class, 'user_id');
}

}
