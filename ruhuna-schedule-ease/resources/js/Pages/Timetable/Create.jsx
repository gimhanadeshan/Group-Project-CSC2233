import Authenticated from '@/Layouts/AuthenticatedLayout'
import React from 'react'
import Select from 'react-select';
import { useState,useEffect } from 'react';
import { useForm,Head,usePage } from '@inertiajs/react'

export default function Create({auth,courses,lecturers}) {

  const courseOptions = courses.map((course) => ({ value: course, label: course.name }));
  const lecturerOptions = lecturers.map((lecturer) => ({ value: lecturer, label: lecturer.name }));
  return (
    <Authenticated
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create</h2>}
    >
        <Head title="TimeTable" />
        <div>
          <h1>TimeTable Create</h1>
          <form onSubmit={handleSubmit}>
          <h1>Select a Course</h1>
              <Select
                options={courseOptions}
                placeholder="Select a course..."
                isClearable
              />
              <Select
                options={lecturerOptions}
              placeholder="Select a lecturer..."
              isClearable
              />
            <button type="submit">Create TimeTable</button>
          </form>

        </div>
    </Authenticated>
  )
}
