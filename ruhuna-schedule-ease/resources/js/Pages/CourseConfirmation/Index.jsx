import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const UserRegisteredCourses = ({ auth, userCourses, semesters }) => {
    const [filters, setFilters] = useState({
        courseCode: "",
        courseName: "",
        studentRegistrationNo: "",
        semesterId: "",
        status: "",
    });
    const { data, setData, post, processing } = useForm({
        course_id: "",
    });

    const handleConfirmCourse = (courseCode) => {
        setData("course_id", courseCode);
        post(route("course-confirmation.confirm", { courseCode }), {
            preserveScroll: true,
        });
    };

    const handleCancelCourse = (courseCode) => {
        setData("course_id", courseCode);
        post(route("course-confirmation.cancel", { courseCode }), {
            preserveScroll: true,
        });
    };

    // Apply filters
    const filteredCourses = userCourses.filter((course) => {
        const semesterIdMatch = filters.semesterId
            ? course.semester_id === Number(filters.semesterId)
            : true;
            
        return (
            (filters.courseCode === "" || course.course.code.includes(filters.courseCode)) &&
            (filters.courseName === "" || course.course.name.toLowerCase().includes(filters.courseName.toLowerCase())) &&
            (filters.studentRegistrationNo === "" || course.user.registration_no.includes(filters.studentRegistrationNo)) &&
            semesterIdMatch &&
            (filters.status === "" || course.status === filters.status)
        );
    });

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="User Registered Courses" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h1 className="text-lg font-bold leading-6 text-gray-900">
                            User Registered Courses
                        </h1>
                    </div>

                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex flex-wrap gap-4 mb-4">
                        <select
                                name="semesterId"
                                value={filters.semesterId}
                                onChange={handleFilterChange}
                                className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-auto"
                            >
                                <option value="">Select Semester</option>
                                {semesters.map((semester) => (
                                    <option key={semester.id} value={semester.id}>
                                        {`Level ${semester.level} - Semester ${semester.semester} - ${semester.academic_year} - ${semester.degree_program.name || 'No Degree Program'}`}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                               className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-auto lg:w-1/5"
                            >
                                <option value="">Select Status</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                {/* Add more status options as needed */}
                            </select>
                            <input
                                type="text"
                                name="courseCode"
                                value={filters.courseCode}
                                onChange={handleFilterChange}
                                placeholder="Filter by Course Code"
                                className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-auto"
                            />
                            <input
                                type="text"
                                name="courseName"
                                value={filters.courseName}
                                onChange={handleFilterChange}
                                placeholder="Filter by Course Name"
                                className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-auto"
                            />
                            <input
                                type="text"
                                name="studentRegistrationNo"
                                value={filters.studentRegistrationNo}
                                onChange={handleFilterChange}
                                placeholder="Filter by Student No"
                                className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-auto"
                            />
                           
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Student
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Course Code
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Course Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCourses.map((course) => (
                                    <tr key={course.course.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {course.user.registration_no}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {course.course.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {course.course.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {course.status}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {course.status === "confirmed" ? (
                                                <button
                                                    className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${
                                                        processing
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleCancelCourse(
                                                            course.course.code
                                                        )
                                                    }
                                                    disabled={processing}
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <button
                                                    className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 ${
                                                        processing
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleConfirmCourse(
                                                            course.course.code
                                                        )
                                                    }
                                                    disabled={processing}
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default UserRegisteredCourses;
