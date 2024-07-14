<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon; // Import Carbon


class EventController extends Controller
{
    private function renderViewWithEvents($viewName)
    {
        $allevents = Event::all()->map(function ($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'subject_code' => $event->subject_code,
                'location' => $event->location,
                'start' => $event->start,
                'end' => $event->end,
            ];
        });

        return Inertia::render($viewName, [
            'allevents' => $allevents,
        ]);
    }

    public function stu()
    {
        return $this->renderViewWithEvents('Dashboards/StudentDashboard');
    }

    public function lec()
    {
        return $this->renderViewWithEvents('Dashboards/LectureDashboard');
    }

    public function timetable()
    {
        return $this->renderViewWithEvents('Dashboards/TimeTable');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'subject_code' => 'required',
            'location' => 'required',
            'start' => 'required|date',
            'end' => 'required|date',
        ]);
    
        // Specify the IST timezone
        $timezone = 'Asia/Kolkata';
        $data['start'] = Carbon::parse($data['start'], $timezone)->setTimezone($timezone)->toDateTimeString();
        $data['end'] = Carbon::parse($data['end'], $timezone)->setTimezone($timezone)->toDateTimeString();
    
        Event::create($data);
    
        return redirect()->back()->with('success', 'Event created successfully');
    }
    
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
    
        $data = $request->validate([
            'title' => 'required',
            'subject_code' => 'required',
            'location' => 'required',
            'start' => 'required|date',
            'end' => 'required|date',
        ]);
    
        // Specify the IST timezone
        $timezone = 'Asia/Kolkata';
        $data['start'] = Carbon::parse($data['start'], $timezone)->setTimezone($timezone)->toDateTimeString();
        $data['end'] = Carbon::parse($data['end'], $timezone)->setTimezone($timezone)->toDateTimeString();
    
        $event->update($data);
    
        return redirect()->back()->with('success', 'Event updated successfully');
    }
    


    public function destroy($id)
    {
        try {
            $event = Event::findOrFail($id);
            $event->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete event.'], 500);
        }
    }
    
}
