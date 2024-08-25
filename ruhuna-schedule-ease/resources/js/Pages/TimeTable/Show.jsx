import React from 'react'
import ShowTimeTable from '../../Components/ShowTimeTable';
import { Head, Link, useForm } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, timetables, semester, lunchTime,semesterinfo}) {
    const { delete: deleteTimeTable } = useForm();
    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this TimeTable?")) {
            deleteTimeTable(route("timetables.destroy", semester));
        }
    };
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes

    return (
    <Authenticated user={auth.user} permissions={auth.permissions}>
            <Head title="TimeTable" />
<<<<<<< Updated upstream
            <h1 className="text-2xl font-bold mb-4 text-center">
                    Timetable of Level {semesterinfo.level} - Semester {semesterinfo.semester} - {semesterinfo.academic_year}
                </h1>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <Link
                            href={route('timetables.index')}
                            className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Back
                        </Link>
                        <Link
                            href={route('timetables.modify', { timetable: semester })}
                            className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Modify
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Drop TimeTable
                        </button>
                    </div>


                    <ShowTimeTable lunchTime={lunchTime} semester={semester} semesterinfo={semesterinfo}  timetables={timetables}/>



                    </div>
=======
            <h1 className="text-3xl font-bold mb-6 text-center">
                Timetable of Level {semesterinfo.level} - Semester{" "}
                {semesterinfo.semester} - {semesterinfo.academic_year} for {semesterinfo.degree_program.name}
            </h1>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Grid Layout for Buttons */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* General Actions */}
                        <div className="flex flex-col items-center space-y-4">
                            <Link
                                href={route("timetables.index")}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                            >
                                Back
                            </Link>
                            <button
                                onClick={handleDownloadPDF}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                            >
                                Download PDF
                            </button>
                        </div>

                        {/* Creation Actions */}
                        {auth.permissions.includes("create_timetable") && (
                            <div className="flex flex-col items-center space-y-4">
                                <Link
                                    href={route("generateEvents", semester)}
                                    className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                                >
                                    Generate Events
                                </Link>
                                <Link
                                    href={route("events.generateAllAttendanceRecords")}
                                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
                                >
                                    Generate Attendance Records
                                </Link>
                                {confirmation === 0 && (
                                    <button
                                        onClick={handleConfirm}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                    >
                                        Confirm and Push
                                    </button>
                                )}
                                {confirmation === 1 && (
                                    <p className="text-center text-gray-600 mt-3">
                                        This TimeTable is already Confirmed
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Sensitive Actions */}
                        {auth.permissions.includes("update_timetable") && (
                            <div className="flex flex-col items-center space-y-4">
                                <Link
                                    href={route("timetables.modify", { timetable: semester })}
                                    className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                                >
                                    Modify
                                </Link>
                            </div>
                        )}
                        {auth.permissions.includes("delete_timetable") && (
                            <div className="flex flex-col items-center space-y-4">
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                                >
                                    Drop TimeTable
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Show TimeTable Component */}
                    <ShowTimeTable
                        lunchTime={lunchTime}
                        semester={semester}
                        semesterinfo={semesterinfo}
                        timetables={timetables}
                    />
                </div>
>>>>>>> Stashed changes
            </div>
        </Authenticated>
  )
}
