import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Bar } from "react-chartjs-2";
import WeeklyTimetable from "@/Components/WeeklyTimetable";
import UpcomingEvents from "@/Components/UpcomingEvents";
import DailyEvents from "@/Components/DailyEvents";
import EventCalendar from "@/Components/EventCalendar";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

export default function Dashboard({
    auth,
    currentSemester,
    allevents,
    registeredCourses,
}) {
    const now = new Date();

    // Format dates for the new chart
    const startDate = new Date(currentSemester?.start_date);
    const endDate = new Date(currentSemester?.end_date);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysCompleted = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));

    const durationData = {
        labels: ["Semester Progress"],
        datasets: [
            {
                label: "Total Duration",
                data: [totalDays],
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
            {
                label: "Days Completed",
                data: [daysCompleted],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
            },
        ],
    };

    const durationOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Duration",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Days",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            {/* Main Container */}
            <div className="p-4 md:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Welcome Section */}
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            Welcome, {auth.user.name}!
                        </h3>
                    </div>

                    {/* Responsive Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Current Semester Details */}
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                            {currentSemester ? (
                                <>
                                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                        Current Semester Details
                                    </h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        <strong>Academic Year:</strong>{" "}
                                        {currentSemester.academic_year}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        <strong>Degree Program:</strong>{" "}
                                        {currentSemester.degree_program.name}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        <strong>Level:</strong>{" "}
                                        {currentSemester.level}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        <strong>Semester:</strong>{" "}
                                        {currentSemester.semester}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        <strong>Status:</strong>{" "}
                                        {currentSemester.status}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        <strong>Start Date:</strong>{" "}
                                        {currentSemester.start_date}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        <strong>End Date:</strong>{" "}
                                        {currentSemester.end_date}
                                    </p>
                                </>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">
                                    No current semester details available.
                                </p>
                            )}
                        </div>

                        {/* Semester Progress Chart */}
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                            <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                Semester Progress
                            </h4>
                            <Bar
                                data={durationData}
                                options={durationOptions}
                                className="h-72"
                            />
                        </div>
                    </div>

                    {/* Registered Courses */}
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Registered Courses
                        </h4>
                        {registeredCourses?.length > 0 ? (
                            <ul className="list-disc list-inside">
                                {registeredCourses.map((course) => (
                                    <li
                                        key={course.id}
                                        className="text-gray-800 dark:text-gray-200"
                                    >
                                        {course.code} - {course.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                No registered courses found.
                            </p>
                        )}
                    </div>

                    {/* Events Section */}
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Events
                        </h4>
                        {allevents?.length > 0 ? (
                            <>
                                <DailyEvents allevents={allevents} now={now} />
                                <UpcomingEvents
                                    allevents={allevents}
                                    now={now}
                                />
                            </>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                No events available.
                            </p>
                        )}
                    </div>

                    {/* Weekly Timetable */}
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Weekly Timetable
                        </h4>
                        {allevents?.length > 0 ? (
                            <WeeklyTimetable allevents={allevents} />
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                No timetable available.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
