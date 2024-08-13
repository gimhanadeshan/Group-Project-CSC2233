<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #fff;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: center;
        }
        th {
            background-color: #f2f2f2;
        }
        .bg-yellow-100 {
            background-color: #fefcbf;
        }
    </style>
    <title>Timetable PDF</title>
</head>
<body>
    <h1 style="text-align: center;">
        Timetable of Level {{ $semesterinfo['level'] }} - Semester {{ $semesterinfo['semester'] }} - {{ $semesterinfo['academic_year'] }}
    </h1>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Time</th>
                    @foreach (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as $day)
                        <th>{{ $day }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @php
                    $timeSlots = [
                        "08.00-09.00", "09.00-10.00", "10.00-11.00", "11.00-12.00",
                        "12.00-13.00", "13.00-14.00", "14.00-15.00", "15.00-16.00",
                        "16.00-17.00", "17.00-18.00"
                    ];

                    function getTimeSlotIndex($time) {
                        [$hours, $minutes] = explode(':', $time);
                        return (int)$hours - 8; // Convert hours to integer and then subtract 8
                    }




                    function createTimetableMatrix($day, $timetables, $lunchBreak) {
                        $matrix = array_fill(0, 10, null);
                        $timetablesForDay = [];

                        foreach ($timetables as $timetable) {
                            if (isset($timetable['day_of_week']) && $timetable['day_of_week'] === $day) {
                                $timetablesForDay[] = $timetable;
                            }
                        }

                        $timetablesForDay[] = $lunchBreak;
                        foreach ($timetablesForDay as $timetable) {
                            if (isset($timetable['start_time'], $timetable['end_time'])) {
                                $startIndex = getTimeSlotIndex($timetable['start_time']);
                                $endIndex = getTimeSlotIndex($timetable['end_time']);
                                $matrix[($startIndex+$endIndex)/2] = $timetable;
                            }
                        }
                        return $matrix;
                    }

                    $lunchBreak = [
                        'start_time' => $lunchTime['start'][0],
                        'end_time' => $lunchTime['end'][0],
                        'course' => ['name' => 'Lunch Break'],
                        'lecturer' => ['name' => ''],
                        'hall' => ['name' => '']
                    ];
                @endphp

                @foreach ($timeSlots as $slotIndex => $timeSlot)
                    <tr>
                        <td>{{ $timeSlot }}</td>
                        @foreach (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as $day)
                            @php
                                $matrix = createTimetableMatrix($day, $timetables, $lunchBreak);
                            @endphp
                            <td class="{{ $matrix[$slotIndex] && $matrix[$slotIndex]['course']['name'] === 'Lunch Break' ? 'bg-yellow-100' : '' }}">
                                @if (($matrix[$slotIndex]))
                                    {{ $matrix[$slotIndex]['course']['name'] ?? '' }} -
                                    {{ $matrix[$slotIndex]['start_time'] ?? '' }} -
                                    {{ $matrix[$slotIndex]['end_time'] ?? '' }}
                                @else
                                    &nbsp;
                                @endif
                            </td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
