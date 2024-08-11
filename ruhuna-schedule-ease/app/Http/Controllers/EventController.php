<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class EventController extends Controller
{
    public function index()
    {
        $allevents = Event::all();
        return Inertia::render('Events/EventCalendar', ['allevents' => $allevents]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'event_title' => 'required',
            'location' => 'required',
            'start' => 'required|date',
            'end' => 'required|date',
            'daily' => 'sometimes|boolean',
            'weekly' => 'sometimes|boolean',
            'monthly' => 'sometimes|boolean',
        ]);

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
        $endDate = Carbon::now()->addMonth(6); // Set the end of recurrence (1 year from now)

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
