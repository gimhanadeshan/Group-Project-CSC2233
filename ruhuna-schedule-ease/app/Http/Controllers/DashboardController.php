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
        // Fetch the semester_id from the course_registrations table for the logged-in user
        $semesterId = \DB::table('course_registrations')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc') // Adjust ordering as necessary
            ->value('semester_id');

        // Fetch the current semester details
        $now = Carbon::now();
        $currentSemester = Semester::where('id', $semesterId)
            ->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)
            ->first();

        // Fetch events based on the semester_id
        $allevents = Event::where('semester_id', $semesterId)
            ->orWhereNull('semester_id')
            ->get();

        return Inertia::render('Dashboards/StudentDashboard', [
            'currentSemester' => $currentSemester,
            'allevents' => $allevents
        ]);
    }
}
