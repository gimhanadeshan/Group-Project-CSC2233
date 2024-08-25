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
    console.log(semester);

    return (
        <Authenticated user={auth.user} permissions={auth.permissions}>
            <Head title="TimeTable" />
            <h1 className="text-2xl font-bold mb-4 text-center">
                Timetable of Level {semesterinfo.level} - Semester{" "}
                {semesterinfo.semester} - {semesterinfo.academic_year}
            </h1>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <Link
                            href={route("timetables.index")}
                            className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Back
                        </Link>
                        {auth.permissions.includes("update_timetable") && (
                            <Link
                                href={route("timetables.modify", {
                                    timetable: semester,
                                })}
                                className="ml-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                Modify
                            </Link>
                        )}
                        {auth.permissions.includes("create_timetable") && (
                            <>
                                <Link
                                    href={route("generateEvents", semester)}
                                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Generate Events
                                </Link>
                                <Link
                                    href={route(
                                        "events.generateAllAttendanceRecords"
                                    )}
                                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Generate Attendance Records
                                </Link>
                                {confirmation == 0 ? (
                                    <div>
                                        <button
                                            onClick={handleConfirm}
                                            className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            Confirm and Push
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-600">
                                        This TimeTable is already Confirmed
                                    </p>
                                )}
                            </>
                        )}
                        <button
                            onClick={handleDownloadPDF}
                            className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Download PDF
                        </button>

                        {auth.permissions.includes("delete_timetable") && (
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Drop TimeTable
                            </button>
                        )}
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
