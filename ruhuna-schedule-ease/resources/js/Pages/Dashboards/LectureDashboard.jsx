import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Bar } from "react-chartjs-2";
import WeeklyTimetable from "@/Components/WeeklyTimetable";
import UpcomingEvents from "@/Components/UpcomingEvents";
import DailyEvents from "@/Components/DailyEvents";

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

export default function LecturerDashboard({
    auth,
    currentSemesters,
    lecturerCourses,
    events,
}) {
    const now = new Date();

    // Combine semester data for the chart
    const combinedDurationData = {
        labels: currentSemesters.map(
            (semester) =>
                `Level ${semester.level} - Semester ${semester.semester} (${semester.academic_year})`
        ),
        datasets: [
            {
                label: "Total Duration (Days)",
                data: currentSemesters.map((semester) => {
                    const startDate = new Date(semester.start_date);
                    const endDate = new Date(semester.end_date);
                    return Math.ceil(
                        (endDate - startDate) / (1000 * 60 * 60 * 24)
                    );
                }),
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
            {
                label: "Days Completed",
                data: currentSemesters.map((semester) => {
                    const startDate = new Date(semester.start_date);
                    return Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));
                }),
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
            },
        ],
    };

    const combinedDurationOptions = {
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
                    text: "Semester",
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

    // Group courses by semester
    const coursesBySemester = currentSemesters.reduce((acc, semester) => {
        acc[semester.id] = lecturerCourses.filter(
            (course) => course.semester_id === semester.id
        );
        return acc;
    }, {});

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Lecturer Dashboard" />

            {/* Main Content */}
            <div className="p-4  sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Welcome Message */}
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Welcome, {auth.user.name}!
                    </h3>

                    {/* Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Semester Progress Chart */}
                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                                Semester Progress
                            </h3>
                            <Bar
                                data={combinedDurationData}
                                options={combinedDurationOptions}
                                className="h-72"
                            />
                        </div>

                        {/* Semester Details */}
                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            {currentSemesters.length > 0 ? (
                                currentSemesters.map((semester) => (
                                    <div
                                        key={semester.id}
                                        className="mb-6 p-4 border rounded-lg shadow-sm dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                    >
                                        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                                            Level {semester.level} - Semester{" "}
                                            {semester.semester} -{" "}
                                            {semester.academic_year} (
                                            {semester.degree_program.name})
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                                            Status:{" "}
                                            <span
                                                className={`font-semibold ${
                                                    semester.status === "Active"
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-red-600 dark:text-red-400"
                                                }`}
                                            >
                                                {semester.status}
                                            </span>
                                        </p>
                                        <ul className="list-disc list-inside text-gray-800 dark:text-gray-100">
                                            {coursesBySemester[semester.id]
                                                ?.length > 0 ? (
                                                coursesBySemester[
                                                    semester.id
                                                ].map((course) => (
                                                    <li
                                                        key={course.id}
                                                        className="mb-1"
                                                    >
                                                        {course.code} -{" "}
                                                        {course.name}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-gray-500 dark:text-gray-400">
                                                    No courses available.
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">
                                    No active semesters found.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Events Section */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Events
                        </h3>
                        {events.length > 0 ? (
                            <>
                                <DailyEvents allevents={events} now={now} />
                                <UpcomingEvents allevents={events} now={now} />
                            </>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                No events available.
                            </p>
                        )}
                    </div>

                    {/* Weekly Timetable */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Weekly Timetable
                        </h3>
                        {events.length > 0 ? (
                            <WeeklyTimetable allevents={events} />
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
