<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\Semester;
use App\Models\Course;
use App\Models\LectureHall;
use App\Models\User;
use App\Models\CourseType;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class EventRegistrationController extends Controller
{
    public function index(Request $request)
{
    $this->authorize('read_event', $request->user());

    $allevents = Event::all();
    $semesters = Semester::all();
    $courses = Course::all();
    $halls = LectureHall::all();
    $lecturers = User::where('role_id', 3)->get(); // Assuming role_id 3 is for lecturers
    $users = User::where('id', $request->user()->id)->get();
    $courseTypes = CourseType::all();

    return Inertia::render('Events/Index', [
        'allevents' => $allevents,
        'semesters' => $semesters,
        'courses' => $courses,
        'halls' => $halls,
        'lecturers' => $lecturers,
        'users' => $users,
        'courseTypes' => $courseTypes,
    ]);
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
            'Lec_attended' => 'nullable|boolean',
            'daily' => 'nullable|boolean',
            'weekly' => 'nullable|boolean',
            'monthly' => 'nullable|boolean',
            'user_id' => 'nullable|exists:users,id',
            'course_id' => 'nullable|exists:courses,id',
            'semester_id' => 'nullable|exists:semesters,id',
            'lec_id' => 'nullable|exists:users,id',
            'hall_id' => 'nullable|exists:lecture_halls,id',
            'course_type' => 'nullable|exists:course_types,id',
        ]);

        // Add user_id to the data array
        $data['user_id'] = $user->id;

        Event::create($data);

        return redirect()->back()->with('success', 'Event created successfully.');
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
            'Lec_attended' => 'nullable|boolean',
            'daily' => 'nullable|boolean',
            'weekly' => 'nullable|boolean',
            'monthly' => 'nullable|boolean',
            'user_id' => 'nullable|exists:users,id',
            'course_id' => 'nullable|exists:courses,id',
            'semester_id' => 'nullable|exists:semesters,id',
            'lec_id' => 'nullable|exists:users,id',
            'hall_id' => 'nullable|exists:lecture_halls,id',
            'course_type' => 'nullable|exists:course_types,id',
        ]);

        // Update user_id in case it changes
        $data['user_id'] = $user->id;

        $event->update($data);

        return redirect()->back()->with('success', 'Event updated successfully.');
    }

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
