<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('read_course', $request->user());

        $courses = Course::all();
        return Inertia::render('Courses/Index', ['courses' => $courses]);
    }

    public function show(Request $request,$id)
    {
        $this->authorize('read_course', $request->user());
        $course = Course::findOrFail($id);

        return Inertia::render('Courses/Show', [
            'course' => $course
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create_course', $request->user());

        return Inertia::render('Courses/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('create_course', $request->user());

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

    public function edit(Request $request, Course $course)
    {
        $this->authorize('update_course', $request->user());

        return Inertia::render('Courses/Edit', ['course' => $course]);
    }

    public function update(Request $request, Course $course)
    {
        $this->authorize('update_course', $request->user());

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

    public function destroy(Request $request, Course $course)
    {
        $this->authorize('delete_course', $request->user());

        $course->delete();

        return redirect()->route('courses.index')->with('success', 'Course deleted successfully.');
    }

   
}
