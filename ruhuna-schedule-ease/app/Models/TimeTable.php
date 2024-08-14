<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeTable extends Model
{
    use HasFactory;

    // Specify the table if it's different from the default
    protected $table = 'time_tables';

    // Specify the primary key if it's different from the default
    protected $primaryKey = 'slot_id';

    // Disable timestamps if not used
    public $timestamps = false;

    // Define fillable attributes
    protected $fillable = [
        'start_time',
        'end_time',
        'day_of_week',
        'course_id',
        'hall_id',
        'lecturer',
        'semester_id',
        'type',
        'availability'
    ];

    // Define relationships
    public function course()
    {

        return $this->belongsTo(Course::class, 'course_id','id');

    }

    public function hall()
    {
        return $this->belongsTo(LectureHall::class, 'hall_id','id');
    }

    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer','id');
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id','id');
    }
}
