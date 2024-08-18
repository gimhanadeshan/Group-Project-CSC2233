<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\Semester;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class EventRegistrationController extends Controller
{
    public function index(Request $request){

        $this->authorize('read_event', $request->user());
        $allevents = Event::all();
        $semesters = Semester::all();
        return Inertia::render('Events/Index', [
            'allevents' => $allevents,
            'semesters'=> $semesters        ]);
    }

    public function store(Request $request)
{
    $this->authorize('create_event', $request->user());
    $user = $request->user();

    $data = $request->validate([
        'event_title' => 'required',
        'location' => 'required',
        'start' => 'required|date',
        'end' => 'required|date',
    ]);

    // Add user_id to the data array
    $data['user_id'] = $user->id;

    Event::create($data);

    return back();
}


    public function update(Request $request, $id)
    {
        $this->authorize('update_event', $request->user());

        $event = Event::findOrFail($id);
        $user = $request->user();
        $data = $request->validate([
            'event_title' => 'required',
            'location' => 'required',
            'start' => 'required|date',
            'end' => 'required|date',
        ]);
        $data['user_id'] = $user->id;
       
        $event->update($data);

        return redirect()->back()->with('success', 'Event updated successfully');
    }

    // public function destroy(Request $request,$id)
    // {
    //     $this->authorize('delete_event', $request->user());

    //         $event = Event::findOrFail($id);
    //         $event->delete();
    //         //return redirect()->route('events-registration.index');
    //         return back();
       
    // }
    public function destroy($ids)
    {
        try {
            // Check if $ids is an array, if not convert it to an array
            $idsArray = is_array($ids) ? $ids : [$ids];
    
            // Attempt to delete all events with the provided IDs
            Event::whereIn('id', $idsArray)->delete();
    
            return redirect()->back()->with('success', 'Selected events deleted successfully.');
        } catch (\Exception $e) {
            // Log the exception or handle it as necessary
            return response()->json(['error' => 'Failed to delete events.'], 500);
        }
    }
}
