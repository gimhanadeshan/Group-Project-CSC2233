<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\TimeTable;
use App\Models\Semester;
use App\Models\LectureHall;
use App\Models\Course;
use App\Models\Attendance;
use App\Models\CourseRegistration; 
use App\Models\User;


use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;



class EventController extends Controller
{
    public function index(Request $request)
{
    $this->authorize('read_event', $request->user());

    $UId=$request->user()->id;
    $Role=$request->user()->role->role_type;
    // Fetch the semester_id from the course_registrations table for the logged-in user
    $semesterId = CourseRegistration::
                    where('user_id', $UId)
                    ->where('status', 'confirmed')
                    ->orderBy('created_at', 'desc') // Adjust ordering as necessary
                    ->value('semester_id');
    


    //For Students 
    if ($semesterId || $Role==='student') {
        // Fetch events that match the user's semester_id
        // $allevents = Event::where('semester_id', $semesterId) //->get();
        //               ->orWhere('user_id',$UId)
        //               ->orWhereNull('semester_id')
        //               ->get();

        
        //To get only user created events 
        $adminLecsIds = User::whereIn('role_id', [1, 3])->pluck('id');
        $adminLecsIds->push($UId);
        error_log($adminLecsIds);

        $allevents = Event::where('semester_id', $semesterId)
                  
                            ->orWhereIn('user_id', $adminLecsIds)
                  
                            ->get();  
        





     return Inertia::render('Events/EventCalendar', ['allevents' => $allevents]);
       
    //For Lecturer     
    }else{
        if($Role==='lecturer'){

            $allevents = Event::where('lec_id',$UId)//->get();
                                ->orWhereNull('semester_id')
                                ->get();
            return Inertia::render('Events/EventCalendar', ['allevents' => $allevents]);
        }
    }
    
    
    
    $allevents = Event::whereNull('semester_id', $semesterId)->get();
    return Inertia::render('Events/EventCalendar', ['allevents' => $allevents]);

               
    }





public function generateEventsFromTimetable(Request $request,$semesterId)
{

    error_log("o");

    $user = $request->user();
    $semester = Semester::findOrFail($semesterId);
    $timeTables = TimeTable::where('semester_id', $semesterId)->get();

    foreach ($timeTables as $slot) {
        

        // Get the day of the week for the timetable slot
        $dayOfWeek = Carbon::parse($semester->start_date)->subDay()->next($slot->day_of_week);
        $startTime = Carbon::parse($slot->start_time);
        $endTime = Carbon::parse($slot->end_time);

        while ($dayOfWeek->lessThanOrEqualTo(Carbon::parse($semester->end_date))) {

            $startDateTime = $dayOfWeek->copy()->setTimeFrom($startTime)->toDateTimeString();
            $endDateTime = $dayOfWeek->copy()->setTimeFrom($endTime)->toDateTimeString();

            $eventTitle= $slot->course->code . ' (' . $slot->type . ')';

            switch ($slot->type) {
                case 'Theory':
                    $courseType = 1;
                    break;
            
                case 'Tutorial':
                    $courseType = 2;
                    break;
            
                case 'Practical':
                    $courseType = 3;
                    break;
            
                default:
                    // Handle unexpected values if necessary
                    $courseType = null; // or some default value
                    break;
            }
            
            // Check if an event already exists for this time slot and day
            $existingEvent = Event::where('event_title',$eventTitle )
                ->where('location', $slot->hall->name)
                ->where('start', $startDateTime)
                ->where('end', $endDateTime)
                ->first();

            if (!$existingEvent) {
                Event::create([
                    'event_title' => $eventTitle, 
                    'location' => $slot->hall->name,
                    'start' => $startDateTime,
                    'end' => $endDateTime,
                    'user_id' => $user->id,
                    'semester_id' => $semesterId,
                    'course_id' => $slot->course->id,
                    'hall_id' => $slot->hall_id,
                    'lec_id' => $slot->lecturer,
                    'course_id' => $slot->course->id,
                    'course_type' => $courseType,

                ]);
            }

            // Move to the next week
            $dayOfWeek->addWeek();
        }
    }
    return redirect()->back()->with('success', 'Events generated successfully from the timetable');
}


