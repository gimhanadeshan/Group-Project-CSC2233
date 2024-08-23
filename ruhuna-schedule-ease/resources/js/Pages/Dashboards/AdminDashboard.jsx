import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

export default function AdminDashboard({
    auth,
    roleCounts,
    inProgressSemesters,
}) {
    // Data for the charts
    const labels = inProgressSemesters.map(
        (semester) => `Level ${semester.level} - Semester ${semester.semester}`
    );
    const studentData = inProgressSemesters.map(
        (semester) => semester.student_count
    );
    const lecturerData = inProgressSemesters.map(
        (semester) => semester.lecturer_count
    );

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Number of Students",
                data: studentData,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
            {
                label: "Number of Lecturers",
                data: lecturerData,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || "";
                        const value = context.raw;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value;
                    },
                },
            },
        },
    };

    // Helper function to calculate the progress percentage
    const calculateProgress = (startDate, endDate) => {
        const currentDate = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalDuration = end - start;
        const elapsedDuration = currentDate - start;
        const progress = Math.min((elapsedDuration / totalDuration) * 100, 100); // Cap at 100%
        return progress;
    };

    return (
        <>
            <Head title="Admin Dashboard" />
            <AuthenticatedLayout
                user={auth.user}
                // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
                permissions={auth.permissions}
            >
                <div className="py-6">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-6">
                        {/* Additional Section for Role Count Cards */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm ">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
                                Welcome, {auth.user.name}!
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {roleCounts.map((role) => (
                                    <div
                                        key={role.id}
                                        className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-md flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
                                                <span className="text-lg font-bold">
                                                    {role.name[0]}
                                                </span>{" "}
                                                {/* Initial letter or icon */}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                                    {role.name}
                                                </h4>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    Number of Users
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                            {role.users_count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 mb-8 mt-8">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
                                In Progress Semesters
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col space-y-6">
                                    {inProgressSemesters.length > 0 ? (
                                        <>
                                            {inProgressSemesters.map((semester) => {
                                                const progress = calculateProgress(semester.start_date, semester.end_date);
                                                return (
                                                    <div
                                                        key={semester.id}
                                                        className="flex flex-col p-4 border rounded-lg shadow-sm dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                                    >
                                                        <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                                                            Level {semester.level} - Semester {semester.semester} - {semester.academic_year}
                                                        </h4>
                                                        <p className="text-gray-600 dark:text-gray-400">
                                                            Degree Program: {semester.degree_program}
                                                        </p>
                                                        <div className="mt-4">
                                                            {/* <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                                Progress:
                                                            </p> */}
                                                            <div className="relative pt-1">
                                                                <div className="flex mb-2 items-center justify-between">
                                                                    <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-teal-600 bg-teal-200 dark:bg-teal-800 dark:text-teal-200">
                                                                        {progress.toFixed(2)}%
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                                                                        <div
                                                                            className="bg-teal-500 text-xs font-medium text-teal-100 text-center p-0.5 leading-none rounded-full"
                                                                            style={{ width: `${progress}%` }}
                                                                        >
                                                                            &nbsp;
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <div className="text-gray-500 dark:text-gray-400">
                                            No in-progress semesters found.
                                        </div>
                                    )}
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                                        Student and Lecturer Counts
                                    </h3>
                                    <Bar data={data} options={options} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
