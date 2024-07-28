<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
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

        try {
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
        } catch (QueryException $e) {
            $errorMessage = $this->handleQueryException($e);
            return back()->withErrors(['msg' => $errorMessage])->withInput();
        }
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

        try {
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
        } catch (QueryException $e) {
            $errorMessage = $this->handleQueryException($e);
            return back()->withErrors(['msg' => $errorMessage])->withInput();
        }
    }

    public function destroy(Semester $semester)
    {
        try {
            $semester->delete();
            return redirect()->route('semesters.index')->with('success', 'Semester deleted successfully.');
        } catch (QueryException $e) {
            $errorMessage = $this->handleQueryException($e);
            return back()->withErrors(['msg' => $errorMessage]);
        }
    }

    private function handleQueryException(QueryException $e)
    {
        // Default error message
        $errorMessage = 'An unexpected error occurred. Please try again later.';

        // You can add more specific error handling based on $e->getCode() or $e->getMessage()
        // Here are a few common error codes:
        switch ($e->getCode()) {
            case '23000':
                $errorMessage = 'There is a database constraint violation. Please ensure that the data you entered is unique and valid.';
                break;
            // Add more cases as needed
        }

        return $errorMessage;
    }
}
