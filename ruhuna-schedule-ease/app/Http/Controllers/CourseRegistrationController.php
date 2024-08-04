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

    public function store(){

        $courseRegistration = new CourseRegistration();
        $courseRegistration->user_id = auth()->user()->id;
        $courseRegistration->course_id = request('course_id');
        $courseRegistration->save();

        return redirect()->route('course-registrations.index')->with('success', 'Course registered successfully.');
    }
}
