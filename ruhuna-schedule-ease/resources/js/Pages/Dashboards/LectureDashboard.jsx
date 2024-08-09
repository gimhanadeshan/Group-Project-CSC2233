import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';


export default function Dashboard({ auth, allevents }) {
    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lecturer Dashboard</h2>}
            permissions={auth.permissions}
        >
            <Head title=" Lecturer Dashboard" />

            
        
           
        </AuthenticatedLayout>
    );
}
