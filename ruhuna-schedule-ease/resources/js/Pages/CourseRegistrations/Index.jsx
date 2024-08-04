import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const CourseRegistrations = ({ auth, courses }) => {
    const [addedCourses, setAddedCourses] = useState([]);

    const handleCourseToggle = (courseId) => {
        if (addedCourses.includes(courseId)) {
            setAddedCourses(addedCourses.filter(id => id !== courseId));
        } else {
            setAddedCourses([...addedCourses, courseId]);
        }
    };

    const handleSubmit = () => {
        Inertia.post('/course-registrations', { addedCourses });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Degree Programs" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Course Registrations</h1>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Code</th>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b text-center">{course.code}</td>
                                <td className="py-2 px-4 border-b text-left">{course.name}</td>
                                <td className={`py-2 px-4 border-b text-center ${addedCourses.includes(course.id) ? 'bg-red-700' : 'bg-green-700'}`}>
                                    <button onClick={() => handleCourseToggle(course.id)}>
                                        {addedCourses.includes(course.id) ? "Remove" : "Add"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h2 className="text-2xl font-bold mt-8 text-center">Added Courses</h2>
                {addedCourses.length > 0 ? (
                    <table className="min-w-full bg-white mt-4">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Code</th>
                                <th className="py-2 px-4 border-b text-left">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addedCourses.map((courseId) => {
                                const course = courses.find((c) => c.id === courseId);
                                return (
                                    <tr key={course.id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b text-center">{course.code}</td>
                                        <td className="py-2 px-4 border-b text-left">{course.name}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p className='text-center'>No courses added yet.</p>
                )}
                {addedCourses.length > 0 && (
                    <div className="text-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4" onClick={handleSubmit}> 
                        Submit
                        </button>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default CourseRegistrations;
