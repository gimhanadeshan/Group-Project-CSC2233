import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';
import Select from 'react-select';
import { useForm, Head, Link } from '@inertiajs/react';

export default function Index({ auth, semestersInTimeTable, semestersNotInTimeTable}) {
  const [selectedSemesterIN, setSelectedSemesterIn] = useState(null);
  const [selectedSemesterNotIn, setSelectedSemesterNotIn] = useState(null);
  const semesterInOptions = semestersInTimeTable.map((semester) => ({
    value: semester,
    label: `Level ${semester.level} - Semester ${semester.semester} - ${semester.academic_year}`
  }));
  const semesterNotInOptions = semestersNotInTimeTable.map((semester) => ({
    value: semester,
    label: `Level ${semester.level} - Semester ${semester.semester} - ${semester.academic_year}`
  }));

  return (
    <Authenticated user={auth.user} permissions={auth.permissions}>
      <Head title="TimeTable" />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between gap-6">
          {/* Create TimeTable Form */}
          <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
              Create a TimeTable
            </h2>
            <div className="mb-6">
              <Select
                options={semesterNotInOptions}
                onChange={setSelectedSemesterNotIn}
                placeholder="Select or search a semester..."
                isClearable
                className="basic-single"
                classNamePrefix="select"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: '#c7d2fe', // light blue for light mode
                    primary: '#4f46e5', // indigo for light mode
                    neutral0: theme.colors.neutral0 === '#fff' ? '#1f2937' : theme.colors.neutral0, // dark bg
                    neutral80: theme.colors.neutral80 === '#333' ? '#e5e7eb' : theme.colors.neutral80 // light text for dark mode
                  }
                })}
              />
            </div>
            <div className="flex justify-center">
              {selectedSemesterNotIn && (
               <div className="flex flex-col md:flex-row gap-4">
               <Link
                 href={route('timetables.create', {
                   level: selectedSemesterNotIn.value.level,
                   semester: selectedSemesterNotIn.value.semester,
                   semester_id: selectedSemesterNotIn.value.id,
                 })}
                 className="bg-indigo-600 text-white py-2 px-4 rounded-md mb-4 md:mb-0 md:mr-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               >
                 Create Automatically
               </Link>
               <Link
                 href={route('timetables.modify', { timetable: selectedSemesterNotIn.value.id })}
                 className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               >
                 Create Manually
               </Link>
             </div>

              )}
            </div>
          </div>

          {/* View TimeTable Form */}
          <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
              View a TimeTable
            </h2>
            <div className="mb-6">
              <Select
                options={semesterInOptions}
                onChange={setSelectedSemesterIn}
                placeholder="Select or search a semester..."
                isClearable
                className="basic-single"
                classNamePrefix="select"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: '#c7d2fe', // light blue for light mode
                    primary: '#4f46e5', // indigo for light mode
                    neutral0: theme.colors.neutral0 === '#fff' ? '#1f2937' : theme.colors.neutral0, // dark bg
                    neutral80: theme.colors.neutral80 === '#333' ? '#e5e7eb' : theme.colors.neutral80 // light text for dark mode
                  }
                })}
              />
            </div>
            <div className="flex justify-center">
              {selectedSemesterIN && (
                <Link
                  href={route('timetables.show', {
                    timetable: selectedSemesterIN.value.id
                  })}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  View
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