    public function store(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'event_title' => 'required',
            'location' => 'required',
            'start' => 'required|date',
            'end' => 'required|date',
            'Lec_attended' => 'nullable|boolean',
            'daily' => 'sometimes|boolean',
            'weekly' => 'sometimes|boolean',
            'monthly' => 'sometimes|boolean',
            'user_id' => 'nullable|sometimes|exists:users,id',
            'course_id' => 'nullable|sometimes|exists:courses,id',
            'semester_id' => 'nullable|sometimes|exists:semesters,id',
            'lec_id' => 'nullable|sometimes|exists:users,id',
            'hall_id' => 'nullable|sometimes|exists:lecture_halls,id',
            'course_type' => 'nullable|exists:course_types,id',

        ]);
        $data['user_id'] = $user->id;

        // $updateData = $validatedData;
        // $updateData['user_id'] = $user->id;

        // // Prevent fields from being set to NULL if not present in the request
        // $updateData['course_id'] = $request->has('course_id') ? $validatedData['course_id'] : $event->course_id;
        // $updateData['semester_id'] = $request->has('semester_id') ? $validatedData['semester_id'] : $event->semester_id;
        // $updateData['lec_id'] = $request->has('lec_id') ? $validatedData['lec_id'] : $event->lec_id;
        // $updateData['hall_id'] = $request->has('hall_id') ? $validatedData['hall_id'] : $event->hall_id;

        // Determine the number of events to create based on recurrence
        if ($request->daily) {
            $this->createRecurringEvents($data, 'day');
        } elseif ($request->weekly) {
            $this->createRecurringEvents($data, 'week');
        } elseif ($request->monthly) {
            $this->createRecurringEvents($data, 'month');
        } else {
            Event::create($data);
        }

        return redirect()->back()->with('success', 'Event created successfully');
    }

   
    public function update(Request $request, $id)
{
    //error_log("1");
    //error_log(print_r($request->all(), true));

    
//try {
    $validatedData = $request->validate([
        'event_title' => 'required',
        'location' => 'required',
        'start' => 'required|date',
        'end' => 'required|date',
        'Lec_attended' => 'nullable|boolean',
        'daily' => 'sometimes|boolean',
        'weekly' => 'sometimes|boolean',
        'monthly' => 'sometimes|boolean',
        'user_id' => 'nullable|sometimes|exists:users,id',
        'course_id' => 'nullable|sometimes|exists:courses,id',
        'semester_id' => 'nullable|sometimes|exists:semesters,id',
        'lec_id' => 'nullable|sometimes|exists:users,id',
        'hall_id' => 'nullable|sometimes|exists:lecture_halls,id',
        'course_type' => 'nullable|sometimes|exists:course_types,id', // Validate course_type
    ]);
//     error_log("2");
// } catch (\Illuminate\Validation\ValidationException $e) {
//     // Log the validation errors
//     error_log("Validation failed");
//     error_log(print_r($e->errors(), true));
//     // Optionally rethrow the exception to let Laravel handle it
//     throw $e;
// }

    //("2");
    // Find the event by its ID
    $event = Event::findOrFail($id);
    $user = $request->user();

    // Only update fields if they are present in the request
    $updateData = $validatedData;
    $updateData['user_id'] = $user->id;

    // Prevent fields from being set to NULL if not present in the request
    $updateData['course_id'] = $request->has('course_id') ? $validatedData['course_id'] : $event->course_id;
    $updateData['semester_id'] = $request->has('semester_id') ? $validatedData['semester_id'] : $event->semester_id;
    $updateData['lec_id'] = $request->has('lec_id') ? $validatedData['lec_id'] : $event->lec_id;
    $updateData['hall_id'] = $request->has('hall_id') ? $validatedData['hall_id'] : $event->hall_id;
    $updateData['course_type'] = $request->has('course_type') ? $validatedData['course_type'] : $event->course_type;


    // Delete existing event if recurrence options are updated
    if ($request->daily || $request->weekly || $request->monthly) {
        $event->delete();

        // Handle recurrence update
        if ($request->daily) {
            $this->createRecurringEvents($updateData, 'day');
        } elseif ($request->weekly) {
            $this->createRecurringEvents($updateData, 'week');
        } elseif ($request->monthly) {
            $this->createRecurringEvents($updateData, 'month');
        }
    } else {
        // Update the existing event without deleting
        $event->update($updateData);
    }

    return redirect()->back()->with('success', 'Event updated successfully');
}


    public function destroy($id)
    {
        try {
            $event = Event::findOrFail($id);
            $event->delete();

            return redirect()->back()->with('success', 'Event deleted successfully');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete event.'], 500);
        }
    }

    private function createRecurringEvents(array $data, string $frequency)
    {
        $start = Carbon::parse($data['start']);
        $end = Carbon::parse($data['end']);
        $endDate = Carbon::now()->addMonth(6); // Set the end of recurrence (1 year from now)

        while ($start->lessThanOrEqualTo($endDate)) {
            Event::create([
                'event_title' => $data['event_title'],
                'location' => $data['location'],
                'start' => $start->toDateTimeString(),
                'end' => $end->toDateTimeString(),
            ]);

            // Adjust dates based on frequency
            $start->add($frequency, 1);
            $end->add($frequency, 1);
        }
    }




