<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\TimeTable;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class EventController extends Controller
{
    public function index(Request $request)
{
    $this->authorize('read_event', $request->user());


    // Fetch the semester_id from the course_registrations table for the logged-in user
    $semesterId = \DB::table('course_registrations')
                    ->where('user_id', $request->user()->id)
                    ->orderBy('created_at', 'desc') // Adjust ordering as necessary
                    ->value('semester_id');
    $UId=$request->user()->id;


    //$allevents = Event::whereNull('semester_id', $semesterId)->get();
    //$allevents = null;
    if ($semesterId) {
        // Fetch events that match the user's semester_id
        $allevents = Event::where('semester_id', $semesterId)->get();
                      //->orWhereNull('semester_id')
                      //->get();

     return Inertia::render('Events/EventCalendar', ['allevents' => $allevents]);
       
        
    }else{
        if($request->user()->role_id==3){

            $allevents = Event::where('lec_id',$UId)->get();
            return Inertia::render('Events/EventCalendar', ['allevents' => $allevents]);
        }
    }
    
    
    
    $allevents = Event::whereNull('semester_id', $semesterId)->get();
    return Inertia::render('Events/EventCalendar', ['allevents' => $allevents]);

               
    }





public function generateEventsFromTimetable(Request $request,$semesterId)
{

    error_log("o");

    $user = $request->user();
    $semester = Semester::findOrFail($semesterId);
    $timeTables = TimeTable::where('semester_id', $semesterId)->get();
    //$timeTables = TimeTable::with('course', 'hall')->get();

    foreach ($timeTables as $slot) {
        //dd($slot);
        //$slots = TimeTable::with('course', 'hall')->get(); // Ensure 'course' is included in the eager loading

        // Get the day of the week for the timetable slot
        $dayOfWeek = Carbon::parse($semester->start_date)->subDay()->next($slot->day_of_week);
        $startTime = Carbon::parse($slot->start_time);
        $endTime = Carbon::parse($slot->end_time);

        while ($dayOfWeek->lessThanOrEqualTo(Carbon::parse($semester->end_date))) {

            $startDateTime = $dayOfWeek->copy()->setTimeFrom($startTime)->toDateTimeString();
            $endDateTime = $dayOfWeek->copy()->setTimeFrom($endTime)->toDateTimeString();

            // Check if an event already exists for this time slot and day
            $existingEvent = Event::where('event_title', $slot->course->code . ' (' . $slot->type . ')')
                ->where('location', $slot->hall->name)
                ->where('start', $startDateTime)
                ->where('end', $endDateTime)
                ->first();

            if (!$existingEvent) {
                Event::create([
                    'event_title' => $slot->course->code . ' (' . $slot->type . ')', //check this with $slot->course->name . ' (' . $slot->type . ')'
                    'location' => $slot->hall->name,
                    'start' => $startDateTime,
                    'end' => $endDateTime,
                    'user_id' => $user->id,
                    'semester_id' => $semesterId,
                    'hall_id' => $slot->hall_id,
                    'lec_id' => $slot->lecturer,

                ]);
            }

            // Move to the next week
            $dayOfWeek->addWeek();
        }
    }
    return redirect()->back()->with('success', 'Events generated successfully from the timetable');
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
