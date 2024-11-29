import React from "react";
import ShowTimeTable from "../../Components/ShowTimeTable";
import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function Show({
    auth,
    timetables,
    semester,
    lunchTime,
    semesterinfo,
    confirmation,
}) {
    const { delete: deleteTimeTable } = useForm();

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this TimeTable?")) {
            deleteTimeTable(route("timetables.destroy", semester));
        }
    };

    const handleDownloadPDF = () => {
        window.location.href = route("timetables.pdf", { semester });
    };

    const handleConfirm = () => {
        if (confirm("Are you sure you want to initialize this TimeTable?")) {
            window.location.href = route("timetables.confirm", {
                timetable: semester,
                semester: semester,
            });
        }
    };

    return (
        <Authenticated user={auth.user} permissions={auth.permissions}>
            <Head title="TimeTable" />
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Timetable of Level {semesterinfo.level} - Semester{" "}
                    {semesterinfo.semester} - {semesterinfo.academic_year} in{" "}
                    {semesterinfo.degree_program.name}
                </h1>

                {/* Button Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                    <Link
                        href={route("timetables.index")}
                        className="w-full flex justify-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Back
                    </Link>
                    {auth.permissions.includes("update_timetable") && (
                        <Link
                            href={route("timetables.modify", {
                                timetable: semester,
                            })}
                            className="w-full flex justify-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            Modify
                        </Link>
                    )}
                    {auth.permissions.includes("create_timetable") && (
                        <>
                            <Link
                                href={route("generateEvents", semester)}
                                className="w-full flex justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Generate Events
                            </Link>
                            <Link
                                href={route(
                                    "events.generateAllAttendanceRecords"
                                )}
                                className="w-full flex justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Generate Attendance Records
                            </Link>
                        </>
                    )}
                    <button
                        onClick={handleDownloadPDF}
                        className="w-full flex justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Download PDF
                    </button>
                    {auth.permissions.includes("delete_timetable") && (
                        <button
                            onClick={handleDelete}
                            className="w-full flex justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Drop TimeTable
                        </button>
                    )}
                </div>

                {/* Timetable Section */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                        <ShowTimeTable
                            lunchTime={lunchTime}
                            semester={semester}
                            semesterinfo={semesterinfo}
                            timetables={timetables}
                        />
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