//EventDetails Page Functions


    public function getEvent($id)
{

        $event=Event::where('id',$id)->get();
        $users=[];
        $semesters=[];
        $courses=[];
        $halls=[];
        $lecturers=[];

        return Inertia::render('Events/EventDetails',[
            'event'=>$event,
            'users'=>$users,
            'semesters'=>$semesters,
            'courses' => $courses,
            'halls'=>$halls,
            'lecturers'=>$lecturers

        ]);
}

    public function getEventUpdate(Request $request, $id)
{
    $event = Event::findOrFail($id);
    $user = $request->user();

    $data = $request->validate([
        'event_title' => 'required',
        'location' => 'required',
        'start' => 'required|date',
        'end' => 'required|date',
        'Stu_attended' => 'nullable|boolean', 
        'Lec_attended' => 'nullable|boolean',
        'daily' => 'sometimes|boolean',
        'weekly' => 'sometimes|boolean',
        'monthly' => 'sometimes|boolean',
        'user_id' => 'nullable|sometimes|exists:users,id',
        'course_id' => 'nullable|sometimes|exists:courses,id',
        'semester_id' => 'nullable|sometimes|exists:semesters,id',
        'lec_id' => 'nullable|sometimes|exists:users,id',
        'hall_id' => 'nullable|sometimes|exists:lecture_halls,id',
        
    ]);

    // Update existing event if no recurrence options are selected
    if (!$request->daily && !$request->weekly && !$request->monthly) {
        $event->update($data);
    } else {
        // Delete existing event if recurrence options are updated
        $event->delete();

        //$data['user_id'] = $user->id;

        // Handle recurrence update
        if ($request->daily) {
            $this->createRecurringEvents($data, 'day');
        } elseif ($request->weekly) {
            $this->createRecurringEvents($data, 'week');
        } elseif ($request->monthly) {
            $this->createRecurringEvents($data, 'month');
        }
    }
    
    //return redirect()->route('events')->with('success', 'Event updated successfully');
    return redirect()->back();
}




//Attendance 

