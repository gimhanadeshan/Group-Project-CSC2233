import React from 'react'
import Select from 'react-select'
import { useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';


const options=[
    {value:'choco', label:'choco'},
    {value:'str', label:'str'},
    {value:'strn', label:'strn'}


]

export default function SearchInput() {
    // const { courses } = usePage().props;
    // const [selectedCourse, setSelectedCourse] = useState(null);
    // const [selectedLecturer, setSelectedLecturer] = useState(null);
    // const [selectedPairs, setSelectedPairs] = useState([]);

    // const handleCourseChange = (e) => {
    //     const courseId = e.target.value;
    //     const course = courses.find(c => c.id == courseId);
    //     setSelectedCourse(course);
    //     setSelectedLecturer(null); // Reset the lecturer selection
    // };

    // const handleLecturerChange = (e) => {
    //     const lecturerId = e.target.value;
    //     const lecturer = selectedCourse.lecturers.find(l => l.id == lecturerId);
    //     setSelectedLecturer(lecturer);
    // };

    // const handleAddPair = () => {
    //     if (selectedCourse && selectedLecturer) {
    //         setSelectedPairs([...selectedPairs, { course: selectedCourse, lecturer: selectedLecturer }]);
    //         setSelectedCourse(null);
    //         setSelectedLecturer(null);
    //     }
    // };

    return (
        <div>
            <h1>Create Timetable</h1>
            <div>
                <select onChange={handleCourseChange} value={selectedCourse ? selectedCourse.id : ''}>
                    <option value="" disabled>Select Course</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                </select>
                {selectedCourse && (
                    <select onChange={handleLecturerChange} value={selectedLecturer ? selectedLecturer.id : ''}>
                        <option value="" disabled>Select Lecturer</option>
                        {selectedCourse.lecturers.map(lecturer => (
                            <option key={lecturer.id} value={lecturer.id}>{lecturer.name}</option>
                        ))}
                    </select>
                )}
                <button onClick={handleAddPair}>Add</button>
            </div>
            <div>
                <h2>Selected Courses and Lecturers</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Lecturer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedPairs.map((pair, index) => (
                            <tr key={index}>
                                <td>{pair.course.name}</td>
                                <td>{pair.lecturer.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
