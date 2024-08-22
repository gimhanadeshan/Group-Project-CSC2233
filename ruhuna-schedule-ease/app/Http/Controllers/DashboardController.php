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
use App\Models\User;
use App\Models\Role;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = Auth::user();

        switch ($user->role->role_type) {
            case 'administrator':
                return $this->admin($request);
            case 'student':
                return $this->student($request);
            case 'lecturer':
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
            ->with('degreeProgram')
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
            //->orWhereNull('course_id')
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
        $now = Carbon::now();
    
        // Fetch all current semesters
        $currentSemesters = Semester::where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)->with('degreeProgram')
            ->get();
    
        // Initialize arrays to hold data for multiple semesters
        $lecturerCourses = collect();
        $allEvents = collect(); // Collect events for all semesters
        $nullSemesterEvents = collect(); // Collect events with null semester_id
    
        foreach ($currentSemesters as $semester) {
            // Fetch the lecturer's courses for the current semester
            $courses = TimeTable::with('course')
                ->where('lecturer', $user->id)
                ->where('semester_id', $semester->id)
                ->get()
                ->map(function ($timetable) {
                    return [
                        'id' => $timetable->course->id,
                        'code' => $timetable->course->code,
                        'name' => $timetable->course->name,
                        'semester_id' => $timetable->semester_id,
                    ];
                })->unique('id'); // Remove duplicate courses
    
            $lecturerCourses = $lecturerCourses->merge($courses);
    
            // Fetch events for the current semester
            $confirmedCourses = $courses->pluck('id');
            $events = Event::where(function ($query) use ($semester) {
                    $query->where('semester_id', $semester->id)
                          ->orWhereNull('semester_id');
                })
                ->whereIn('course_id', $confirmedCourses)
                ->orWhereNull('course_id')
                ->get();
    
            // Separate events with null semester_id
            $nullSemesterEvents = $nullSemesterEvents->merge($events->whereNull('semester_id'))->unique('id');
    
            // Merge the events from this semester with the collection of all events
            $allEvents = $allEvents->merge($events->whereNotNull('semester_id'));
        }
    
        // Add the unique null semester events to the final collection
        $allEvents = $allEvents->merge($nullSemesterEvents)->unique('id');
    
        return Inertia::render('Dashboards/LectureDashboard', [
            'currentSemesters' => $currentSemesters,
            'lecturerCourses' => $lecturerCourses,
            'events' => $allEvents, // Pass all events from all semesters
        ]);
    }
    

    public function admin(Request $request)
{
    $now = Carbon::now();

    // Fetch semesters that are in progress
    $inProgressSemesters = Semester::where('start_date', '<=', $now)
        ->where('end_date', '>=', $now)
        ->with(['degreeProgram','courseRegistrations','timetables'])
        ->get()
        ->map(function($semester) {
            $studentCount = $semester->courseRegistrations->groupBy('user_id')->count();
            $lecturerCount = $semester->timeTables->groupBy('lecturer')->count();
            
            return [
                'id' => $semester->id,
                'name' => $semester->name,
                'degree_program' => $semester->degreeProgram->name,
                'start_date' => $semester->start_date,
                'end_date' => $semester->end_date,
                'student_count' => $studentCount,
                'lecturer_count' => $lecturerCount,
                'academic_year'=>$semester->academic_year,
                'level'=>$semester->level,
                'semester'=>$semester->semester,
            ];
        });

        $roleCounts = Role::withCount('users')->get();

    return Inertia::render('Dashboards/AdminDashboard', [
        'inProgressSemesters' => $inProgressSemesters,
        'roleCounts' => $roleCounts,
        // Additional data can be passed here
    ]);
}

    
    

}
