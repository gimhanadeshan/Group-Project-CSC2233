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
            {/* Display current semester details */}
            {currentSemester ? (
                <div className="p-8 m-6  dark:bg-gray-900 dark:text-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                        Welcome Your Semester !
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                                <strong className="text-gray-900 dark:text-gray-200">
                                    Academic Year:
                                </strong>{" "}
                                {currentSemester.academic_year}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                                <strong className="text-gray-900 dark:text-gray-200">
                                    Degree Program:
                                </strong>{" "}
                                {currentSemester.degree_program.name}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                                <strong className="text-gray-900 dark:text-gray-200">
                                    Level:
                                </strong>{" "}
                                {currentSemester.level}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                                <strong className="text-gray-900 dark:text-gray-200">
                                    Semester:
                                </strong>{" "}
                                {currentSemester.semester}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                                <strong className="text-gray-900 dark:text-gray-200">
                                    Status:
                                </strong>{" "}
                                {currentSemester.status}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                                <strong className="text-gray-900 dark:text-gray-200">
                                    Start Date:
                                </strong>{" "}
                                {currentSemester.start_date}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                                <strong className="text-gray-900 dark:text-gray-200">
                                    End Date:
                                </strong>{" "}
                                {currentSemester.end_date}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                                Semester Duration & Progress
                            </h4>
                            <div className="h-72">
                                <Bar
                                    data={durationData}
                                    options={durationOptions}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Display registered courses */}
                    {registeredCourses?.length > 0 ? (
                        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                                Registered Courses
                            </h4>
                            <ul className="list-disc list-inside text-gray-800 dark:text-gray-200">
                                {registeredCourses.map((course) => (
                                    <li key={course.id} className="mb-1">
                                        {course.code} - {course.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="mt-8 text-gray-600 dark:text-gray-400">
                            No registered courses found for the current
                            semester.
                        </p>
                    )}
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400">
                    No current semester found.
                </p>
            )}

            <div className="p-8 m-6 dark:bg-gray-900 dark:text-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Events
                </h3>
                {/* Display daily events */}
                <DailyEvents allevents={allevents} now={now} />

                {/* Display upcoming events with filter buttons */}
                <UpcomingEvents allevents={allevents} now={now} />
            </div>

            <div className="p-8 m-6 dark:bg-gray-900 dark:text-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Weekly Timetable
                </h3>
                {/* Weekly Timetable */}
                <WeeklyTimetable allevents={allevents} />
                {/* <EventCalendar eventlist={allevents} defaultView="week" height="800px" views={['week']} /> */}
            </div>
        </AuthenticatedLayout>
    );
}
