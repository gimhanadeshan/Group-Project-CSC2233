<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{

  
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
