import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { debounce } from "lodash";

const UserRegisteredCourses = ({ auth, userCourses, semesters }) => {
    const [filters, setFilters] = useState({
        courseCode: "",
        courseName: "",
        studentName: "",
        semesterId: "",
        status: "",
    });

    const { data, setData, put, post, delete: destroy, processing } = useForm({
        course_ids: [],
    });

    const handleConfirmAllCourses = () => {
        const courseIds = filteredCourses.map((course) => course.course.code);
        setData("course_ids", courseIds);
        post(route("course-confirmation.confirmAll"), {
            preserveScroll: true,
        });
    };

    const handleCancelAllCourses = () => {
        const courseIds = filteredCourses.map((course) => course.course.code);
        setData("course_ids", courseIds);
        destroy(route("course-confirmation.cancelAll"), {
            preserveScroll: true,
        });
    };


    const handleConfirmCourse = (courseId,studentId) => {
        put(`/course-confirmation/confirm/${courseId}/${studentId}`, {
            preserveScroll: true,
        });
        //console.log(studentId);
    };

    const handleCancelCourse = (courseId,studentId) => {
        put(`/course-confirmation/cancel/${courseId}/${studentId}`, {
            preserveScroll: true,
        });
        //console.log(studentId);
    };

    const debouncedFilterChange = debounce((name, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    }, 300);

    const handleFilterChange = (e) => {
        debouncedFilterChange(e.target.name, e.target.value);
    };

    const filteredCourses = userCourses.filter((course) => {
        const semesterIdMatch = filters.semesterId
            ? course.semester_id === Number(filters.semesterId)
            : true;

        return (
            (filters.courseCode === "" ||
                course.course.code.includes(filters.courseCode)) &&
            (filters.courseName === "" ||
                course.course.name
                    .toLowerCase()
                    .includes(filters.courseName.toLowerCase())) &&
            (filters.studentName === "" ||
                course.user.name
                    .toLowerCase()
                    .includes(filters.studentName.toLowerCase())) &&
            semesterIdMatch &&
            (filters.status === "" || course.status === filters.status)
        );
    });

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
                                        {`Level ${semester.level} - Semester ${semester.semester} - ${semester.academic_year} - ${
                                            semester.degree_program.name || "No Degree Program"
                                        }`}
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
                                name="studentName"
                                value={filters.studentName}
                                onChange={handleFilterChange}
                                placeholder="Filter by Student Name"
                                className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-auto"
                            />
                        </div>
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => handleConfirmAllCourses()}
                                className="px-4 py-2 bg-green-500 text-white rounded-md"
                                disabled={processing}
                            >
                                Confirm All
                            </button>
                            <button
                                onClick={() => handleCancelAllCourses()}
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                                disabled={processing}
                            >
                                Cancel All
                            </button>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Code
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course Code
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course Name
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCourses.map((course) => (
                                    <tr key={course.course.code}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {course.user.registration_no}
                                            {console.log(course.user.id)}
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
                                            <button
                                                onClick={() => handleConfirmCourse(course.course.code,course.user.id)}
                                                className="px-4 py-2 bg-green-500 text-white rounded-md mr-2"
                                                disabled={processing}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => handleCancelCourse(course.course.code,course.user.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                                                disabled={processing}
                                            >
                                                Cancel
                                            </button>
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
