import React,{ useState } from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout';
import Select from 'react-select';
import { Head, Link, useForm } from '@inertiajs/react';
import ShowTimeTable from '@/Components/ShowTimeTable';

export default function Update({ auth, timetables, semester, lunchTime,semesterinfo, courses, lecturers, halls}) {
    const [startTime, setStartTime] = useState(lunchTime.start);
    const [endTime, setEndTime] = useState(lunchTime.end);
    const [error, setError] = useState('');
    const [showTimeTable, setShowTimeTable] = useState(false);
    const [showTools, setShowTools] = useState(false);
    const [timetableName, setTimetableName] = useState("Show TimeTable");
    const [toolName, setToolName] = useState("Show Tools");
    const { get: deleteItem } = useForm();
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const { data, setData, post, processing,errors } = useForm({
                course: [],
                lecturer: [],
                hall: [],
                type: "",
                day: "",
                start_time: "",
                end_time: "",
                semester_id: semester,
    });
    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };
    const updateInterval = () => {
        console.log(startTime, endTime);
        route("timetables.updateInterval", {interval_start: startTime, interval_end: endTime ,semester_id: semester});
    };
      const handleDelete = (index) => {
        const id=timetables[index].slot_id;

        if (confirm("Are you sure you want to delete this TimeTable?")) {
            deleteItem(route("timetables.destroySingle", id));
        }
    };
    const toggleTimeTable = () => {
        setShowTimeTable(!showTimeTable);
        if(showTimeTable){
            setTimetableName("Show TimeTable");
        }else{
            setTimetableName("Hide TimeTable");
        }
      };
      const toggleTools = () => {
        setShowTools(!showTools);
        if(showTools){
            setToolName("Show Tools");
        }else{
            setToolName("Hide Tools");
        }
      };

      const courseOptions = courses.map((course) => ({
        value: course,
        label: `${course.code} - ${course.name}`,
      }));
      console.log(courseOptions);
      const lecturerOptions = lecturers.map((lecturer) => ({
        value: lecturer,
        label: lecturer.name,
      }));

      const hallOptions = halls.map((hall) => ({
        value: hall,
        label: `Name: ${hall.name} - Capacity ${hall.capacity}`,
      }));

      const typeOptions = [
        data.course?.theory_hours ? { value: 'Theory', label: 'Theory' } : null,
        data.course?.practical_hours ? { value: 'Practical', label: 'Practical' } : null,
        data.course?.tutorial_hours ? { value: 'Tutorial', label: 'Tutorial' } : null,
      ].filter(Boolean);


      const handleSubmit = (e) => {
        console.log(data);
        e.preventDefault();
        if (data.course && data.lecturer && data.hall && data.type && data.end_time && data.start_time && data.day) {
            const duplicateEntry = timetables.find(
              (entry) =>
                entry.course.id === data.course.id &&
                entry.lecturer.id === data.lecturer.id &&
                entry.hall.id === data.hall.id &&
                entry.type === data.typevalue &&
                entry.day_of_week === data.day &&
                entry.start_time === data.start_time &&
                entry.end_time === `${data.end_time}:00`
            );

            if (duplicateEntry) {
              setError('This course, lecturer, and type combination has already been added.');
            } else {
                post(route("timetables.storeSingle"), {
                    onSuccess: () => {
                        // Reset form data after successful submission
                        setData({
                            course: [],
                            lecturer: [],
                            hall: [],
                            type: "",
                            day: "",
                            start_time: "",
                            end_time: "",
                            semester_id: semester,
                        });
                    }
                });

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
        <div className="flex justify-between mb-4">
  <button
    type="button"
    onClick={toggleTimeTable}
    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {timetableName}
  </button>
  <button
    type="button"
    onClick={toggleTools}
    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    {toolName}
  </button>
</div>


        {showTimeTable && (
            <ShowTimeTable lunchTime={lunchTime} semester={semester} semesterinfo={semesterinfo}  timetables={timetables}/>)
        }
        <div className="max-w-5xl my-5 mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-200 uppercase tracking-wider dark:text-gray-100">Day</th>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white-100 dark:text-gray-100">{entry['day_of_week']}</td>
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
        {showTools && (
    <div className="max-w-5xl my-5 mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    {/* Main Form Section */}
    <div className="mb-8">
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <h2 className="form-label text-lg dark:text-gray-100 mb-2">Select a Course</h2>
                    <Select
                        id="course"
                        options={courseOptions}
                        value={data.course.value}
                        onChange={(e) => { setData('course', e.value); console.log(data.course); }}
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
                {data.course.id && typeOptions.length > 0 && (
                    <div>
                        <h2 className="form-label text-lg dark:text-gray-100 mb-2">Select a Type</h2>
                        <Select
                            options={typeOptions}
                            value={data.type.value}
                            onChange={(e) => { setData('type', e.value); }}
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
                    <h2 className="form-label text-lg dark:text-gray-100 mb-2">Select a Lecturer</h2>
                    <Select
                        options={lecturerOptions}
                        value={data.lecturer.value}
                        onChange={(e) => { setData('lecturer', e.value); }}
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
                    <h2 className="form-label text-lg dark:text-gray-100 mb-2">Select a Hall</h2>
                    <Select
                        options={hallOptions}
                        value={data.hall.value}
                        onChange={(e) => { setData('hall', e.value); }}
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
                    <h2 className="text-lg text-red-600 dark:text-red-400 mb-2">
                        Practical Hours: {data.course.practical_hours}
                    </h2>
                    <h2 className="text-lg text-red-600 dark:text-red-400 mb-2">
                        Theory Hours: {data.course.theory_hours}
                    </h2>
                    <h2 className="text-lg text-red-600 dark:text-red-400 mb-2">
                        Tutorial Hours: {data.course.tutorial_hours}
                    </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <h2 className="form-label text-lg dark:text-gray-100 mb-2">Start Time</h2>
                    <input
                        type="time"
                        value={data.start_time}
                        onChange={(e) => { setData('start_time', e.target.value); }}
                        placeholder="Start Time"
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <h2 className="form-label text-lg dark:text-gray-100 mb-2">End Time</h2>
                    <input
                        type="time"
                        value={data.end_time}
                        onChange={(e) => { setData('end_time', e.target.value); }}
                        placeholder="End Time"
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div>
                    <h2 className="form-label text-lg dark:text-gray-100 mb-2">Select Day</h2>
                    <select
                        onChange={(e) => { setData('day', e.target.value); }}
                        className="border rounded p-2 w-full"
                        value={data.day}
                    >
                        <option value="">Select Day</option>
                        {weekdays.map((day, idx) => (
                            <option key={idx} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={processing}
                >
                    Add to Table
                </button>
            </div>
        </form>
    </div>

    {/* Lunchtime Interval Section */}
    <div className="mt-8">
        <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
                <h2 className="form-label text-lg dark:text-gray-100 mb-2">Start Interval</h2>
                <input
                    type="time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    placeholder="Start Time"
                    className="border rounded p-2 w-full"
                />
            </div>
            <div>
                <h2 className="form-label text-lg dark:text-gray-100 mb-2">End Interval</h2>
                <input
                    type="time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    placeholder="End Time"
                    className="border rounded p-2 w-full"
                />
            </div>
            <div className="flex items-end">
                <Link
                    href={route('timetables.updateInterval', { lunchtime_start: startTime, lunchtime_end: endTime, semester_id: semester })}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full text-center"
                    disabled={processing}
                >
                    Update Interval
                </Link>
            </div>
        </div>
    </div>
</div>

)}



    </Authenticated>

  )
}
