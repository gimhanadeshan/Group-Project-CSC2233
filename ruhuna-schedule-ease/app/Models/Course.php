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
        'theory_hours',
        'practical_hours',
        'tutorial_hours',
        'description',
        'is_core',
        'level',
        'semester',
    ];

    public function registrations()
    {
        return $this->hasMany(CourseRegistration::class);
    }
}
