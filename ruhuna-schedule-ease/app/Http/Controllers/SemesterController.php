<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Semester;
use App\Models\DegreeProgram; // Import DegreeProgram model
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Notifications\CourseRegistrationOpened;

class SemesterController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('read_semester', $request->user());

        // Update semester statuses
        $this->updateSemestersStatus();

        // Fetch semesters with their associated degree programs
        $semesters = Semester::with('degreeProgram')->get();
        $degreePrograms = DegreeProgram::all();

        return Inertia::render('Semesters/Index', ['semesters' => $semesters,'degreePrograms' => $degreePrograms]);
    }


    public function create(Request $request)
    {
        $this->authorize('create_semester', $request->user());

        // Fetch degree programs for the form
        $degreePrograms = DegreeProgram::all();

        return Inertia::render('Semesters/Create', ['degreePrograms' => $degreePrograms]);
    }

    public function store(Request $request)
    {
        $this->authorize('create_semester', $request->user());

        $request->validate([
            'academic_year' => 'required|string|max:255',
            'level' => 'required|in:1,2,3,4',
            'semester' => 'required|in:1,2',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'registration_start_date' => 'nullable|date',
            'registration_end_date' => 'nullable|date',
            'description' => 'nullable|string',
            'degree_program_id' => 'required|exists:degree_programs,id',
        ]);

        try {
            Semester::create([
                'academic_year' => $request->academic_year,
                'level' => $request->level,
                'semester' => $request->semester,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'registration_start_date' => $request->registration_start_date,
                'registration_end_date' => $request->registration_end_date,
                'description' => $request->description,
                'degree_program_id' => $request->degree_program_id,
            ]);

            return redirect()->route('semesters.index')->with('success', 'Semester created successfully.');
        } catch (QueryException $e) {
            $errorMessage = $this->handleQueryException($e);
            return back()->withErrors(['msg' => $errorMessage])->withInput();
        }
    }

    public function edit(Request $request, Semester $semester)
    {
        $this->authorize('update_semester', $request->user());

        // Fetch degree programs for the form
        $degreePrograms = DegreeProgram::all();

        return Inertia::render('Semesters/Edit', [
            'semester' => $semester,
            'degreePrograms' => $degreePrograms
        ]);
    }

    public function update(Request $request, Semester $semester)
    {
        $this->authorize('update_semester', $request->user());

        $request->validate([
            'academic_year' => 'required|string|max:255',
            'level' => 'required|in:1,2,3,4',
            'semester' => 'required|in:1,2',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'registration_start_date' => 'nullable|date',
            'registration_end_date' => 'nullable|date',
            'description' => 'nullable|string',
            'degree_program_id' => 'required|exists:degree_programs,id',
        ]);

       $originalStartDate = $semester->registration_start_date;
       $originalEndDate = $semester->registration_end_date;
        try {
            $semester->update([
                'academic_year' => $request->academic_year,
                'level' => $request->level,
                'semester' => $request->semester,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'registration_start_date' => $request->registration_start_date,
                'registration_end_date' => $request->registration_end_date,
                'description' => $request->description,
                'degree_program_id' => $request->degree_program_id,
            ]);
            // Check if the registration start or end dates have changed

    if ($originalStartDate !== $request->registration_start_date || $originalEndDate !== $request->registration_end_date) {
        $this->notify($semester->id, $request->registration_start_date, $request->registration_end_date);
    }
            return redirect()->route('semesters.index')->with('success', 'Semester updated successfully.');
        } catch (QueryException $e) {
            $errorMessage = $this->handleQueryException($e);
            return back()->withErrors(['msg' => $errorMessage])->withInput();
        }
    }

    public function show(Request $request, Semester $semester)
    {
        $this->authorize('read_semester', $request->user());

        // Eager load the degree program relationship
        $semester = $semester->load('degreeProgram');

        return Inertia::render('Semesters/Show', ['semester' => $semester]);
    }


    public function destroy(Request $request, Semester $semester)
    {
        $this->authorize('delete_semester', $request->user());

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
        $errorMessage = 'An unexpected error occurred. Please try again later.';

        switch ($e->getCode()) {
            case '23000':
                $errorMessage = 'There is a database constraint violation. Please ensure that the data you entered is unique and valid.';
                break;
            // Add more cases as needed
        }

        return $errorMessage;
    }

    private function updateSemestersStatus()
    {
        $now = Carbon::now();

        $semesters = Semester::all();
        foreach ($semesters as $semester) {
            if ($now->lt(Carbon::parse($semester->start_date))) {
                $semester->status = 'Upcoming';
            } elseif ($now->gt(Carbon::parse($semester->end_date))) {
                $semester->status = 'Completed';
            } else {
                $semester->status = 'In Progress';
            }
            $semester->save();
        }
    }
    public function notify($semester,$start,$end)
    {
            $level = Semester::where('id', $semester)->pluck('level')->first();
            $semester_number = Semester::where('id', $semester)->pluck('semester')->first();
            $year = Semester::where('id', $semester)->pluck('academic_year')->first();
            $users = User::where('academic_year',$year)->get();
            //each user is notified
        try{
            foreach($users as $user){

                $user->notify(new CourseRegistrationOpened($level,$semester_number,$year,$start,$end,$user->name));
            }
        }catch(Exception){

        }
        }
}
