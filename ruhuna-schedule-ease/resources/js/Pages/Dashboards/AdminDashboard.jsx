import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';



export default function Dashboard({ auth, allevents }) {
   
    

    return (

        <><Head title="Admin Dashboard" />
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            

            
        </AuthenticatedLayout>
        </>
    );
}
