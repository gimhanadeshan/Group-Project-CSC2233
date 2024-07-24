import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';
import Select from 'react-select';
import { useForm, Head } from '@inertiajs/react';

export default function Create({ auth, courses, lecturers }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState('');

  const courseOptions = courses.map((course) => ({ value: course, label: `${course.code} - ${course.name}` }));
  const lecturerOptions = lecturers.map((lecturer) => ({ value: lecturer, label: lecturer.name }));

  const handleAddToTable = (e) => {
    e.preventDefault();
    if (selectedCourse && selectedLecturer) {
      const duplicateEntry = tableData.find(
        (entry) => entry.course.value.id === selectedCourse.value.id && entry.lecturer.value.id === selectedLecturer.value.id
      );

      if (duplicateEntry) {
        setError('This course and lecturer combination has already been added.');
      } else {
        setTableData([...tableData, { course: selectedCourse, lecturer: selectedLecturer }]);
        setSelectedCourse(null);
        setSelectedLecturer(null);
        setError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tableData.length === 0) {
      setError('Please add at least one course and lecturer combination to the table.');
      return;
    }

    const confirmProceed = window.confirm('Are you sure you want to proceed with the selected courses and lecturers?');
    if (confirmProceed) {
      // Proceed with form submission or data processing
      // For example, you can send the data to your backend using Inertia's useForm
      const form = useForm({ tableData });

      form.post('/your-submit-url', {
        onSuccess: () => {
          // Handle success
        },
        onError: () => {
          // Handle errors
        }
      });
    }
  };

  return (
    <Authenticated
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create</h2>}
    >
      <Head title="TimeTable" />
      <div className="container mt-4">
        <h1 className="mb-4">TimeTable Create</h1>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <h2 className="form-label">Select a Course</h2>
              <Select
                options={courseOptions}
                value={selectedCourse}
                onChange={setSelectedCourse}
                placeholder="Select a course..."
                isClearable
                className="basic-single"
                classNamePrefix="select"
              />
            </div>
            <div className="col-md-6">
              <h2 className="form-label">Select a Lecturer</h2>
              <Select
                options={lecturerOptions}
                value={selectedLecturer}
                onChange={setSelectedLecturer}
                placeholder="Select a lecturer..."
                isClearable
                className="basic-single"
                classNamePrefix="select"
              />
            </div>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button onClick={handleAddToTable} className="btn btn-primary">Add to table</button>
          <button type='submit' className="btn btn-primary">Continue to Proceed</button>
        </form>
        {tableData.length > 0 && (
          <div className="mt-4">
            <h2 className="mb-3">Selected Courses and Lecturers</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Lecturer</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.course.label}</td>
                    <td>{entry.lecturer.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Authenticated>
  );
}
