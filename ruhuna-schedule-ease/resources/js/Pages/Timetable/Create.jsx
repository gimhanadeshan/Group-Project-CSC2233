import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';
import Select from 'react-select';
import { useForm, Head } from '@inertiajs/react';
import Popup from '@/Components/Popup';

export default function Create({ auth, courses, lecturers, halls, semester,semesterdetails }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [selectedHall, setSelectedHall] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [settings, setSettings] = useState({
    lunchTime: { start: '', end: '' },
    lectureTime: { start: '', end: '' },
    practicalTime: { start: '', end: '' },
    freeTimeslots: [{ start: '', end: '', day: '' }],
  });

  const { data, setData, post, processing,errors } = useForm({
    timetable: [],
    semester_id: semester,
    conditions: {
        lunchTime: { start: '', end: '' },
        lectureTime: { start: '', end: '' },
        practicalTime: { start: '', end: '' },
        freeTimeslots: [{ start: '', end: '', day: '' }],
      },
  });

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

  const handleAddToTable = (e) => {
    e.preventDefault();
    if (selectedCourse && selectedLecturer && selectedHall && selectedType) {
      const duplicateEntry = tableData.find(
        (entry) =>
          entry.course.value.id === selectedCourse.value.id &&
          entry.lecturer.value.id === selectedLecturer.value.id &&
          entry.hall.value.id === selectedHall.value.id &&
          entry.type.value === selectedType.value
      );

      if (duplicateEntry) {
        setError('This course, lecturer, and type combination has already been added.');
      } else {
        const newTableData = [
          ...tableData,
          { course: selectedCourse, lecturer: selectedLecturer, hall: selectedHall, type: selectedType },
        ];
        setTableData(newTableData);
        setData('timetable', newTableData);
        setSelectedCourse(null);
        setSelectedLecturer(null);
        setSelectedHall(null);
        setSelectedType(null);
        setError('');
      }
    }
  };

  const handleRemoveFromTable = (index) => {
    const newTableData = tableData.filter((_, i) => i !== index);
    setTableData(newTableData);
    setData('timetable', newTableData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tableData.length === 0) {
      setError('Please add at least one course, lecturer, hall, and type combination to the table.');
      return;
    }

    const confirmProceed = window.confirm('Are you sure you want to proceed with the selected courses, lecturers, and types?');
    if (confirmProceed) {
      post(route("timetables.store"));
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    setData('conditions', newSettings); // Update the conditions field in the form data
    setShowPopup(false);
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
      <Head title="TimeTable" />
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {renderErrors()}
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Create Time table for Level {semesterdetails.level} - Semester {semesterdetails.semester} - {semesterdetails.academic_year}</h1>
        <form onSubmit={handleSubmit}>
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
          {error && <div className="text-red-600 hover:text-red-700 focus:outline-none">{error}</div>}
          <div className="mb-4">
            <button onClick={handleAddToTable} className="bg-indigo-600 text-white py-2 px-4 rounded-md inline-block mb-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={processing}>
              Add to Table
            </button>
          </div>
          <div className="mb-4">
            <button type="button" onClick={togglePopup} className="bg-yellow-600 text-white py-2 px-4 rounded-md inline-block mb-4 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
              Advanced
            </button>
          </div>
          <div className="mt-4">
          {showPopup && <Popup closePopup={togglePopup} saveSettings={handleSaveSettings} initialSettings={settings} />}
            {tableData.length > 0 && (
              <div>
                <h2 className="mb-3 text-xl font-semibold dark:text-gray-100">Selected Courses, Lecturers, Halls, and Types</h2>
                <table className="min-w-full divide-y divide-white-700">
                  <thead className="bg-white-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-200 uppercase tracking-wider dark:text-gray-100">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-200 uppercase tracking-wider dark:text-gray-100">Lecturer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-200 uppercase tracking-wider dark:text-gray-100">Hall</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-200 uppercase tracking-wider dark:text-gray-100">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-200 uppercase tracking-wider dark:text-gray-100">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white-900 divide-y divide-white-700">
                    {tableData.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white-100 dark:text-gray-100">{entry.course.label}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white-100 dark:text-gray-100">{entry.lecturer.label}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white-100 dark:text-gray-100">{entry.hall.value.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white-100 dark:text-gray-100">{entry.type.label}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white-100 dark:text-gray-100">
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-700 focus:outline-none"
                            onClick={() => handleRemoveFromTable(index)}
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
            <div className="flex justify-end w-full">
              <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md inline-block mb-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500" disabled={processing}>
                Continue to Proceed
              </button>
            </div>
          </div>
        </form>
      </div>
    </Authenticated>
  );
}
