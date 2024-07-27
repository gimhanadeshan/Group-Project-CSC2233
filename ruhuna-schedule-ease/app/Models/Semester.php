<?php

// app/Models/Semester.php

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
        'end_date'
    ];

    public static function generateReferenceNumber($level, $semester, $academic_year)
    {
        // Extract numeric part from $level
        $numericLevel = (int) filter_var($level, FILTER_SANITIZE_NUMBER_INT);

        // Extract numeric part from $semester
        $numericSemester = (int) filter_var($semester, FILTER_SANITIZE_NUMBER_INT);

        return 'L' . $numericLevel . 'S' . $numericSemester . $academic_year;
    }
    public function timetables()
    {
        return $this->belongsTo(TimeTable::class, 'id');
    }
}