public function generateAttendanceRecordsForAllEvents()
{
    // Fetch all events that have a course_id and course_type
    $events = Event::whereNotNull('course_id')
                   ->whereNotNull('course_type') // Ensure that course_type is present
                   ->get();

    foreach ($events as $event) {
        $courseId = $event->course_id;
        $courseType = $event->course_type; // Fetch the course_type as an integer ID

        // Fetch all students registered for the course
        $studentIds = DB::table('course_registrations')
                        ->where('course_id', $courseId)
                        ->where('status', 'confirmed')
                        ->pluck('user_id'); // 'user_id' in 'course_registrations' is the student ID

        // Prepare data for bulk insert
        $attendanceRecords = [];
        foreach ($studentIds as $studentId) {
            // Check if the record already exists for the specific course type
            $exists = DB::table('event_student')
                        ->where('event_id', $event->id)
                        ->where('student_id', $studentId)
                        ->where('course_type', $courseType) // Compare using the integer ID
                        ->exists();

            if (!$exists) {
                $attendanceRecords[] = [
                    'event_id' => $event->id,
                    'student_id' => $studentId,
                    'course_type' => $courseType, // 'course_type' as integer (foreign key ID)
                    'attended' => null, // Default value
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Insert only the records that don't exist
        if (!empty($attendanceRecords)) {
            DB::table('event_student')->insert($attendanceRecords);
        }
    }
}









    public function generateAttendanceRecords($eventId)
{
    // Get the event to fetch the associated course_id
    $event = Event::findOrFail($eventId);
    $courseId = $event->course_id;
    $courseType = $event->course_type;

    // Fetch all students registered for the course
    $studentIds = DB::table('course_registrations')
                    ->where('course_id', $courseId)
                    ->where('status', 'confirmed')
                    ->pluck('user_id'); // Assuming 'user_id' in 'course_registrations' is the student ID

    // Prepare data for bulk insert
    $attendanceRecords = [];
    foreach ($studentIds as $studentId) {
        // Check if the record already exists for the specific course type
        $exists = DB::table('event_student')
                    ->where('event_id', $event->id)
                    ->where('student_id', $studentId)
                    ->where('course_type', $courseType) // Compare using the integer ID
                    ->exists();

        if (!$exists) {
            $attendanceRecords[] = [
                'event_id' => $event->id,
                'student_id' => $studentId,
                'course_type' => $courseType, // 'course_type' as integer (foreign key ID)
                'attended' => null, // Default value
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
    }

    // Insert all attendance records into the event_student table
    DB::table('event_student')->insert($attendanceRecords);
}


public function attendanceUpdate(Request $request, $eventid)
{
    $user = $request->user();

    // Validate the incoming request
    $data = $request->validate([
        'attended' => 'nullable|boolean',
    ]);

    // Find the attendance record using event_id and student_id
    $record = DB::table('event_student')
                ->where('event_id', $eventid)
                ->where('student_id', $user->id)
                ->first();

    // If the record exists, update it
    if ($record) {
        DB::table('event_student')
            ->where('event_id', $eventid)
            ->where('student_id', $user->id)
            ->update([
                'attended' => $data['attended'],
                'updated_at' => now(),
            ]);
    }

    return redirect()->back();
}

public function getAttendance(Request $request, $eventid)
{
    $user = $request->user();

    // Find the attendance record using event_id and student_id
    $attendance = DB::table('event_student')
                    ->where('event_id', $eventid)
                    ->where('student_id', $user->id)
                    ->first();

    // Check if the record exists and get the attendance status
    $attended = $attendance ? $attendance->attended : false;

    // Return the data using Inertia
    return Inertia::render('Events/EventCalendar', [
        'attendance' => $attended,
    ]);
}



public function viewAttendance($courseType,$eventId, $studentId)

{
    $event = Event::findOrFail($eventId);

    $attendance = DB::table('event_student')
        ->where('event_id', $eventId)
        ->where('student_id', $studentId)
        ->where('course_type',$courseType)
        ->first(['attended','course_type' ]);
        //dd($attendance);
    return Inertia::render('Events/Attendance', [
        'event'=>$event,
        'attendance' => $attendance,
        'eventId' => $eventId,
        'studentId' => $studentId,
    ]);

}


public function updateAttendance(Request $request,$courseType, $eventId, $studentId)
{
    
    // Validate the request data
    $data = $request->validate([
        'attended' => 'nullable|boolean',
        //'course_type' => 'required|integer|in:1,2,3', // Validate course_type as integer
    ]);
    
    // Update the attendance record
    DB::table('event_student')
        ->where('event_id', $eventId)
        ->where('student_id', $studentId)
        ->where('course_type', $courseType) // Include course_type in the WHERE clause
        ->update(['attended' => $data['attended']]);

        return redirect()->route('events')->with('success', 'Attendance updated successfully.');
    }


public function showAttendancePage()
{
    $userId = Auth::id();
    $roleId = Auth::user()->role_id;

    if ($roleId == 2) {
        // If the user is a student
        $attendanceRecords = DB::table('event_student')
            ->join('events', 'event_student.event_id', '=', 'events.id')
            ->join('courses', 'events.course_id', '=', 'courses.id')
            ->where('event_student.student_id', $userId)
            ->select(
                'courses.code as course_code',
                'event_student.course_type as course_type',
                DB::raw('SUM(CASE WHEN event_student.attended = 1 THEN 1 ELSE 0 END) as total_attended'),
                DB::raw('COUNT(event_student.id) as total_events') // Count records in event_student to get total events per course_type
            )
            ->groupBy('courses.code', 'event_student.course_type')
            //->toSql();
            ->get();
            //dd($attendanceRecords);
    } else if ($roleId == 3) {
        // If the user is a lecturer
        $attendanceRecords = DB::table('event_student')
            ->join('events', 'event_student.event_id', '=', 'events.id')
            ->join('courses', 'events.course_id', '=', 'courses.id')
            ->where('events.lec_id', $userId)
            ->select(
                'courses.code as course_code',
                'event_student.course_type as course_type',
                DB::raw('SUM(CASE WHEN events.Lec_attended = 1 THEN 1 ELSE 0 END) as total_attended'),
                DB::raw('COUNT(event_student.id) as total_events') // Count records in event_student to get total events per course_type
            )
            ->groupBy('courses.code', 'event_student.course_type')
            ->get();
    } else {
        return redirect()->back()->withErrors('Unauthorized access');
    }

    return Inertia::render('Events/AttendancePage', [
        'attendanceRecords' => $attendanceRecords,
        'roleId' => $roleId,
    ]);
}


public function showCalendarAttendance($courseType,$eventId, $studentId)
{
    $attendance = DB::table('event_student')
        ->where('event_id', $eventId)
        ->where('student_id', $studentId)
        ->where('course_type',$courseType)
        ->first(['attended','course_type' ]);
        //dd($attendance);
    return Inertia::render('Events/EventCalendar', [
        'attendance' => $attendance,
        'eventId' => $eventId,
        'studentId' => $studentId,
    ]);

}




}
