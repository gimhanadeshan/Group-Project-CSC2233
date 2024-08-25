<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use App\Models\CourseRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Semester;

class CourseConfirmationController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('read_course_confirmation', $request->user());
        $userCourses = CourseRegistration::with('course')->with('user')
            ->get();
        $semesters = Semester::With('degreeProgram')->orderBy('created_at', 'desc') ->get();
        
        return Inertia::render('CourseConfirmation/Index', [
            'userCourses' => $userCourses,
            'semesters'=> $semesters,
        ]);
    }

    public function confirmCourse(Request $request, $courseCode, $studentId)
{
    $this->authorize('read_course_confirmation', $request->user());
    //dd($courseCode,$studentId);

    $course = Course::where('code', $courseCode)->firstOrFail();
    $registration = CourseRegistration::where('course_id', $course->id)
                                      ->where('user_id',$studentId)
                                      ->firstOrFail();
    
    $registration->update(['status' => 'confirmed']);
    
    return redirect()->back()->with('success', 'Course confirmed successfully.');
}

public function cancelCourse(Request $request, $courseCode, $studentId)
{
    $this->authorize('read_course_confirmation', $request->user());

    $course = Course::where('code', $courseCode)->firstOrFail();
    $registration = CourseRegistration::where('course_id', $course->id)
                                      ->where('user_id',$studentId)
                                      ->firstOrFail();
    
    $registration->delete();

    return redirect()->back()->with('success', 'Course registration canceled successfully.');
}


public function confirmAllCourses(Request $request)
{
    $this->authorize('read_course_confirmation', $request->user());

    $courseIds = $request->input('course_ids');
    $registrations = CourseRegistration::whereIn('course_id', $courseIds)->get();

    foreach ($registrations as $registration) {
        $registration->update(['status' => 'confirmed']);
    }

    return redirect()->back()->with('success', 'All courses confirmed successfully.');
}

public function cancelAllCourses(Request $request)
{
    $this->authorize('read_course_confirmation', $request->user());

    $courseIds = $request->input('course_ids');
    CourseRegistration::whereIn('course_id', $courseIds)->delete();

    return redirect()->back()->with('success', 'All course registrations canceled successfully.');
}
}

