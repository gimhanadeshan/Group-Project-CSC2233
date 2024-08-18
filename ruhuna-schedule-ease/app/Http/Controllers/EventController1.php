<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\TimeTable;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class EventController1 extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('read_event', $request->user());
    
        // Fetch the semester_id from the course_registrations table for the logged-in user
        $semesterId = \DB::table('course_registrations')
                        ->where('user_id', $request->user()->id)
                        ->orderBy('created_at', 'desc') // Adjust ordering as necessary
                        ->value('semester_id');
    
        // Fetch the current semester details
        $now = Carbon::now();
        $currentSemester = Semester::where('id', $semesterId)
                                   ->where('start_date', '<=', $now)
                                   ->where('end_date', '>=', $now)
                                   ->first();
    
        // Fetch events based on the semester_id
        $allevents = Event::where('semester_id', $semesterId)
                          ->orWhereNull('semester_id')
                          ->get();
    
        return Inertia::render('Dashboard', [
            'currentSemester' => $currentSemester,
            'allevents' => $allevents
        ]);
    }
    

    public function store(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'event_title' => 'required',
            'location' => 'required',
            'start' => 'required|date',
            'end' => 'required|date',
            'daily' => 'sometimes|boolean',
            'weekly' => 'sometimes|boolean',
            'monthly' => 'sometimes|boolean',
        ]);
        $data['user_id'] = $user->id;

        // Determine the number of events to create based on recurrence
        if ($request->daily) {
            $this->createRecurringEvents($data, 'day');
        } elseif ($request->weekly) {
            $this->createRecurringEvents($data, 'week');
        } elseif ($request->monthly) {
            $this->createRecurringEvents($data, 'month');
        } else {
            Event::create($data);
        }

        return redirect()->back()->with('success', 'Event created successfully');
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $user = $request->user();
        $data = $request->validate([
            'event_title' => 'required',
            'location' => 'required',
            'start' => 'required|date',
            'end' => 'required|date',
            'daily' => 'sometimes|boolean',
            'weekly' => 'sometimes|boolean',
            'monthly' => 'sometimes|boolean',
        ]);

        // Delete existing event if recurrence options are updated
        $event->delete();
        $data['user_id'] = $user->id;
        // Handle recurrence update
        if ($request->daily) {
            $this->createRecurringEvents($data, 'day');
        } elseif ($request->weekly) {
            $this->createRecurringEvents($data, 'week');
        } elseif ($request->monthly) {
            $this->createRecurringEvents($data, 'month');
        } else {
            Event::create($data);
        }

        return redirect()->back()->with('success', 'Event updated successfully');
    }

    public function destroy($id)
    {
        try {
            $event = Event::findOrFail($id);
            $event->delete();

            return redirect()->back()->with('success', 'Event deleted successfully');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete event.'], 500);
        }
    }

    private function createRecurringEvents(array $data, string $frequency)
    {
        $start = Carbon::parse($data['start']);
        $end = Carbon::parse($data['end']);
        $endDate = Carbon::now()->addMonth(6); // Set the end of recurrence 

        while ($start->lessThanOrEqualTo($endDate)) {
            Event::create([
                'event_title' => $data['event_title'],
                'location' => $data['location'],
                'start' => $start->toDateTimeString(),
                'end' => $end->toDateTimeString(),
            ]);

            // Adjust dates based on frequency
            $start->add($frequency, 1);
            $end->add($frequency, 1);
        }
    }
}
