import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';




export default function Dashboard({ auth, allevents }) {
    
    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Student Dashboard</h2>}
        >
            <Head title="Student Dashboard" />

           
        </AuthenticatedLayout>
    );
}
