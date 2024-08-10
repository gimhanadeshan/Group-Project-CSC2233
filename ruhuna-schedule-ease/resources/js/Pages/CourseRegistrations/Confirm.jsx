import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const CourseConfirmations = ({ auth, pendingCourses, message }) => {
    const [pendingCoursesWithChecked, setPendingCoursesWithChecked] = useState(
        pendingCourses.map((course) => ({ ...course, isChecked: false }))
    );

    const handleConfirmAll = (courseId) => {
        Inertia.post(`/course-confirmations/confirm-all/${courseId}`);
    };

    const handleCheckboxChange = (courseId) => {
        setPendingCoursesWithChecked(
            pendingCoursesWithChecked.map((course) =>
                course.id === courseId
                    ? { ...course, isChecked: !course.isChecked }
                    : course
            )
        );
    };

    const handleConfirmByModule = (moduleId) => {
        const selectedCourseIds = pendingCoursesWithChecked
            .filter((course) => course.isChecked)
            .map((course) => course.id);

        Inertia.post(`/course-confirmations/confirm-by-module/${moduleId}`, {
            courseIds: selectedCourseIds,
        });
    };

    const handleConfirmForUser = () => {
        const selectedCourseIds = pendingCoursesWithChecked
            .filter((course) => course.isChecked)
            .map((course) => course.id);

        Inertia.post(`/course-confirmations/confirm-for-user/${auth.user.id}`, {
            courseIds: selectedCourseIds,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Course Confirmations" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Course Confirmations
                </h1>
                {message && (
                    <p className="text-center text-red-500">{message}</p>
                )}

                {/* Pending Courses Table */}
                {pendingCoursesWithChecked.length > 0 ? (
                    <div className="mb-8">
                        <table className="min-w-full bg-white mb-4">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Code</th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Name
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">
                                        Confirm
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">
                                        Confirm All
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingCoursesWithChecked.map((course) => (
                                    <tr
                                        key={course.id}
                                        className="hover:bg-gray-100"
                                    >
                                        <td className="py-2 px-4 border-b text-center">
                                            {course.code}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {course.name}
                                        </td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <input
                                                type="checkbox"
                                                checked={course.isChecked}
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        course.id
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <button
                                                className="text-base px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold"
                                                onClick={() =>
                                                    handleConfirmAll(course.id)
                                                }
                                            >
                                                Confirm All
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center">
                        No pending courses for confirmation.
                    </p>
                )}
            </div>

            <div className="mb-8">
                <table className="min-w-full bg-white mb-4">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Code</th>
                            <th className="py-2 px-4 border-b text-left">
                                Name
                            </th>
                            <th className="py-2 px-4 border-b text-center">
                                Confirm
                            </th>
                            <th className="py-2 px-4 border-b text-center">
                                Confirm By Module
                            </th>
                            <th className="py-2 px-4 border-b text-center">
                                Confirm User
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingCoursesWithChecked.map((course) => (
                            <tr key={course.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b text-center">
                                    {course.code}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {course.name}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <input
                                        type="checkbox"
                                        checked={course.isChecked}
                                        onChange={() =>
                                            handleCheckboxChange(course.id)
                                        }
                                    />
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button
                                        className="text-base px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold"
                                        onClick={() =>
                                            handleConfirmByModule(
                                                course.moduleId
                                            )
                                        } // Adjust as necessary
                                    >
                                        Confirm By Module
                                    </button>
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button
                                        className="text-base px-4 py-2 rounded-md bg-green-500 hover:bg-green-700 text-white font-bold"
                                        onClick={handleConfirmForUser}
                                    >
                                        Confirm User
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
};

export default CourseConfirmations;
