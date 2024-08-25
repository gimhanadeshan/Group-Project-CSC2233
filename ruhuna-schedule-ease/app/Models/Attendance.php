<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;
    
    // Specifies the table associated with the model
    protected $table = 'event_student';
    
    // Defines the attributes that are mass assignable
    protected $fillable = [
        'event_id',
        'student_id',  // Make sure this matches your migration
        'course_type', // Include the course_type to differentiate attendance records
        'attended',
    ];

    // Defines the relationship between Attendance and Event
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    // Defines the relationship between Attendance and User
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id','id');
    }
}
