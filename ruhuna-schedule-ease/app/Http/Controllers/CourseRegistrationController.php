<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CourseRegistration;
use Illuminate\Database\QueryException;

class CourseRegistrationController extends Controller
{
    public function index(Request $request)
{
    $user = $request->user();

    // Get semesters with open registration for the student's academic year
    $semesters = Semester::where('registration_start_date', '<=', now())
        ->where('registration_end_date', '>=', now())
        ->where('academic_year', $user->academic_year)
        ->where('degree_program_id', $user->degree_program_id)
        ->get();

    if ($semesters->isEmpty()) {
        return Inertia::render('CourseRegistrations/Index', [
            'semesterCourses' => [],
            'registeredCourses' => [],
            'message' => 'No semesters with open registration found for your academic year.'
        ]);
    }

    // Get registered courses with status
    $registeredCourses = CourseRegistration::where('user_id', $user->id)
        ->with('course') // Eager load course details
        ->get()
        ->map(function ($registration) {
            return [
                'id' => $registration->course->id,
                'code' => $registration->course->code,
                'name' => $registration->course->name,
                'status' => $registration->status, // Add status here
            ];
        });

    // Prepare data for each semester
    $semesterCourses = $semesters->mapWithKeys(function ($semester) use ($user) {
        // Get registered course IDs for the user in this semester
        $registeredCourseIds = CourseRegistration::where('user_id', $user->id)
            ->where('semester_id', $semester->id)
            ->pluck('course_id')
            ->toArray();

        // Get courses not yet registered by the user
        $courses = Course::where('level', $semester->level)
            ->where('semester', $semester->semester)
            ->whereNotIn('id', $registeredCourseIds)
            ->get();

        $confirmedCourses = CourseRegistration::where('user_id', $user->id)
            ->where('status', 'confirmed')
            ->get()
            ->pluck('course_id')
            ->toArray();

        $pendingCourses = CourseRegistration::where('user_id', $user->id)
            ->where('status', 'pending')
            ->get()
            ->pluck('course_id')
            ->toArray();

        return [$semester->id => [
            'semester' => $semester,
            'courses' => $courses,
            'confirmedCourses' => $confirmedCourses,
            'pendingCourses' => $pendingCourses,
        ]];
    });

    return Inertia::render('CourseRegistrations/Index', [
        'semesterCourses' => $semesterCourses,
        'registeredCourses' => $registeredCourses,
        'message' => session('message'),
    ]);
}

    

    

public function store(Request $request)
{
    // Validate the incoming request
    $request->validate([
        'addedCourses' => 'required|array',
        'addedCourses.*' => 'exists:courses,id',
    ]);

    $user = $request->user();

    // Get the current open semester for the student's academic year
    $semester = Semester::where('registration_start_date', '<=', now())
        ->where('registration_end_date', '>=', now())
        ->where('academic_year', $user->academic_year)
        ->first();

    if (!$semester) {
        return redirect()->route('course-registrations.index')
            ->with('error', 'No open semester found for registration in your academic year.');
    }

    $semesterId = $semester->id;

    // Loop through the added courses and create course registrations
    foreach ($request->input('addedCourses') as $courseId) {
        try {
            // Check if the course is already confirmed
            $existingRegistration = CourseRegistration::where('user_id', $user->id)
                ->where('course_id', $courseId)
                ->where('status', 'confirmed')
                ->first();

            if ($existingRegistration) {
                return redirect()->route('course-registrations.index')
                    ->with('error', 'Cannot modify or register courses that are already confirmed.');
            }

            $courseRegistration = new CourseRegistration();
            $courseRegistration->user_id = $user->id;
            $courseRegistration->course_id = $courseId;
            $courseRegistration->semester_id = $semesterId;
            $courseRegistration->status = 'pending';
            $courseRegistration->save();
        } catch (QueryException $e) {
            if ($e->getCode() == '23000') {
                return redirect()->route('course-registrations.index')
                    ->with('error', 'You are already registered for some of these courses.');
            }
            throw $e;
        }
    }

    return redirect()->route('course-registrations.index')
        ->with('success', 'Courses registered successfully.');
}

public function destroy($courseId ,Request $request)
{
    $user = $request->user();

    // Find the course registration
    $registration = CourseRegistration::where('user_id', $user->id)
        ->where('course_id', $courseId)
        ->where('status', 'pending')
        ->first();

    if ($registration) {
        $registration->delete();
        return redirect()->route('course-registrations.index')
            ->with('success', 'Course registration removed successfully.');
    }

    return redirect()->route('course-registrations.index')
        ->with('error', 'Failed to remove course registration.');
}



}
