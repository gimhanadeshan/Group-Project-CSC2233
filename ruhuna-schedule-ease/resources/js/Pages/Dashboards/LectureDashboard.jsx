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

            
            {/*Semester Details*/}
            <div className="pt-8 m-6 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Combined Semester Progress Chart and Course Details */}
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                        Welcome Your Semester !
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Chart */}
                        <div className="flex-1 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                                Semester Progress
                            </h3>
                            <div className="h-72 px-4 sm:px-6 lg:px-8">
                                <Bar
                                    data={combinedDurationData}
                                    options={combinedDurationOptions}
                                />
                            </div>
                        </div>

                        {/* Course Details */}
                        <div className="flex-1 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 mb-8">
                            {currentSemesters.length > 0 ? (
                                currentSemesters.map((semester) => (
                                    <div
                                        key={semester.id}
                                        className="mb-6 p-4 border rounded-lg shadow-sm dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                    >
                                        <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                                            <span className="mr-2 inline-block w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                                            Level {semester.level} - Semester{" "}
                                            {semester.semester} -{" "}
                                            {semester.academic_year} (
                                            {semester.degree_program.name})
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
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
                                                .length > 0 ? (
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
                                <div className="text-gray-500 dark:text-gray-400">
                                    No active semesters found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Events Section */}
            <div className="p-8 m-6 bg-gray-100 dark:bg-gray-900">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Events
                </h3>
                <DailyEvents allevents={events} now={now} />
                <UpcomingEvents allevents={events} now={now} />
            </div>
            {/* Weekly Timetable */}
            <div className="p-8 m-6 bg-gray-100 dark:bg-gray-900">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Weekly Timetable
                </h3>

                <WeeklyTimetable allevents={events} />
            </div>
        </AuthenticatedLayout>
    );
}
