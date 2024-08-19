import React from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from '@inertiajs/react';

const AttendancePage = ({ auth, attendanceRecords }) => {
    const roleId = auth.user.role_id;
    const isStudent = roleId === 2;

    return (
        <>
            <Head title="Attendance" />
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-black leading-tight">Attendance</h2>}
                permissions={auth.permissions}
            >  
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold text-black mb-4">
                        {isStudent ? 'Student Attendance Records' : 'Lecturer Attendance Records'}
                    </h1>
                    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                        <thead>
                            <tr className="text-white">
                                <th className="py-2 px-4 border-b border-gray-700">Course Code</th>
                                <th className="py-2 px-4 border-b border-gray-700">Total Attended / Total Events</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.map((record, index) => {
                                const percentage = (record.total_attended / record.total_events) * 100;

                                return (
                                    <tr key={index} className="text-gray-300">
                                        <td className="py-2 px-4 border-b border-gray-700">{record.course_code}</td>
                                        <td className="py-2 px-4 border-b border-gray-700">
                                            <div className="flex items-center">
                                                <span className="mr-2">
                                                    {record.total_attended} / {record.total_events}
                                                </span>
                                                <div className="w-full bg-gray-700 rounded-full h-2">
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
