<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Event;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class EventRegistrationController extends Controller
{
    public function index(Request $request){

        $this->authorize('read_event', $request->user());
        $allevents = Event::all();
        return Inertia::render('Events/Index', ['allevents' => $allevents]);
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

        return back();
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

    public function destroy(Request $request,$id)
    {
        $this->authorize('delete_event', $request->user());

            $event = Event::findOrFail($id);
            $event->delete();
            //return redirect()->route('events-registration.index');
            return back();
       
    }
}
