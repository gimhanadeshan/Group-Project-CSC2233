<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TimeTable;
use App\Models\Course;
use App\Models\User;
use App\Models\Semester;
use App\Models\Condition;
use App\Models\LectureHall;
use App\Http\Requests\StoreTimeTableRequest;
use App\Http\Requests\UpdateTimeTableRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TimeTableController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $semestersInTimeTable = Semester::whereIn('id', function($query) {
            $query->select('semester_id')->from('time_tables');
        })->orderBy('id')->get();

        $semestersNotInTimeTable = Semester::whereNotIn('id', function($query) {
            $query->select('semester_id')->from('time_tables');
        })->orderBy('id')->get();

        return Inertia::render('TimeTable/Index', [
            'semestersInTimeTable' => $semestersInTimeTable,
            'semestersNotInTimeTable' => $semestersNotInTimeTable
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $level = $request->query('level');
        $semester = $request->query('semester');
        $semester_id = $request->query('semester_id');

        if (is_null($semester_id)) {
            return redirect()->route('timetables.index');
        }

        $isAlreadyIn = TimeTable::where('semester_id', $semester_id)->exists();
        $semesterDetails = Semester::find($semester_id);

        if ($isAlreadyIn || !$semesterDetails ||
            $semesterDetails->level != $level ||
            $semesterDetails->semester != $semester) {
            return redirect()->route('timetables.index');
        }

        $courses = Course::where('level', $level)->where('semester', $semester)->get();
        $lecturers = User::where('role_id', 3)->get();
        $halls = LectureHall::all();

        return Inertia::render('TimeTable/Create', [
            'courses' => $courses,
            'lecturers' => $lecturers,
            'semester' => $semester_id,
            'halls' => $halls,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $tableData = $request->input('timetable');
    $semester = $request->input('semester_id');
    $condition = $request->input('conditions');

    // Newly added Conditions
    $lunchTime = [
        'start' => $condition['lunchTime']['start'] ?? '12:00',
        'end' => $condition['lunchTime']['end'] ?? '13:00'
    ];

    $lectureTime = [
        'start' => $condition['lectureTime']['start'] ?? '08:00',
        'end' => $condition['lectureTime']['end'] ?? '16:00'
    ];

    $practicalTime = [
        'start' => $condition['practicalTime']['start'] ?? '08:00',
        'end' => $condition['practicalTime']['end'] ?? '16:00'
    ];

    $freeTimeslots = $condition['freeTimeslots'] ?? [];

    $lunchtimeStart = $lunchTime['start'];
    $lunchtimeEnd = $lunchTime['end'];
    $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    $existingEntries = [];
    foreach ($daysOfWeek as $day) {
        $existingEntries[$day] = TimeTable::where('day_of_week', $day)->get()->map(function ($entry) {
            return [
                'start' => $entry->start_time,
                'end' => $entry->end_time,
                'type' => $entry->type,
            ];
        })->toArray();
    }

    foreach ($tableData as $entry) {
        $course = $entry['course']['value'];
        $lecturer = $entry['lecturer']['value'];
        $hall = $entry['hall']['value'];
        $type = $entry['type']['value'];

        $duration = match ($type) {
            'Theory' => $course['theory_hours'] * 60,
            'Practical' => $course['practical_hours'] * 60,
            'Tutorial' => $course['tutorial_hours'] * 60,
            default => throw new Exception("Invalid type: $type")
        };

        $timeSlot = $this->findAvailableTimeSlot($lectureTime, $practicalTime, $duration, $existingEntries, $lunchtimeStart, $lunchtimeEnd, $daysOfWeek, $type,$freeTimeslots);

        if ($timeSlot) {
            $startTime = $timeSlot['start'];
            $endTime = $timeSlot['end'];
            $dayOfWeek = $timeSlot['day_of_week'];


                TimeTable::create([
                'course' => $course['id'],
                'hall_id' => $hall['id'],
                'lecturer' => $lecturer['id'],
                'semester_id' => $semester,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'day_of_week' => $dayOfWeek,
                'type' => $type,
            ]);

            $existingEntries[$dayOfWeek][] = ['start' => $startTime, 'end' => $endTime, 'type' => $type];
        } else {
            return back()->withErrors(['msg' => 'No available time slot found for ' . $type . ' ' . $course['name']])->withInput();
        }
    }

    error_log($semester);
    Condition::create([
        'lunchtime_start' => $lunchtimeStart.":00",
        'lunchtime_end' => $lunchtimeEnd. ":00",
        'semester_id' => $semester,
    ]);


    return $this->show($semester);
}

private function findAvailableTimeSlot($lectureTime, $practicalTime, $duration, $existingEntries, $lunchtimeStart, $lunchtimeEnd, $daysOfWeek, $type, $freeTimeslots)
{
    $dayStart = $type === 'Practical' ? $practicalTime['start'] : $lectureTime['start'];
    $dayEnd = $type === 'Practical' ? $practicalTime['end'] : $lectureTime['end'];

    foreach ($daysOfWeek as $day) {
        $currentStart = $dayStart;
        while (strtotime($currentStart) + $duration * 60 <= strtotime($dayEnd)) {
            $currentEnd = date('H:i:s', strtotime($currentStart) + $duration * 60);

            // Check for lunchtime overlap
            if ($currentStart < $lunchtimeEnd && $currentEnd > $lunchtimeStart) {
                $currentStart = date('H:i:s', strtotime($lunchtimeEnd));
                continue;
            }

            // Check if the current timeslot is within any free timeslot
            $isFreeTimeslot = false;
            foreach ($freeTimeslots as $freeTimeslot) {
                if ($day == $freeTimeslot['day'] &&
                    !($currentEnd <= $freeTimeslot['start'] || $currentStart >= $freeTimeslot['end'])) {
                    $isFreeTimeslot = true;
                    break;
                }
            }
            if ($isFreeTimeslot) {
                $currentStart = date('H:i:s', strtotime($currentStart) + 60); // Increment by one minute to find the next slot
                continue;
            }

            // Check for overlap with existing entries
            $overlap = false;
            if (isset($existingEntries[$day])) {
                foreach ($existingEntries[$day] as $entry) {
                    if ($currentStart < $entry['end'] && $currentEnd > $entry['start']) {
                        $overlap = true;
                        break;
                    }
                }
            }

            if (!$overlap) {
                return ['start' => $currentStart, 'end' => $currentEnd, 'day_of_week' => $day];
            }

            $currentStart = date('H:i:s', strtotime($currentStart) + 60); // Increment by one minute to find the next slot
        }
    }

    return null; // No suitable time slot found
}



    /**
     * Display the specified resource.
     */
    public function show(int $semester)
    {
        $lunchTime['start'] = Condition::where('semester_id', $semester)->pluck('lunchtime_start');
        $lunchTime['end'] = Condition::where('semester_id', $semester)->pluck('lunchtime_end');
        $timetables = TimeTable::with(['course', 'hall', 'lecturer', 'semester'])
            ->where('semester_id', $semester)
            ->get();
        return Inertia::render('TimeTable/ShowTimeTable', ['timetables' => $timetables, 'semester' => $semester, 'lunchTime' => $lunchTime]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TimeTable $timeTable)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTimeTableRequest $request, TimeTable $timeTable)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $semester)
    {
        $timetables = TimeTable::where('semester_id', $semester)->get();
        foreach ($timetables as $timetable) {
           try{$timetable->delete();}
              catch (QueryException $e) {
                return back()->withErrors(['msg' => 'An error occurred while deleting the timetable.']);
              }
        }
        $condition = Condition::where('semester_id', $semester)->get();
        foreach ($condition as $cond) {
            try{$cond->delete();}
            catch (QueryException $e) {
                return back()->withErrors(['msg' => 'An error occurred while deleting the timetable.']);
            }
        }
        return redirect()->route('timetables.index')->with('success', 'Timetable deleted successfully.');
    }
}
