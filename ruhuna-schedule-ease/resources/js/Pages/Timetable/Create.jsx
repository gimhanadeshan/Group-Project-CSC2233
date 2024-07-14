import React from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from "@inertiajs/react";
import SearchInput from '@/Components/SearchInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({auth}) {
  return (
        <Authenticated
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">TimeTable</h2>}
        >
        <Head title="TimeTable" />
                <div>
                    <h1>H!</h1>
                    <SearchInput />
                   
                </div>
        </Authenticated>

  )
}
