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
        'reference_number',
        'start_date',
        'end_date',
        'registration_start_date',
        'registration_end_date',
        'is_active', 
        'description', 
        'course_capacity', 
        'enrollment_count', 
        'status', 
    ];

    /**
     * Generate a reference number based on the level, semester, and academic year.
     */
    public static function generateReferenceNumber($level, $semester, $academic_year)
    {
        return 'L' . $level . 'S' . $semester . $academic_year;
    }

    /**
     * Get the timetables associated with the semester.
     */
    public function timetables()
    {
        return $this->hasMany(TimeTable::class, 'semester_id');
    }

    
   
}
