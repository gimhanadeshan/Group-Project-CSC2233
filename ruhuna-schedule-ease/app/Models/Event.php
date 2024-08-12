<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_title', 
        'location',
        'start',
        'end',
        'recurrence', // For storing recurrence patterns
        'user_id', // For storing the ID of the user who created the event
        'semester_id',
    ];

    // Optional: Add a method to check if the event is recurring
    public function isRecurring()
    {
        return $this->recurrence !== null;
    }

    // Relationship with User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
