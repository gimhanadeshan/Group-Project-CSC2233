<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\TimeTable;
use App\Models\Semester;
use App\Models\CourseRegistration; // Import the CourseRegistration model
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = Auth::user();

        switch ($user->role_id) {
            case 1:
                return Inertia::render('Dashboards/AdminDashboard');
            case 2:
                return $this->student($request);
            case 3:
                return Inertia::render('Dashboards/LectureDashboard');
            default:
                return Inertia::render('Dashboard');
        }
    }

    public function student(Request $request)
{
    // Fetch the latest semester_id from the course_registrations table for the logged-in user
    $semesterId = \DB::table('course_registrations')
        ->where('user_id', $request->user()->id)
        ->orderBy('created_at', 'desc') // Get the most recent registration
        ->value('semester_id');

    // Fetch the current semester details based on the semester_id
    $now = Carbon::now();
    $currentSemester = Semester::where('id', $semesterId)
        ->where('start_date', '<=', $now)
        ->where('end_date', '>=', $now)
        ->first();

    // Fetch events for the current semester or general events (semester_id can be null)
    $allevents = Event::where(function ($query) use ($semesterId) {
            $query->where('semester_id', $semesterId)
                  ->orWhereNull('semester_id');
        })
        ->get();

    // Fetch registered courses for the current semester with status 'confirmed'
    $registeredCourses = CourseRegistration::with('course')
        ->where('user_id', $request->user()->id)
        ->where('semester_id', $semesterId)
        ->where('status', 'confirmed') // Only confirmed registrations
        ->get()
        ->map(function($registration) {
            return [
                'id' => $registration->course->id,
                'code' => $registration->course->code,
                'name' => $registration->course->name,
            ];
        });

    // Render the StudentDashboard component with the necessary data
    return Inertia::render('Dashboards/StudentDashboard', [
        'currentSemester' => $currentSemester,
        'allevents' => $allevents,
        'registeredCourses' => $registeredCourses, // Pass the registered courses to the view
    ]);
}

    
}
