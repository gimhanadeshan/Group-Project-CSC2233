<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\TimeTable;
use App\Models\Semester;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{

    public function index(Request $request)
    {
        $this->authorize('read_event', $request->user());
    
        // Fetch the semester_id from the course_registrations table for the logged-in user
        $semesterId = \DB::table('course_registrations')
                        ->where('user_id', $request->user()->id)
                        ->orderBy('created_at', 'desc') // Adjust ordering as necessary
                        ->value('semester_id');
    
        // If no semester_id is found, return an empty set of events
        if (!$semesterId) {
            $allevents = Event::whereNull('semester_id')->get();
            //return Inertia::render('Events/EventCalendar', ['allevents' => $allevents]);
            return Inertia::render('Dashboard', ['allevents' => $allevents]);
        }
    
        // Fetch events that match the user's semester_id
        //$allevents = Event::where('semester_id', $semesterId)->get();
        $allevents = Event::where('semester_id', $semesterId)
                          ->orWhereNull('semester_id')
                          ->get();
    
         //return Inertia::render('Events/EventCalendar', ['allevents' => $allevents]);
                     
        return Inertia::render('Dashboard', ['allevents' => $allevents]);
    }
  
    public function dashboard()
    {
        $user = Auth::user();

        switch ($user->role_id) {
            case 1:
                
                return Inertia::render('Dashboards/AdminDashboard');
            case 2:
                
                return Inertia::render('Dashboards/StudentDashboard');
            case 3:
                
                return Inertia::render('Dashboards/LectureDashboard');
            default:
                return Inertia::render('Dashboard');
        }

   
    }

    
}
