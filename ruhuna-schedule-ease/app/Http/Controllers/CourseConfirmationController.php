<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseConfirmationController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('read_course_confirmation', $request->user());
        $userCourses = CourseRegistration::with('course')->with('user')
            ->get();

        return Inertia::render('CourseConfirmation/Index', [
            'userCourses' => $userCourses,
        ]);
    }

    public function confirmCourse(Request $request, $courseCode)
{
    $this->authorize('read_course_confirmation', $request->user());

    $course = Course::where('code', $courseCode)->firstOrFail();
    $registration = CourseRegistration::where('course_id', $course->id)
                                      ->firstOrFail();

    $registration->update(['status' => 'confirmed']);

    return redirect()->back()->with('success', 'Course confirmed successfully.');
}

public function cancelCourse(Request $request, $courseCode)
{
    $this->authorize('read_course_confirmation', $request->user());

    $course = Course::where('code', $courseCode)->firstOrFail();
    $registration = CourseRegistration::where('course_id', $course->id)
                                      ->firstOrFail();

    $registration->delete();

    return redirect()->back()->with('success', 'Course registration canceled successfully.');
}

}
