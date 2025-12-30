<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Operator;

class MachineOperator extends Model
{
    protected $table = 'machine_operator';

    protected $fillable = ['company_id','machine_name', 'operator_id', 'register_number', 'price_per_reading',  'ownership_type', 'mode_id'];

    // Cast JSON column to array
    protected $casts = [
        'operator_id' => 'array',
        'mode_id'     => 'array',
    ];

    /**
     * Access related Operator models using operator_id JSON array
     */
    public function getOperatorsAttribute()
    {
        if (empty($this->operator_id)) {
            return collect(); // Return empty collection if no operators
        }

        return Operator::whereIn('id', $this->operator_id)->get();
    }

    
}
