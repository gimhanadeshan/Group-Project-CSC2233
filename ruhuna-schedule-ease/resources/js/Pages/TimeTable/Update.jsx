import React,{ useState } from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout';
import Select from 'react-select';
import { Head, Link, useForm } from '@inertiajs/react';
import ShowTimeTable from '@/Components/ShowTimeTable';

export default function Update({ auth, timetables, semester, lunchTime,semesterinfo, courses, lecturers, halls}) {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    const [selectedHall, setSelectedHall] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedStart, setSelectedStart] = useState("");
    const [selectedEnd, setSelectedEnd] = useState("");
    const [error, setError] = useState('');
    const [showTimeTable, setShowTimeTable] = useState(false);
    const [showTools, setShowTools] = useState(false);
    const { get: deleteItem } = useForm();
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const { data, setData, post, processing,errors } = useForm({
        timetable:
            {
                course: null,
                lecturer: null,
                hall: null,
                type: null,
                day: null,
                start_time: null,
                end_time: null,
            }
        ,
        semester_id: semester,
      });
      const handleDelete = (index) => {
        const id=timetables[index].slot_id;

        if (confirm("Are you sure you want to delete this TimeTable?")) {
            deleteItem(route("timetables.destroySingle", id));
        }
    };


    const toggleTimeTable = () => {
        setShowTimeTable(!showTimeTable);
      };
      const toggleTools = () => {
        setShowTools(!showTools);
      };

      const courseOptions = courses.map((course) => ({
        value: course,
        label: `${course.code} - ${course.name}`,
      }));
      const lecturerOptions = lecturers.map((lecturer) => ({
        value: lecturer,
        label: lecturer.name,
      }));

      const hallOptions = halls.map((hall) => ({
        value: hall,
        label: `Name: ${hall.name} - Capacity ${hall.capacity}`,
      }));

      const typeOptions = [
        selectedCourse?.value.theory_hours ? { value: 'Theory', label: 'Theory' } : null,
        selectedCourse?.value.practical_hours ? { value: 'Practical', label: 'Practical' } : null,
        selectedCourse?.value.tutorial_hours ? { value: 'Tutorial', label: 'Tutorial' } : null,
      ].filter(Boolean);


      const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCourse && selectedLecturer && selectedHall && selectedType) {
            const duplicateEntry = timetables.find(
              (entry) =>
                entry.course.id === selectedCourse.value.id &&
                entry.lecturer.id === selectedLecturer.value.id &&
                entry.hall.id === selectedHall.value.id &&
                entry.type === selectedType.value
            );

            if (duplicateEntry) {
              setError('This course, lecturer, and type combination has already been added.');
            } else {
              const newItem = { course: selectedCourse, lecturer: selectedLecturer, hall: selectedHall, type: selectedType , day: selectedDay, start_time: selectedStart, end_time: selectedEnd };
              setData('timetable', newItem);
              setSelectedCourse(null);
              setSelectedLecturer(null);
              setSelectedHall(null);
              setSelectedType(null);
              setError('');

              post(route("timetables.storeSingle"));
            }
          }
      };





      const renderErrors = () => {
        if (!Object.keys(errors).length) return null;

        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Whoops! Something went wrong.</strong>
                <ul className="mt-3 list-disc list-inside text-sm">
                    {Object.values(errors).map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </div>
        );
    };


  return (
    <Authenticated user={auth.user}>
        <Head title="TimeTable Modify" />
        <h1 className="text-2xl font-bold mb-4 text-center">
            Modify Timetable of Level {semesterinfo.level} - Semester {semesterinfo.semester} - {semesterinfo.academic_year}
        </h1>
        {renderErrors()}
        <div className="mb-4">
            <button type="button" onClick={toggleTimeTable} className="bg-yellow-600 text-white py-2 px-4 rounded-md inline-block mb-4 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
              Show Current TimeTable
            </button>
          </div>
          <div className="mb-4">
            <button type="button" onClick={toggleTools} className="bg-yellow-600 text-white py-2 px-4 rounded-md inline-block mb-4 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
              Show Tools
            </button>
          </div>
        {showTimeTable && (
            <ShowTimeTable lunchTime={lunchTime} semester={semester} semesterinfo={semesterinfo}  timetables={timetables}/>)
        }
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            { timetables.length > 0 && (
              <div>
                <h2 className="mb-3 text-xl font-semibold dark:text-gray-100">Currently in TimeTable</h2>
                <table className="min-w-full divide-y divide-white-700">
                  <thead className="bg-white-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-200 uppercase tracking-wider dark:text-gray-100">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-200 uppercase tracking-wider dark:text-gray-100">Lecturer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-200 uppercase tracking-wider dark:text-gray-100">Hall</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-200 uppercase tracking-wider dark:text-gray-100">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-200 uppercase tracking-wider dark:text-gray-100">Time Range</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-200 uppercase tracking-wider dark:text-gray-100">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white-900 divide-y divide-white-700">
                    {timetables.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white-100 dark:text-gray-100">{entry['course']['name']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white-100 dark:text-gray-100">{entry['lecturer']['name']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white-100 dark:text-gray-100">{entry['hall']['name']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white-100 dark:text-gray-100">{entry['type']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white-100 dark:text-gray-100">{entry['start_time']} - {entry['end_time']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white-100 dark:text-gray-100">
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-600 hover:text-red-700 focus:outline-none"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
        {showTools && (<form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <h2 className="form-label text-lg dark:text-gray-100">Select a Course</h2>
              <Select
                options={courseOptions}
                value={selectedCourse}
                onChange={setSelectedCourse}
                placeholder="Select a course..."
                isClearable
                className="basic-single"
                classNamePrefix="select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: 'white',
                    backgroundColor: 'gray',
                    color: 'white',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: 'blue',
                    },
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: 'white',
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: 'white',
                  }),
                }}
              />
            </div>
            {selectedCourse && typeOptions.length > 0 && (
              <div>
                <h2 className="form-label text-lg dark:text-gray-100">Select a Type</h2>
                <Select
                  options={typeOptions}
                  value={selectedType}
                  onChange={setSelectedType}
                  placeholder="Select a type..."
                  isClearable
                  className="basic-single"
                  classNamePrefix="select"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: 'white',
                      backgroundColor: 'gray',
                      color: 'white',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: 'blue',
                      },
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: 'white',
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: 'white',
                    }),
                  }}
                />
              </div>
            )}
            <div>
              <h2 className="form-label text-lg dark:text-gray-100">Select a Lecturer</h2>
              <Select
                options={lecturerOptions}
                value={selectedLecturer}
                onChange={setSelectedLecturer}
                placeholder="Select a lecturer..."
                isClearable
                className="basic-single"
                classNamePrefix="select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: 'white',
                    backgroundColor: 'gray',
                    color: 'white',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: 'blue',
                    },
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: 'white',
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: 'white',
                  }),
                }}
              />
            </div>
            <div>
              <h2 className="form-label text-lg dark:text-gray-100">Select a Hall</h2>
              <Select
                options={hallOptions}
                value={selectedHall}
                onChange={setSelectedHall}
                placeholder="Select a Hall..."
                isClearable
                className="basic-single"
                classNamePrefix="select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: 'white',
                    backgroundColor: 'gray',
                    color: 'white',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: 'blue',
                    },
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: 'white',
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: 'white',
                  }),
                }}
              />
            </div>
          </div>
          <div className="flex space-x-4 mb-2">
                <input
                type="time"
                value={selectedStart}
                onChange={(e) => setSelectedStart(e.target.value)}
                placeholder="Start Time"
                className="border rounded p-2 w-1/3"
                />

                <input
                  type="time"
                  value={selectedEnd}
                  onChange={(e) => setSelectedEnd(e.target.value)}
                  placeholder="End Time"
                  className="border rounded p-2 w-1/3"
                />
                <select
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="border rounded p-2 w-1/3"
                >
                  <option value="">Select Day</option>
                  {weekdays.map((day, idx) => (
                    <option key={idx} value={day}>{day}</option>
                  ))}
                </select>
              </div>
          {error && <div className="text-red-600 hover:text-red-700 focus:outline-none">{error}</div>}
            <div className="flex justify-end w-full">
              <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md inline-block mb-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500" disabled={processing}>
                Add to Table
              </button>
            </div>

        </form>)}

    </Authenticated>

  )
}
