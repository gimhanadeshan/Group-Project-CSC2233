import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const CourseRegistrations = ({
    auth,
    semesterCourses,
    confirmedCourses = [],
    registeredCourses = [],
    message,
}) => {
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [localRegisteredCourses, setLocalRegisteredCourses] =
        useState(registeredCourses);
    const [localSemesterCourses, setLocalSemesterCourses] =
        useState(semesterCourses);

    const handleCourseToggle = (courseId) => {
        // Do not allow toggling for confirmed courses
        if (confirmedCourses.includes(courseId)) return;

        setSelectedCourses((prevSelectedCourses) =>
            prevSelectedCourses.includes(courseId)
                ? prevSelectedCourses.filter((id) => id !== courseId)
                : [...prevSelectedCourses, courseId]
        );
    };

    const handleSubmit = () => {
        Inertia.post(
            "/course-registrations",
            {
                addedCourses: selectedCourses,
            },
            {
                onSuccess: () => {
                    // Update local state to reflect new registrations
                    setSelectedCourses([]);
                    // Update available courses by removing registered courses
                    setLocalSemesterCourses((prevSemesterCourses) => {
                        const updatedSemesterCourses = {
                            ...prevSemesterCourses,
                        };

                        Object.entries(updatedSemesterCourses).forEach(
                            ([semesterId, { courses }]) => {
                                updatedSemesterCourses[semesterId].courses =
                                    courses.filter(
                                        (course) =>
                                            !selectedCourses.includes(course.id)
                                    );
                            }
                        );

                        return updatedSemesterCourses;
                    });
                },
                onError: (errors) => {
                    console.error(errors);
                    // Optionally, handle errors here
                },
            }
        );
    };

    const handleRemove = (courseId) => {
        Inertia.delete(`/course-registrations/${courseId}`, {
            onSuccess: () => {
                setLocalRegisteredCourses((prevCourses) =>
                    prevCourses.filter((course) => course.id !== courseId)
                );
                // Optionally, you could also refresh the available courses
            },
            onError: (errors) => {
                console.error(errors);
                // Optionally, handle errors here
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Course Registrations" />
            <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
                    Course Registrations
                </h1>
                {message && (
                    <p className="text-center text-red-600 mb-6 font-semibold">
                        {message}
                    </p>
                )}

                {/* Available Courses Table */}
                {Object.keys(localSemesterCourses).length > 0 ? (
                    Object.entries(localSemesterCourses).map(
                        ([semesterId, { semester, courses }]) => (
                            <div
                                key={semesterId}
                                className="mb-10 p-6 border border-gray-200 rounded-lg shadow-sm"
                            >
                                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                                    {`Level ${semester.level} - Semester ${semester.semester} (${semester.academic_year})`}
                                </h2>
                                <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
                                    Registration closes on:{" "}
                                    {new Date(
                                        semester.registration_end_date
                                    ).toLocaleDateString()}
                                </h3>
                                <table className="min-w-full divide-y divide-gray-300 bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                                Code
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {courses.map((course) => (
                                            <tr key={course.id}>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {course.code}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {course.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 ">
                                                    {!confirmedCourses.includes(
                                                        course.id
                                                    ) && (
                                                        <button
                                                            className={`px-4 py-2 rounded-md text-white ${
                                                                selectedCourses.includes(
                                                                    course.id
                                                                )
                                                                    ? "bg-red-600 hover:bg-red-700"
                                                                    : "bg-green-600 hover:bg-green-700"
                                                            }`}
                                                            onClick={() =>
                                                                handleCourseToggle(
                                                                    course.id
                                                                )
                                                            }
                                                        >
                                                            {selectedCourses.includes(
                                                                course.id
                                                            )
                                                                ? "Remove"
                                                                : "Add"}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {courses.length > 0 &&
                                    selectedCourses.length > 0 && (
                                        <div className="text-center mt-6">
                                            {!confirmedCourses.length && (
                                                <button
                                                    className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                                    onClick={handleSubmit}
                                                >
                                                    Submit
                                                </button>
                                            )}
                                        </div>
                                    )}
                            </div>
                        )
                    )
                ) : (
                    <p className="text-center text-gray-600 font-semibold">
                        No courses available for registration.
                    </p>
                )}

                {/* Registered Courses Table */}
                {localRegisteredCourses.length > 0 && (
                    <div className="mb-10 p-6 border border-gray-200 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                            Registered Courses
                        </h2>
                        <table className="min-w-full divide-y divide-gray-300 bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {localRegisteredCourses.map((course) => (
                                    <tr key={course.id}>
                                        <td className="px-6 py-4 text-sm text-gray-700 ">
                                            {course.code}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {course.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {course.status === "confirmed" ? (
                                                <span className="text-green-600 font-semibold">
                                                    Confirmed
                                                </span>
                                            ) : (
                                                <span className="text-yellow-600 font-semibold">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {course.status === "confirmed" ? (
                                                <span className="text-gray-600">
                                                    No Action
                                                </span>
                                            ) : (
                                                <button
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() =>
                                                        handleRemove(course.id)
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default CourseRegistrations;
