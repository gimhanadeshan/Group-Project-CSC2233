<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Condition extends Model
{
    use HasFactory;
    protected $fillable = [
        'lunchtime_start',
        'lunchtime_end',
        'semester_id',
    ];
    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
}
