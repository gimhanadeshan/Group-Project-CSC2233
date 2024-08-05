import Authenticated from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ShowTimeTable({ auth, timetables, semester, lunchTime }) {
    const { data, setData, delete: deleteTimeTable } = useForm();

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this TimeTable?")) {
            deleteTimeTable(route("timetables.destroy", semester));
        }
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const renderTableRows = (day) => {
        const lunchBreak = {
            start_time: lunchTime.start,
            end_time: lunchTime.end,
            course: { name: 'Lunch Break' },
            type: '-',
            hall: { name: '-' },
            lecturer: { name: '-' },
        };

        const dayTimetables = timetables
            .filter((timetable) => timetable.day_of_week === day)
            .concat(lunchBreak)
            .sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)));

        return dayTimetables.map((timetable, index) => (
            <tr
                key={index}
                className={timetable.course.name === 'Lunch Break' ? 'bg-yellow-200' : 'border-b dark:border-gray-600'}
            >
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-serif">{timetable.start_time}</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-serif">{timetable.end_time}</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-serif">{timetable.course.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-serif">{timetable.type}</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-serif">{timetable.hall.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-serif">{timetable.lecturer.name}</td>
            </tr>
        ));
    };

    return (
        <Authenticated user={auth.user}>
            <Head title="TimeTable" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <Link
                            href={route('timetables.index')}
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
                            {daysOfWeek.map((day) => (
                                <div key={day} className="mb-4">
                                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 font-serif">{day}</h3>
                                    <table className="min-w-full bg-white dark:bg-gray-800">
                                        <thead>
                                            <tr className="border-b dark:border-gray-600">
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 font-serif">Start Time</th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 font-serif">End Time</th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 font-serif">Course</th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 font-serif">Type</th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 font-serif">Hall</th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 font-serif">Lecturer</th>
                                            </tr>
                                        </thead>
                                        <tbody>{renderTableRows(day)}</tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
