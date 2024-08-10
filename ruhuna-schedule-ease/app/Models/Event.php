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
        'recurrence', // Add this if you want to store the recurrence pattern
    ];

    // Optional: Add a method to check if the event is recurring
    public function isRecurring()
    {
        return $this->recurrence !== null;
    }
}
