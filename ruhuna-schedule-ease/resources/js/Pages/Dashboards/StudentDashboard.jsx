import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import EventCalendar from "@/Components/EventCalendar";
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

export default function Dashboard({ auth, currentSemester, allevents }) {
    const calendarStyles = {
        height: "400px",
        width: "400px",
    };

    // Format dates for the timeline chart
    const startDate = new Date(currentSemester?.start_date);
    const endDate = new Date(currentSemester?.end_date);

    const timelineData = {
        labels: [currentSemester?.academic_year + " Semester"],
        datasets: [
            {
                label: "Semester Duration",
                data: [
                    {
                        x: startDate,
                        x2: endDate,
                        y: currentSemester?.academic_year + " Semester",
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
                barPercentage: 1.0,
                categoryPercentage: 1.0,
            },
        ],
    };

    const timelineOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const start = new Date(context.raw.x);
                        const end = new Date(context.raw.x2);
                        return `${
                            context.dataset.label
                        }: ${start.toDateString()} - ${end.toDateString()}`;
                    },
                },
            },
        },
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "day",
                },
                title: {
                    display: true,
                    text: "Date",
                },
            },
            y: {
                type: "category",
                title: {
                    display: true,
                    text: "Semester",
                },
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
                                Semester Timeline
                            </h4>
                            <div className="h-64">
                                <Bar
                                    data={timelineData}
                                    options={timelineOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600">No current semester found.</p>
            )}

            <EventCalendar
                name={allevents}
                defaultView="day"
                views={["month", "day"]}
                style={calendarStyles}
            />

            <Head title="Dashboard" />
        </AuthenticatedLayout>
    );
}
