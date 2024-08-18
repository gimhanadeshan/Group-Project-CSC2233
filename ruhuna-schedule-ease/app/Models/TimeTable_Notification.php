<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeTable_Notification extends Model
{
    use HasFactory;
    protected $fillable = [
        'level',
        'semester',
        'year',
        'user_id'
    ];
}
