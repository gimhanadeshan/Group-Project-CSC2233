<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::all();
        $registrations = CourseRegistration::with('course', 'user')->get();
        return Inertia::render('Courses/Index', ['courses' => $courses, 'registrations' => $registrations]);
    }

    public function register($courseId)
    {
        $user = Auth::user();
        $course = Course::findOrFail($courseId);

        // Check if the user is already registered for the course
        $existingRegistration = CourseRegistration::where('user_id', $user->id)
                                                  ->where('course_id', $courseId)
                                                  ->first();

        if ($existingRegistration) {
            return redirect()->back()->with('error', 'You are already registered for this course.');
        }

        // Register the user for the course
        CourseRegistration::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'pending',
        ]);

        return redirect()->route('courses.index')->with('success', 'You have successfully registered for the course.');
    }

    public function confirmRegistration($registrationId)
    {
        $registration = CourseRegistration::findOrFail($registrationId);
        $registration->status = 'confirmed';
        $registration->save();

        return redirect()->back()->with('success', 'Registration confirmed.');
    }
}
