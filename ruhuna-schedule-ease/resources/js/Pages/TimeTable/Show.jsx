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
            <h1 className="text-2xl font-bold mb-4 text-center">
                Timetable of Level {semesterinfo.level} - Semester{" "}
                {semesterinfo.semester} - {semesterinfo.academic_year}
            </h1>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Grid layout for buttons with 2 columns and 3 rows */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Row 1 */}
                        <div className="flex justify-center items-center">
                            <Link
                                href={route("timetables.index")}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Back
                            </Link>
                        </div>
                        <div className="flex justify-center items-center">
                            {auth.permissions.includes("update_timetable") && (
                                <Link
                                    href={route("timetables.modify", {
                                        timetable: semester,
                                    })}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    Modify
                                </Link>
                            )}
                        </div>

                        {/* Row 2 */}
                        <div className="flex justify-center items-center">
                            {auth.permissions.includes("create_timetable") && (
                                <>
                                    <Link
                                        href={route("generateEvents", semester)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Generate Events
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className="flex justify-center items-center">
                            {auth.permissions.includes("create_timetable") && (
                                <>
                                    <Link
                                        href={route("events.generateAllAttendanceRecords")}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Generate Attendance Records
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Row 3 */}
                        <div className="flex justify-center items-center">
                            <button
                                onClick={handleDownloadPDF}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Download PDF
                            </button>
                        </div>
                        <div className="flex justify-center items-center">
                            {auth.permissions.includes("delete_timetable") && (
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Drop TimeTable
                                </button>
                            )}
                        </div>
                    </div>

                    <ShowTimeTable
                        lunchTime={lunchTime}
                        semester={semester}
                        semesterinfo={semesterinfo}
                        timetables={timetables}
                    />
                </div>
            </div>
        </Authenticated>
    );
}
