<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('read_event', $request->user());

        $allevents = Event::all();
        return Inertia::render('Events/EventCalendar', ['allevents' => $allevents]);
    }

    public function store(Request $request)
    {
        $this->authorize('create_event', $request->user());

        $data = $request->validate([
            'event_title' => 'required',
            'location' => 'required',
            'start' => 'required|date',
            'end' => 'required|date',
        ]);

        Event::create($data);

        return redirect()->back()->with('success', 'Event created successfully');
    }

    public function update(Request $request, $id)
    {
        $this->authorize('update_event', $request->user());

        $event = Event::findOrFail($id);

        $data = $request->validate([
            'event_title' => 'required',
            'location' => 'required',
            'start' => 'required|date',
            'end' => 'required|date',
        ]);

        $event->update($data);

        return redirect()->back()->with('success', 'Event updated successfully');
    }

    public function destroy(Request $request, $id)
    {
        $this->authorize('delete_event', $request->user());

        try {
            $event = Event::findOrFail($id);
            $event->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete event.'], 500);
        }
    }

   
}
