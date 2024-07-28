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
        'name',
        'start_date',
        'end_date',
        'registration_start_date',
        'registration_end_date',
        'course_registration_open'
    ];

    public static function generateReferenceNumber($level, $semester, $academic_year)
    {
       
        return 'L' . $level . 'S' . $semester . $academic_year;
    }

    public function timetables()
    {
        return $this->hasMany(TimeTable::class, 'semester_id');
    }
}
