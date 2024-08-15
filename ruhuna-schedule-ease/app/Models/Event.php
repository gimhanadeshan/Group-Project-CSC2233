<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_title', 
        'location',
        'start',
        'end',
        'recurrence',
        'user_id',
        'semester_id',
        'lec_id',
        'hall_id',
        'course_id', // Add course_id to fillable attributes

    ];

    // Define constants for recurrence patterns
    const RECURRENCE_DAILY = 'daily';
    const RECURRENCE_WEEKLY = 'weekly';
    const RECURRENCE_MONTHLY = 'monthly';

    // Optional: Add a method to check if the event is recurring
    public function isRecurring(): bool
    {
        return !is_null($this->recurrence);
    }

    // Relationship with User model
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with Semester model
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    // Scope for filtering events by user
    public function scopeByUser(Builder $query, $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    // Scope for filtering recurring events
    public function scopeRecurring(Builder $query): Builder
    {
        return $query->whereNotNull('recurrence');
    }

    // Cast the recurrence attribute to an array (if stored as JSON)
    protected $casts = [
        'recurrence' => 'array',
    ];

    // Accessor for formatted event title
    protected function formattedTitle(): Attribute
    {
        return new Attribute(
            get: fn() => ucfirst($this->event_title),
        );
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
