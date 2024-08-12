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
        // Fetch all courses that the user has registered for
        $userCourses = CourseRegistration::where('user_id', auth()->id())->with('course')->get();

        return Inertia::render('CourseConfirmation/Index', [
            'userCourses' => $userCourses,
        ]);
    }

    public function confirmCourse(Request $request, $courseCode)
    {
        try {
            // Find the course by its code
            $course = Course::where('code', $courseCode)->firstOrFail();

            // Find the course registration
            $registration = CourseRegistration::where('course_id', $course->id)
                                               ->where('user_id', auth()->id())
                                               ->firstOrFail();

            // Confirm the course
            $registration->update(['status' => 'confirmed']);

            return response()->json(['message' => 'Course confirmed successfully']);
        } catch (\Exception $error) {
            return response()->json(['error' => $error->getMessage()], 500);
        }
    }

    public function cancelCourse(Request $request, $courseCode)
    {
        try {
            // Find the course by its code
            $course = Course::where('code', $courseCode)->firstOrFail();

            // Find the course registration
            $registration = CourseRegistration::where('course_id', $course->id)
                                               ->where('user_id', auth()->id())
                                               ->firstOrFail();

            // Cancel the course
            $registration->delete();

            return response()->json(['message' => 'Course canceled successfully']);
        } catch (\Exception $error) {
            return response()->json(['error' => $error->getMessage()], 500);
        }
    }
}
