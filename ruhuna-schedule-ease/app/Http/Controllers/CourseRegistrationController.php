<?php

namespace App\Http\Controllers;
use App\Models\CourseRegistration;
use Illuminate\Http\Request;
use App\Models\Course;
use Inertia\Inertia;

class CourseRegistrationController extends Controller
{
    public function index(){

    // Get semesters with open registration for the student's academic year
    $semesters = Semester::where('registration_start_date', '<=', now())
        ->where('registration_end_date', '>=', now())
        ->where('academic_year', $user->academic_year)
        ->where('degree_program_id', $user->degree_program_id)
        ->get();

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

   