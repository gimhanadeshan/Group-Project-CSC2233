<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Event;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class EventRegistrationController extends Controller
{
    public function index(){

        $allevents = Event::all();
        return Inertia::render('Events/Index', ['allevents' => $allevents]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'event_title' => 'required',
            'location' => 'required',
            'start' => 'required|date',
            'end' => 'required|date',
        ]);

        $timezone = 'Asia/Kolkata';
        $data['start'] = Carbon::parse($data['start'], $timezone)->setTimezone($timezone)->toDateTimeString();
        $data['end'] = Carbon::parse($data['end'], $timezone)->setTimezone($timezone)->toDateTimeString();

        Event::create($data);

        //return redirect()->back()->with('success', 'Event created successfully');
        return back();
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $data = $request->validate([
            'event_title' => 'required',
            'location' => 'required',
            'start' => 'required|date',
            'end' => 'required|date',
        ]);

        $timezone = 'Asia/Kolkata';
        $data['start'] = Carbon::parse($data['start'], $timezone)->setTimezone($timezone)->toDateTimeString();
        $data['end'] = Carbon::parse($data['end'], $timezone)->setTimezone($timezone)->toDateTimeString();

        $event->update($data);

        return redirect()->back()->with('success', 'Event updated successfully');
    }

    public function destroy($id)
    {
       
            $event = Event::findOrFail($id);
            $event->delete();
            //return redirect()->route('events-registration.index');
            return back();
       
    }
}
