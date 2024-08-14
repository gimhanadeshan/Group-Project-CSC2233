import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Bar } from "react-chartjs-2";
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
    const [filter, setFilter] = useState("tomorrow"); // Add state for filter

    const now = new Date();

    // Filter daily events
    const dailyEvents = allevents.filter((event) => {
        const eventDate = new Date(event.start);
        return eventDate.toDateString() === now.toDateString();
    });

    // Filter upcoming events based on filter
    const filteredUpcomingEvents = allevents.filter((event) => {
        const eventDate = new Date(event.start);
        if (filter === "all") return eventDate > now;
        if (filter === "nextWeek") {
            const nextWeek = new Date();
            nextWeek.setDate(now.getDate() + 7);
            return eventDate > now && eventDate <= nextWeek;
        }
        if (filter === "tomorrow") {
            const tomorrow = new Date();
            tomorrow.setDate(now.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0); // Start of tomorrow
            const endOfTomorrow = new Date(tomorrow);
            endOfTomorrow.setHours(23, 59, 59, 999); // End of tomorrow
            return eventDate >= tomorrow && eventDate <= endOfTomorrow;
        }

        return false;
    });

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
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Student Dashboard
                </h2>
            }
            permissions={auth.permissions}
        >
            {/* Display current semester details */}
            {currentSemester ? (
                <div className="mb-8 p-6 border rounded-lg shadow-lg bg-white">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Current Semester Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-600">
                                <strong>Academic Year:</strong>{" "}
                                {currentSemester.academic_year}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Level:</strong> {currentSemester.level}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Semester:</strong>{" "}
                                {currentSemester.semester}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Status:</strong>{" "}
                                {currentSemester.status}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Start Date:</strong>{" "}
                                {currentSemester.start_date}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>End Date:</strong>{" "}
                                {currentSemester.end_date}
                            </p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                            <h4 className="text-lg font-semibold mb-2">
                                Semester Duration & Progress
                            </h4>
                            <div className="h-64">
                                <Bar
                                    data={durationData}
                                    options={durationOptions}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Display registered courses */}
                    {registeredCourses?.length > 0 ? (
                        <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-sm">
                            <h4 className="text-lg font-semibold mb-2">
                                Registered Courses
                            </h4>
                            <ul className="list-disc list-inside text-gray-700">
                                {registeredCourses.map((course) => (
                                    <li key={course.id}>
                                        {course.code} - {course.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-600">
                            No registered courses found for the current
                            semester.
                        </p>
                    )}
                </div>
            ) : (
                <p className="text-gray-600">No current semester found.</p>
            )}

            {/* Display daily events */}
            {dailyEvents.length > 0 && (
                <div className="mt-8 p-6 border rounded-lg shadow-lg bg-white">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Today's Events
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dailyEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-blue-100 p-4 rounded-lg shadow-md"
                            >
                                <h4 className="text-lg font-semibold text-blue-800">
                                    {event.event_title}
                                </h4>
                                <p className="text-sm text-blue-600">
                                    Time:{" "}
                                    {new Date(event.start).toLocaleTimeString()}
                                    - {new Date(event.end).toLocaleTimeString()}
                                </p>

                                <p className="text-sm text-blue-600">
                                    Location:{" "}
                                    {event.location || "Not specified"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Display upcoming events with filter buttons */}
            {filteredUpcomingEvents.length > 0 && (
                <div className="mt-8 p-6 border rounded-lg shadow-lg bg-white">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Upcoming Events
                    </h3>
                    <div className="mb-4 flex space-x-4">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-lg text-white ${
                                filter === "all"
                                    ? "bg-blue-500"
                                    : "bg-blue-300"
                            }`}
                        >
                            All Events
                        </button>
                        <button
                            onClick={() => setFilter("nextWeek")}
                            className={`px-4 py-2 rounded-lg text-white ${
                                filter === "nextWeek"
                                    ? "bg-gray-500"
                                    : "bg-gray-300"
                            }`}
                        >
                            Next Week
                        </button>
                        <button
                            onClick={() => setFilter("tomorrow")}
                            className={`px-4 py-2 rounded-lg text-white ${
                                filter === "tomorrow"
                                    ? "bg-yellow-500"
                                    : "bg-yellow-300"
                            }`}
                        >
                            Tomorrow
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUpcomingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-green-100 p-4 rounded-lg shadow-md"
                            >
                                <h4 className="text-lg font-semibold text-green-800">
                                    {event.event_title}
                                </h4>
                                <p className="text-sm text-green-600">
                                    Time:{" "}
                                    {new Date(event.start).toLocaleTimeString()}
                                    - {new Date(event.end).toLocaleTimeString()}
                                </p>
                                <p className="text-sm text-green-600">
                                    Location:{" "}
                                    {event.location || "Not specified"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
