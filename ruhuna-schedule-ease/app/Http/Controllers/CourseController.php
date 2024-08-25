<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Semester;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::all();
        return inertia('Courses/Index', ['courses' => $courses]);
    }

    public function show(Request $request, $id)
{
    // Authorize the user for the 'read_course' policy
    $this->authorize('read_course', $request->user());

    // Find the course by ID or fail if not found
    $course = Course::findOrFail($id);

    // Get all registrations related to the course
    $registrations = $course->registrations()
        ->selectRaw('semester_id, COUNT(*) as count')
        ->groupBy('semester_id')
        ->with('semester')
        ->get();

    // Get the semester ID and academic year from the first registration, if it exists
    $academicYearData = $registrations->map(function ($registration) {
        return [
            'academicYear' => $registration->semester->academic_year ?? 'Unknown',
            'count' => $registration->count,
        ];
    });

    // Fetch lectures related to the course, only including course_id and lecturer information
    $lectures = $course->timeTable()
    ->select('course_id', 'lecturer') // Fetch only course_id and lecturer_id
    ->with('lecturer:id,name') // Fetch only lecturer's id and name
    ->get()
    ->unique('lecturer') // Ensure uniqueness by lecturer_id
    ->values(); // Reset keys

    // Pass the course, registrations, and counts to the Inertia view
    return Inertia::render('Courses/Show', [
        'course' => $course,
        'registrations' => $academicYearData, // Include formatted registrations data
        'lectures' => $lectures, // Pass unique lecturers data
    ]);
}







    public function create(Request $request)
    {
        return inertia('Courses/Create');
    }

    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:10|unique:courses,code',
        'theory_hours' => 'nullable|integer|min:0',
        'practical_hours' => 'nullable|integer|min:0',
        'tutorial_hours' => 'nullable|integer|min:0',
        'credit_hours' => 'nullable|integer|min:0',
        'description' => 'nullable|string',
        'is_core' => 'boolean',
    ]);

    $level = isset($request->code[3]) ? (int)$request->code[3] : null;
    $semester = isset($request->code[4]) ? (int)$request->code[4] : null;

    Course::create([
        'name' => $request->name,
        'code' => $request->code,
        'theory_hours' => $request->theory_hours,
        'practical_hours' => $request->practical_hours,
        'tutorial_hours' => $request->tutorial_hours,
        'credit_hours' => $request->credit_hours,
        'description' => $request->description,
        'is_core' => $request->is_core,
        'level' => $level,
        'semester' => $semester,
    ]);

    return redirect()->route('courses.index')->with('success', 'Course created successfully.');
}

    public function edit(Course $course)
    {
        return inertia('Courses/Edit', ['course' => $course]);
    }

    public function update(Request $request, Course $course)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:courses,code,' . $course->id,
            'theory_hours' => 'nullable|integer|min:0',
            'practical_hours' => 'nullable|integer|min:0',
            'tutorial_hours' => 'nullable|integer|min:0',
            'credit_hours' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'is_core' => 'boolean',
        ]);
    
        $level = isset($request->code[3]) ? (int)$request->code[3] : null;
        $semester = isset($request->code[4]) ? (int)$request->code[4] : null;
    
        $course->update([
            'name' => $request->name,
            'code' => $request->code,
            'theory_hours' => $request->theory_hours,
            'practical_hours' => $request->practical_hours,
            'tutorial_hours' => $request->tutorial_hours,
            'credit_hours' => $request->credit_hours,
            'description' => $request->description,
            'is_core' => $request->is_core,
            'level' => $level,
            'semester' => $semester,
        ]);
    
        return redirect()->route('courses.index')->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->route('courses.index')->with('success', 'Course deleted successfully.');
    }
}
