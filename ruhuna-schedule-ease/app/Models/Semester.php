<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year',
        'level',
        'semester',
        'start_date',
        'end_date',
        'registration_start_date',
        'registration_end_date',
        'description',
        'course_capacity',
        'enrollment_count',
        'status',
        'degree_program_id', // Add this line
    ];

    /**
     * Get the timetables associated with the semester.
     */
    public function timetables()
    {
        return $this->hasMany(TimeTable::class, 'semester_id');
    }

    /**
     * Get the degree program that owns the semester.
     */
    public function degreeProgram()
    {
        return $this->belongsTo(DegreeProgram::class, 'degree_program_id','id');
    }

    public function courseRegistrations()
    {
        return $this->hasMany(CourseRegistration::class, 'semester_id');
    }
}
