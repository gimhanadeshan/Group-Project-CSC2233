import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Head, Link  } from '@inertiajs/react';

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const AttendancePage = ({auth, eventId, studentId, attendance }) => {
    const [attended, setAttended] = useState(attendance?.attended || false);

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post(`/attendance/${eventId}/${studentId}`, {
            attended,
        });
    };

    return (
        
        <>
        <Head title="EventDetails" />
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">EventDetails</h2>}
            permissions={auth.permissions}
        >   


        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="attended" className="block text-sm font-medium text-gray-700">Attended</label>
                    <input
                        type="checkbox"
                        id="attended"
                        name="attended"
                        checked={attended}
                        onChange={(e) => setAttended(e.target.checked)}
                        className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md">Update Attendance</button>
            </form>
        
        </div>
        </AuthenticatedLayout>
        </>
    );
};

export default AttendancePage;
