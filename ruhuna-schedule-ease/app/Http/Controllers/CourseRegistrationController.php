<?php

namespace App\Http\Controllers;
use App\Models\CourseRegistration;
use Illuminate\Http\Request;
use App\Models\Course;
use Inertia\Inertia;

class CourseRegistrationController extends Controller
{
    public function index(){

        $courses = Course::all();
        return Inertia::render('CourseRegistrations/Index', ['courses' => $courses]);
    }
}
