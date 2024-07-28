<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SemesterController extends Controller
{
    public function index()
    {
        $semesters = Semester::all();
        return Inertia::render('Semesters/Index', compact('semesters'));
    }

    public function create()
    {
        return Inertia::render('Semesters/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'academic_year' => 'required|string',
            'level' => 'required|string',
            'semester' => 'required|string',
            'name' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'registration_start_date' => 'nullable|date',
            'registration_end_date' => 'nullable|date',
            'course_registration_open' => 'required|boolean',
        ]);

        $reference_number = Semester::generateReferenceNumber($request->level, $request->semester, $request->academic_year);

        Semester::create([
            'academic_year' => $request->academic_year,
            'level' => $request->level,
            'semester' => $request->semester,
            'reference_number' => $reference_number,
            'name' => $request->name,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'registration_start_date' => $request->registration_start_date,
            'registration_end_date' => $request->registration_end_date,
            'course_registration_open' => $request->course_registration_open,
        ]);

        return redirect()->route('semesters.index')->with('success', 'Semester created successfully.');
    }

    public function edit(Semester $semester)
    {
        return Inertia::render('Semesters/Edit', compact('semester'));
    }

    public function update(Request $request, Semester $semester)
    {
        $request->validate([
            'academic_year' => 'required|string',
            'level' => 'required|string',
            'semester' => 'required|string',
            'name' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'registration_start_date' => 'nullable|date',
            'registration_end_date' => 'nullable|date',
            'course_registration_open' => 'required|boolean',
        ]);

        $reference_number = Semester::generateReferenceNumber($request->level, $request->semester, $request->academic_year);

        $semester->update([
            'academic_year' => $request->academic_year,
            'level' => $request->level,
            'semester' => $request->semester,
            'reference_number' => $reference_number,
            'name' => $request->name,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'registration_start_date' => $request->registration_start_date,
            'registration_end_date' => $request->registration_end_date,
            'course_registration_open' => $request->course_registration_open,
        ]);

        return redirect()->route('semesters.index')->with('success', 'Semester updated successfully.');
    }

    public function destroy(Semester $semester)
    {
        $semester->delete();
        return redirect()->route('semesters.index')->with('success', 'Semester deleted successfully.');
    }
}
