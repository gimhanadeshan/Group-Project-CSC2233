import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import WeeklyTimetable from "@/Components/WeeklyTimetable";
import UpcomingEvents from "@/Components/UpcomingEvents";
import DailyEvents from "@/Components/DailyEvents";

export default function LecturerDashboard({
    auth,
    currentSemester,
    lecturerCourses,
    timetable,
    events,
}) {

    const now = new Date();
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Lecturer Dashboard
                </h2>
            }
            permissions={auth.permissions}
        >
            <Head title="Lecturer Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Current Semester Details */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Current Semester
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                {currentSemester ? (
                                    <>
                                        {currentSemester.name} (
                                        {currentSemester.start_date} -{" "}
                                        {currentSemester.end_date})
                                    </>
                                ) : (
                                    <span>No active semester found.</span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Lecturer's Courses */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Your Courses
                            </h3>
                            <ul className="mt-2 space-y-2">
                                {lecturerCourses.length > 0 ? (
                                    lecturerCourses.map((course) => (
                                        <li
                                            key={course.id}
                                            className="text-gray-700"
                                        >
                                            {course.code} - {course.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">
                                        No courses found.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Timetable */}

                    {/* Events */}
                    <div className="p-6 ">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                            Events
                        </h3>
                        {/* Display daily events */}
                        <DailyEvents allevents={events} now={now} />

                        {/* Display upcoming events with filter buttons */}
                        <UpcomingEvents allevents={events} now={now} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
