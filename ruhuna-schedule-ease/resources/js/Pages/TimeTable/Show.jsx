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

    return (
    <Authenticated user={auth.user} permissions={auth.permissions}>
            <Head title="TimeTable" />
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
            </div>
        </Authenticated>
  )
}
