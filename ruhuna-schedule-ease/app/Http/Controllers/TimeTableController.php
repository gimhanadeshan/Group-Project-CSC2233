<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TimeTable;
use App\Models\Course;
use App\Models\User;
use App\Models\Semester;
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
    error_log(json_encode($tableData));

    // Default conditions
    $lunchTime = $condition['lunchTime'] ?? ['start' => '12:00', 'end' => '13:00'];
    $lectureTime = $condition['lectureTime'] ?? ['start' => '08:00', 'end' => '14:00'];
    $practicalTime = $condition['practicalTime'] ?? ['start' => '10:00', 'end' => '14:00'];
    $freeTimeslots = $condition['freeTimeslots'] ?? [];

    // Helper function to check time overlap
    function isTimeOverlap($start1, $end1, $start2, $end2)
    {
        return max($start1, $start2) < min($end1, $end2);
    }

    // Generate timetable slots
    $weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    $currentDayIndex = 0;
    $lastEndTime = null;

    foreach ($tableData as $entry) {
        $type = $entry['type']['value'];
        $hallId = $entry['hall']['value']['id'];
        $courseId = $entry['course']['value']['id'];
        $courseTheoryDuration=$entry['course']['value']['theory_hours'];
        $coursePracticalDuration=$entry['course']['value']['practical_hours'];
        $courseTutorialDuration=$entry['course']['value']['tutorial_hours'];
        $lecturerId = $entry['lecturer']['value']['id'];

        // Determine start and end times based on type
        if ($type == 'Theory' || $type == 'Tutorial') {
            $startTime = $lectureTime['start'];
            $endTime = $lectureTime['end'];
        } elseif ($type == 'Practical') {
            $startTime = $practicalTime['start'];
            $endTime = $practicalTime['end'];
        } else {
            return response()->json(['error' => 'Unknown type'], 400);
        }

        // Adjust times to fit within the available slots
        if ($lastEndTime && $lastEndTime >= $startTime) {
            $startTime = $lastEndTime;
        }
        $endTime = date('H:i', strtotime($startTime) + 60 * 60); // Assume each slot is 1 hour

        // Check if the current day is full, move to the next day
        if ($currentDayIndex >= count($weekDays)) {
            return response()->json(['error' => 'Insufficient days to schedule all entries'], 400);
        }

        $dayOfWeek = $weekDays[$currentDayIndex];
        $lastEndTime = $endTime;

        // Check lunch time condition
        if (isTimeOverlap($startTime, $endTime, $lunchTime['start'], $lunchTime['end'])) {
            $currentDayIndex++;
            $lastEndTime = null;
            continue; // Skip this slot and try the next day
        }

        // Check free timeslots condition
        $skipSlot = false;
        foreach ($freeTimeslots as $slot) {
            if ($dayOfWeek == $slot['day'] && isTimeOverlap($startTime, $endTime, $slot['start'], $slot['end'])) {
                $skipSlot = true;
                break;
            }
        }
        if ($skipSlot) {
            $currentDayIndex++;
            $lastEndTime = null;
            continue; // Skip this slot and try the next day
        }

        // Check for overlapping lectures and continuous same lectures
        $existingEntries = TimeTable::where('day_of_week', $dayOfWeek)
            ->where('semester_id', $semester)
            ->get();

        foreach ($existingEntries as $existing) {
            if (isTimeOverlap($startTime, $endTime, $existing->start_time, $existing->end_time)) {
                return response()->json(['error' => 'Time slot overlaps with another lecture'], 400);
            }

            if ($existing->type == $type && $existing->course == $courseId &&
                ($existing->start_time == $endTime || $existing->end_time == $startTime)) {
                return response()->json(['error' => 'Same lecture cannot be continuous'], 400);
            }

            if ($existing->hall_id == $hallId && isTimeOverlap($startTime, $endTime, $existing->start_time, $existing->end_time)) {
                return response()->json(['error' => 'Hall is already in use'], 400);
            }
        }

        // Store timetable entry
        TimeTable::create([
            'start_time' => $startTime,
            'end_time' => $endTime,
            'type' => $type,
            'day_of_week' => $dayOfWeek,
            'course' => $courseId,
            'hall_id' => $hallId,
            'lecturer' => $lecturerId,
            'semester_id' => $semester,
        ]);

        // Prepare for the next slot
        if ($endTime >= $lectureTime['end']) {
            $currentDayIndex++;
            $lastEndTime = null;
        }
    }

    return $this->show($semester);
}


    /**
     * Display the specified resource.
     */
    public function show(int $semester)
    {
        $timetables = TimeTable::with(['course', 'hall', 'lecturer', 'semester'])
            ->where('semester_id', $semester)
            ->get();
        return Inertia::render('TimeTable/ShowTimeTable', ['timetables' => $timetables, 'semester' => $semester]);
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
            $timetable->delete();
        }
        return redirect()->route('timetables.index')->with('success', 'Timetable deleted successfully.');
    }
}
