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
        $query->select('semester_id')
              ->from('time_tables');
    })->orderBy('id')->get();

    $semestersNotInTimeTable = Semester::whereNotIn('id', function($query) {
        $query->select('semester_id')
              ->from('time_tables');
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
        $semester_id=$request->query('semester_id');
        $courses = Course::where('level',$level)->where('semester',$semester)->get();
        $lecturers=User::where('role_id', 3)->get();
        $halls=LectureHall::all();
        return Inertia::render('TimeTable/Create', ['courses' => $courses,'lecturers' =>$lecturers,'semester' => $semester_id,'halls'=>$halls,]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // Get timetable data from the request
    $tableData = $request->input('timetable');
    $semester = $request->input('semester_id');
    // Define the start and end time for the restricted period
    $restrictedStart = '12:00:00';
    $restrictedEnd = '13:00:00';

    // Define the range of days to consider (e.g., Monday to Friday)
    $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Initialize an array to hold existing timetable entries by day of the week
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

        // Determine the duration based on the type (assuming course has these attributes)
        $duration = match ($type) {
            'Theory' => $course['theory_hours'] * 60,
            'Practical' => $course['practical_hours'] * 60,
            'Tutorial' => $course['tutorial_hours'] * 60,
        };

        // Find a suitable time slot that avoids overlaps and restricted times
        $timeSlot = $this->findAvailableTimeSlot($duration, $existingEntries, $restrictedStart, $restrictedEnd, $daysOfWeek, $type);

        if ($timeSlot) {
            $startTime = $timeSlot['start'];
            $endTime = $timeSlot['end'];
            $dayOfWeek = $timeSlot['day_of_week'];

            // Save the timetable entry
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

            // Add this slot to existing entries to avoid future overlaps
            $existingEntries[$dayOfWeek][] = ['start' => $startTime, 'end' => $endTime, 'type' => $type];
        } else {
            // Handle the case where no suitable time slot was found
            return response()->json(['error' => 'No available time slot for ' . $course['name']], 400);
        }
    }

    // Redirect to the showTimeTable route after storing the timetable entries
    return $this->show($semester);
}

private function findAvailableTimeSlot($duration, $existingEntries, $restrictedStart, $restrictedEnd, $daysOfWeek, $type)
{
    // Define the range of the day (e.g., from 08:00 to 16:00)
    $dayStart = '08:00:00';
    $dayEnd = '16:00:00';

    // Define the interval between slots (e.g., 30 minutes)
    $interval = 30; // in minutes

    foreach ($daysOfWeek as $day) {
        $currentStart = $dayStart;

        while (strtotime($currentStart) + $duration * 60 <= strtotime($dayEnd)) {
            $currentEnd = date('H:i:s', strtotime($currentStart) + $duration * 60);

            // Skip the restricted time
            if ($currentStart < $restrictedEnd && $currentEnd > $restrictedStart) {
                $currentStart = date('H:i:s', strtotime($restrictedEnd) + $interval * 60);
                continue;
            }

            // Check for overlaps with existing entries for the current day
            $overlap = false;
            if (isset($existingEntries[$day])) {
                foreach ($existingEntries[$day] as $entry) {
                    if ($currentStart < $entry['end'] && $currentEnd > $entry['start'] && $entry['type'] == $type) {
                        $overlap = true;
                        break;
                    }
                }
            }

            if (!$overlap) {
                return ['start' => $currentStart, 'end' => $currentEnd, 'day_of_week' => $day];
            }

            // Move to the next slot
            $currentStart = date('H:i:s', strtotime($currentStart) + $interval * 60);
        }
    }

    return null; // No suitable time slot found
}




    /**
     * Display the specified resource.
     */
    public function show(int $semester)
    {
        $timetables = TimeTable::with(['course', 'hall', 'lecturer', 'semester'])
        ->where('semester_id', $semester)
        ->get();
        return Inertia::render('TimeTable/ShowTimeTable', ['timetables' => $timetables,'semester'=>$semester]);

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
