import React from 'react';
import PopOver from '@/Components/PopOver';

export default function ShowTimeTable({ timetables, semester, lunchTime,semesterinfo}) {


    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
        "08.00-09.00", "09.00-10.00", "10.00-11.00", "11.00-12.00",
        "12.00-13.00", "13.00-14.00", "14.00-15.00", "15.00-16.00",
        "16.00-17.00", "17.00-18.00"
    ];

    const lunchBreak = {
        start_time: lunchTime.start,
        end_time: lunchTime.end,
        course: { name: 'Lunch Break' },
        lecturer: { name: '' },
        hall : {name: ''}
    };

    const getTimeSlotIndex = (time) => {
        const [hours, minutes] = String(time).split(':').map(Number);
        return hours - 8; // Assuming time slots start from 08:00
    };
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };


    const createTimetableMatrix = (day) => {
        const matrix = new Array(timeSlots.length).fill({timetable: null, color: ''});
        const Randcolor= "gray";
        timetables
            .filter((timetable) => timetable.day_of_week === day)
            .concat(lunchBreak)
            .forEach((timetable) => {
                const startIndex = getTimeSlotIndex(timetable.start_time);
                const endIndex = getTimeSlotIndex(timetable.end_time);

                for (let i = startIndex; i < endIndex; i++) {
                    matrix[i] = {
                        timetable: null,
                        color: Randcolor // Assign a random color to the timetable
                    };
                }
                matrix[Math.round((startIndex + endIndex) / 2)-1] = {timetable :timetable, color: Randcolor};
                console.log(matrix[2].timetable);
            });

        return matrix;
    };

    return (

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <table className="min-w-full bg-white dark:bg-gray-800">
                                <thead>
                                    <tr className="border-b dark:border-gray-600">
                                        <th className="px-4 py-2 text-sm text-gray-600 dark:text-blue-400 font-serif">Time</th>
                                        {daysOfWeek.map((day) => (
                                            <th key={day} className="px-4 py-2 text-sm text-gray-600 dark:text-blue-400 font-serif">{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map((timeSlot, slotIndex) => (
                                        <tr key={timeSlot}>
                                            <td className="px-4 py-2 text-sm text-gray-100 bg-gray-800 dark:bg-gray-900 font-serif">{timeSlot}</td>
                                            {daysOfWeek.map((day) => (
                                                <td key={day} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-serif" style={{ backgroundColor: createTimetableMatrix(day)[slotIndex]?.color || 'transparent' }}>
                                                    { createTimetableMatrix(day)[slotIndex].timetable ? <PopOver timeslot={createTimetableMatrix(day)[slotIndex].timetable}/>: <PopOver timeslot={null}/>}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
    );
}
