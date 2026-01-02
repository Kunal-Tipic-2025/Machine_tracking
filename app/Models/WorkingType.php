<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkingType extends Model
{
    use HasFactory;

    protected $fillable = [
        'type_of_work',
        'company_id',
    ];
}
