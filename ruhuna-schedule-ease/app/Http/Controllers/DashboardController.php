<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\TimeTable;
use App\Models\Semester;
use App\Models\CourseRegistration;
use App\Models\Course; // Import the Course model
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
                return $this->lecturer($request);
            default:
                return Inertia::render('Dashboard');
        }
    }

    public function student(Request $request)
    {
        // Fetch the latest semester_id from the course_registrations table for the logged-in user
        $semesterId = CourseRegistration::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->value('semester_id');

        // Fetch the current semester details based on the semester_id
        $now = Carbon::now();
        $currentSemester = Semester::where('id', $semesterId)
            ->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)
            ->first();

        // Fetch confirmed courses for the current semester
        $confirmedCourses = CourseRegistration::where('user_id', $request->user()->id)
            ->where('semester_id', $semesterId)
            ->where('status', 'confirmed')
            ->pluck('course_id');

        // Fetch events related to confirmed courses for the current semester or general events
        $allevents = Event::where(function ($query) use ($semesterId) {
                $query->where('semester_id', $semesterId)
                      ->orWhereNull('semester_id');
            })
            ->whereIn('course_id', $confirmedCourses)
            ->orWhereNull('course_id')
            ->get();

        // Fetch registered courses for the current semester with status 'confirmed'
        $registeredCourses = CourseRegistration::with('course')
            ->where('user_id', $request->user()->id)
            ->where('semester_id', $semesterId)
            ->where('status', 'confirmed')
            ->get()
            ->map(function($registration) {
                return [
                    'id' => $registration->course->id,
                    'code' => $registration->course->code,
                    'name' => $registration->course->name,
                ];
            });

        return Inertia::render('Dashboards/StudentDashboard', [
            'currentSemester' => $currentSemester,
            'allevents' => $allevents,
            'registeredCourses' => $registeredCourses,
        ]);
    }

    public function lecturer(Request $request)
    {
        $user = Auth::user();
    
        // Fetch the current semester details
        $now = Carbon::now();
        $currentSemester = Semester::where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)
            ->first();
    
        // Fetch the lecturer's courses from the TimeTable for the current semester
        $lecturerCourses = TimeTable::with('course')
            ->where('lecturer', $user->id)
            ->where('semester_id', $currentSemester->id)
            ->get()
            ->map(function ($timetable) {
                return [
                    'id' => $timetable->course->id,
                    'code' => $timetable->course->code,
                    'name' => $timetable->course->name,
                ];
            })->unique('id'); // Remove duplicate courses
    
        // Fetch the timetable entries for the lecturer
        $timetable = TimeTable::with(['course', 'hall'])
            ->where('lecturer', $user->id)
            ->where('semester_id', $currentSemester->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->map(function ($entry) {
                return [
                    'day_of_week' => $entry->day_of_week,
                    'start_time' => $entry->start_time,
                    'end_time' => $entry->end_time,
                    'course_code' => $entry->course->code,
                    'course_name' => $entry->course->name,
                    'hall' => $entry->hall->name,
                ];
            });
    
        // Fetch events related to the lecturer's courses
        $lecturerCourseIds = $lecturerCourses->pluck('id');
        $events = Event::whereIn('course_id', $lecturerCourseIds)
            ->orWhereNull('course_id')
            ->get();
    
        return Inertia::render('Dashboards/LectureDashboard', [
            'currentSemester' => $currentSemester,
            'lecturerCourses' => $lecturerCourses,
            'timetable' => $timetable,
            'events' => $events,
        ]);
    }
    

}
