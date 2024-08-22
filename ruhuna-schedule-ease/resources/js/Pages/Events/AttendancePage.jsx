import React from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from '@inertiajs/react';

const AttendancePage = ({ auth, attendanceRecords }) => {
    const roleId = auth.user.role_id;
    const isStudent = roleId === 2;

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
            <Head title="Attendance" />
            <AuthenticatedLayout
                user={auth.user}
                // header={
                //     <h2 className="font-semibold text-3xl text-gray-800 dark:text-gray-800 leading-tight text-center">
                //         Attendance
                //     </h2>
                // }
                permissions={auth.permissions}
            >
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-800 mb-6 text-center">
                        {isStudent ? 'Student Attendance Records' : 'Lecturer Progress'}
                    </h1>
                    <table className="min-w-28 mx-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                        <thead>
                            <tr className="text-gray-700 dark:text-gray-300">
                                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-700 text-lg">
                                    Course Code
                                </th>
                                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-700 text-lg">
                                    Course Type
                                </th>
                                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-700 text-lg">
                                   Progress
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.map((record, index) => {
                                const percentage = (record.total_attended / record.total_events) * 100;

                                return (
                                    <tr key={index} className="text-gray-800 dark:text-gray-300">
                                        <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-700">
                                            {record.course_code}
                                        </td>
                                        <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-700">
                                            {getCourseTypeName(record.course_type)}
                                        </td>
                                        <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-700">
                                            <div className="flex items-center">
                                                <span className="mr-2">
                                                    {record.total_attended} / {record.total_events}
                                                </span>
                                                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </AuthenticatedLayout>
        </>
    );
};

export default AttendancePage;
