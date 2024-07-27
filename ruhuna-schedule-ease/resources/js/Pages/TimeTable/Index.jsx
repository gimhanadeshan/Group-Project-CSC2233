import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';
import Select from 'react-select';
import { useForm, Head, Link } from '@inertiajs/react';

export default function Index({ auth, semestersInTimeTable, semestersNotInTimeTable }) {
  const [selectedSemesterIN, setSelectedSemesterIn] = useState(null);
  const [selectedSemesterNotIn, setSelectedSemesterNotIn] = useState(null);
  const semesterInOptions = semestersInTimeTable.map((semester) => ({
    value: semester,
    label: `Level ${semester.level} - Semester ${semester.semester}`
  }));
  const semesterNotInOptions = semestersNotInTimeTable.map((semester) => ({
    value: semester,
    label: `Level ${semester.level} - Semester ${semester.semester}`
  }));

  return (
    <Authenticated
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Manage TimeTables</h2>}
    >
      <Head title="TimeTable" />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between gap-6">
          {/* Create TimeTable Form */}
          <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Create a TimeTable</h2>
            <div className="mb-6">
              <Select
                options={semesterNotInOptions}
                onChange={setSelectedSemesterNotIn}
                placeholder="Select or search a semester..."
                isClearable
                className="basic-single"
                classNamePrefix="select"
              />
            </div>
            <div className="flex justify-center">
              {selectedSemesterNotIn && (
                <Link
                  href={route('timetables.create', {
                    level: selectedSemesterNotIn.value.level,
                    semester: selectedSemesterNotIn.value.semester
                  })}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Create
                </Link>
              )}
            </div>
          </div>

          {/* View TimeTable Form */}
          <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">View a TimeTable</h2>
            <div className="mb-6">
              <Select
                options={semesterInOptions}
                onChange={setSelectedSemesterIn}
                placeholder="Select or search a semester..."
                isClearable
                className="basic-single"
                classNamePrefix="select"
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
