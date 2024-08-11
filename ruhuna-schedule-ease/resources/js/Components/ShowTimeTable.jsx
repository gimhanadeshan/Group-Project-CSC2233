
import Authenticated from "@/Layouts/AuthenticatedLayout";
import React from "react";
import PopOver from "@/Components/PopOver";
import { Head, Link, useForm } from "@inertiajs/react";

export default function ShowTimeTable({
    auth,
    timetables,
    semester,
    lunchTime,
}) {
    const { delete: deleteTimeTable } = useForm();



    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = [
        "08.00-09.00",
        "09.00-10.00",
        "10.00-11.00",
        "11.00-12.00",
        "12.00-13.00",
        "13.00-14.00",
        "14.00-15.00",
        "15.00-16.00",
        "16.00-17.00",
        "17.00-18.00",
    ];

    const lunchBreak = {
        start_time: lunchTime.start,
        end_time: lunchTime.end,
        course: { name: "Lunch Break" },
        lecturer: { name: "" },
        hall: { name: "" },
    };

    const getTimeSlotIndex = (time) => {
        const [hours, minutes] = String(time).split(":").map(Number);
        return hours - 8; // Assuming time slots start from 08:00
    };

    const createTimetableMatrix = (day) => {
        const matrix = new Array(timeSlots.length).fill(null);

        timetables
            .filter((timetable) => timetable.day_of_week === day)
            .concat(lunchBreak)
            .forEach((timetable) => {
                const startIndex = getTimeSlotIndex(timetable.start_time);
                const endIndex = getTimeSlotIndex(timetable.end_time);
                for (let i = startIndex; i < endIndex; i++) {
                    matrix[i] = timetable;
                    if (i !== startIndex && matrix[i - 1] == matrix[i]) {
                        matrix[i - 1] = null;
                        break;
                    }
                }
            });

        return matrix;
    };

    const renderTableRows = (day) => {
        const matrix = createTimetableMatrix(day);
        return matrix.map((timetable, index) => (
            <tr
                key={index}
                className={
                    timetable && timetable.course.name === "Lunch Break"
                        ? "bg-yellow-100"
                        : ""
                }
            >
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-serif">
                    {timetable
                        ? `${timetable.course.name}-${timetable.lecturer.name}-${timetable.start_time}-${timetable.end_time}`
                        : ""}
                </td>
            </tr>
        ));
    };

    return (


        <Authenticated user={auth.user} permissions={auth.permissions}>
            <Head title="TimeTable" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <Link
                            href={route("timetables.index")}
                            className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Back
                        </Link>
                        
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Drop TimeTable
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <table className="min-w-full bg-white dark:bg-gray-800">
                                <thead>
                                    <tr className="border-b dark:border-gray-600">
                                        <th>Time</th>
                                        {daysOfWeek.map((day) => (
                                            <th key={day}>{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map((timeSlot, slotIndex) => (
                                        <tr key={timeSlot}>
                                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-serif">
                                                {timeSlot}
                                            </td>
                                            {daysOfWeek.map((day) => (
                                                <td
                                                    key={day}
                                                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-serif"
                                                >
                                                    {createTimetableMatrix(day)[
                                                        slotIndex
                                                    ] ? (
                                                        <PopOver
                                                            timeslot={
                                                                createTimetableMatrix(
                                                                    day
                                                                )[slotIndex]
                                                            }
                                                        />
                                                    ) : (
                                                        <PopOver
                                                            timeslot={null}
                                                        />
                                                    )}
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
