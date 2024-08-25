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

    public function semester()
{
    return $this->belongsTo(Semester::class, 'semester_id');
}

public function events()
{
    return $this->hasMany(Event::class);
}

public function registrationsCountBySemesterAndYear($semesterId, $academicYear)
{
    return $this->hasMany(CourseRegistration::class)
                ->where('semester_id', $semesterId)
                ->whereHas('semester', function ($query) use ($academicYear) {
                    $query->where('academic_year', $academicYear);
                })
                ->count();
}

public function timeTable()
{
    return $this->hasMany(TimeTable::class);
}

}
