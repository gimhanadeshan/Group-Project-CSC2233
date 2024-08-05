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

    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'addedCourses' => 'required|array',
            'addedCourses.*' => 'exists:courses,id',
        ]);

        // Loop through the added courses and create course registrations
        foreach ($request->input('addedCourses') as $courseId) {
            $courseRegistration = new CourseRegistration();
            $courseRegistration->user_id = auth()->user()->id;
            $courseRegistration->course_id = $courseId;
            $courseRegistration->status = 'pending'; // Default status
            $courseRegistration->save();
        }

        // Redirect with success message
        return redirect()->route('course-registrations.index')->with('success', 'Courses registered successfully.');
    }

}

   