import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const AttendancePage = ({ auth, eventId, studentId, attendance }) => {
    const [attended, setAttended] = useState(attendance?.attended || false);
    const courseType = attendance.course_type;

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.put(`/attendance/${courseType}/${eventId}/${studentId}/update`, {
            attended,
            courseType,
        });
    };

    const getCourseTypeName = (type) => {
        switch (type) {
            case 1:
                return 'Theory';
            case 2:
                return 'Tutorial';
            case 3:
                return 'Practical';
            default:
                return 'Unknown';
        }
    };

    return (
        <>
            <Head title="EventDetails" />
            <AuthenticatedLayout
                user={auth.user}
                //header={<h2 className="font-semibold text-2xl text-center text-gray-800 dark:text-gray-200 leading-tight">Update Attendance</h2>}
                permissions={auth.permissions}
            >
                <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="text-center">
                        <div className="mb-6">
                            <label htmlFor="course_type" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
                                Course Type
                            </label>
                            <input
                                type="text"
                                id="course_type"
                                name="course_type"
                                value={getCourseTypeName(courseType)}
                                readOnly
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-lg text-center text-gray-800 dark:text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="mb-6">
                            
                            <div className="flex justify-center items-center">
                                <input
                                    type="checkbox"
                                    id="attended"
                                    name="attended"
                                    checked={attended}
                                    onChange={(e) => setAttended(e.target.checked)}
                                    className="w-8 h-8 rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-indigo-500 focus:ring-indigo-500 transition-transform transform hover:scale-110"
                                />
                                <label htmlFor="attended" className="ml-2 text-lg text-gray-800 dark:text-gray-200">
                                    Mark as Attended
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-lg text-white rounded-md shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                        >
                            Update Attendance
                        </button>
                    </form>
                </div>
            </AuthenticatedLayout>
        </>
    );
};

export default AttendancePage;
