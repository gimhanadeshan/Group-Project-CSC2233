<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'credit_hours',
        'type', // Add this line
        'description',
    ];

    public function registrations()
    {
        return $this->hasMany(CourseRegistration::class);
    }
}

