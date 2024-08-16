<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Inertia\Inertia;
use Carbon\Carbon;
use APP\Notifications\CourseRegistrationOpened;

class SemesterController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('read_semester', $request->user());

        // Update semester statuses
        $this->updateSemestersStatus();

        $semesters = Semester::all();
        return Inertia::render('Semesters/Index', ['semesters' => $semesters]);
    }

    public function create(Request $request)
    {
        $this->authorize('create_semester', $request->user());

        return Inertia::render('Semesters/Create');
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
            'course_capacity' => 'nullable|integer|min:0',
            'enrollment_count' => 'nullable|integer|min:0',
            'status' => 'required|in:Upcoming,In Progress,Completed',
        ]);

        // Assuming generateReferenceNumber is a method that generates a unique reference number
//$reference_number = Semester::generateReferenceNumber($request->level, $request->semester, $request->academic_year);

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
                'course_capacity' => $request->course_capacity,
                'enrollment_count' => $request->enrollment_count,
                'status' => $request->status,
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

        return Inertia::render('Semesters/Edit', ['semester' => $semester]);
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
            'course_capacity' => 'nullable|integer|min:0',
            'enrollment_count' => 'nullable|integer|min:0',
            'status' => 'required|in:Upcoming,In Progress,Completed',
        ]);

        // Generate reference number if needed, or use the existing one
       // $reference_number = Semester::generateReferenceNumber($request->level, $request->semester, $request->academic_year);

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
                'course_capacity' => $request->course_capacity,
                'enrollment_count' => $request->enrollment_count,
                'status' => $request->status,
            ]);

            return redirect()->route('semesters.index')->with('success', 'Semester updated successfully.');
        } catch (QueryException $e) {
            $errorMessage = $this->handleQueryException($e);
            return back()->withErrors(['msg' => $errorMessage])->withInput();
        }
    }

    public function show(Request $request, Semester $semester)
    {
        $this->authorize('read_semester', $request->user());

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
    public function notify($semester)
    {
            $level = Semester::where('id', $semester)->pluck('level')->first();
            $semester = Semester::where('id', $semester)->pluck('semester')->first();
            $year = Semester::where('id', $semester)->pluck('academic_year')->first();
            $users = User::where('academic_year',$year)->get();

            //each user is notified
        try{
            foreach($users as $user){
                $user->notify(new CourseRegistrationOpened(['level'=>$level,'semester'=>$semester,'year'=>$year]));
            }
        }catch(Exception){

        }

    }
}
