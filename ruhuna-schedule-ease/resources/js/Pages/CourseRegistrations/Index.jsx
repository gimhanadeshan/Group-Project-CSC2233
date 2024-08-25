import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

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
    const [confirmRemove, setConfirmRemove] = useState(null); // Store course to be removed
    const [successMessage, setSuccessMessage] = useState("");

    const handleCourseToggle = (courseId) => {
        if (confirmedCourses.includes(courseId)) return;

        setSelectedCourses((prevSelectedCourses) =>
            prevSelectedCourses.includes(courseId)
                ? prevSelectedCourses.filter((id) => id !== courseId)
                : [...prevSelectedCourses, courseId]
        );
    };

    // Function to handle form submission
    const handleSubmit = () => {
        Inertia.post(
            "/course-registrations",
            {
                addedCourses: selectedCourses,
            },
            {
                onSuccess: () => {
                    setSelectedCourses([]); // Clear selected courses

                    setLocalSemesterCourses((prevSemesterCourses) => {
                        const updatedSemesterCourses = {
                            ...prevSemesterCourses,
                        };

                        // Update the semester courses to remove the selected courses
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

                    // Refresh data using Inertia replace
                    Inertia.replace(window.location.pathname, {
                        preserveState: true,
                    });
                },
                onError: (errors) => {
                    console.error(errors);
                },
            }
        );
    };

    const handleRemove = () => {
        if (confirmRemove) {
            Inertia.delete(`/course-registrations/${confirmRemove}`, {
                onSuccess: () => {
                    setLocalRegisteredCourses((prevCourses) =>
                        prevCourses.filter(
                            (course) => course.id !== confirmRemove
                        )
                    );
                    setConfirmRemove(null); // Clear confirmation state

                    // Refresh the page after successful removal
                    Inertia.replace(window.location.pathname, {
                        preserveState: true,
                    });
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
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
                        ([semesterId, { semester, courses }]) => {
                            const coreCourses = courses.filter(
                                (course) => course.is_core
                            );
                            const optionalCourses = courses.filter(
                                (course) => !course.is_core
                            );

                            return (
                                <div
                                    key={semesterId}
                                    className="mb-10 p-6 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                >
                                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
                                        {`Level ${semester.level} - Semester ${semester.semester} (${semester.academic_year})`}
                                    </h2>
                                    <h3 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
                                        Registration closes on:{" "}
                                        {new Date(
                                            semester.registration_end_date
                                        ).toLocaleDateString()}
                                    </h3>

                                    {/* Core Courses Table */}
                                    {coreCourses.length > 0 && (
                                        <>
                                            <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">
                                                Core Courses
                                            </h3>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                                Code
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                                Name
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                                Action
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                                View Course
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                        {coreCourses.map(
                                                            (course) => (
                                                                <tr
                                                                    key={
                                                                        course.id
                                                                    }
                                                                >
                                                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                                        {
                                                                            course.code
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                                        {
                                                                            course.name
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
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
                                                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                                        <Link
                                                                            href={route(
                                                                                "courses.show",
                                                                                course.id
                                                                            )}
                                                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                                        >
                                                                            View
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}

                                    {/* Optional Courses Table */}
                                    {optionalCourses.length > 0 && (
                                        <>
                                            <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">
                                                Optional Courses
                                            </h3>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                                Code
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                                Name
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                                Action
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                                View Course
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                        {optionalCourses.map(
                                                            (course) => (
                                                                <tr
                                                                    key={
                                                                        course.id
                                                                    }
                                                                >
                                                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                                        {
                                                                            course.code
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                                        {
                                                                            course.name
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
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
                                                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                                        <Link
                                                                            href={route(
                                                                                "courses.show",
                                                                                course.id
                                                                            )}
                                                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                                        >
                                                                            View
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}

                                    {selectedCourses.length > 0 && (
                                        <div className="text-center mt-6">
                                            {!confirmedCourses.length && (
                                                <button
                                                    className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                                    onClick={handleSubmit}
                                                >
                                                    Register Courses
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                    )
                ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400">
                        No courses available for registration.
                    </p>
                )}

                {/* Registered Courses Table */}
                {localRegisteredCourses.length > 0 && (
                    <div className="mb-10 p-6 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
                            Registered Courses
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {localRegisteredCourses.map((course) => (
                                        <tr key={course.id}>
                                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                {course.code}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                {course.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                {course.status ===
                                                "confirmed" ? (
                                                    <span className="text-green-600 dark:text-green-400 font-semibold">
                                                        Confirmed
                                                    </span>
                                                ) : (
                                                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                {course.status ===
                                                "confirmed" ? (
                                                    <span className="text-gray-600 dark:text-gray-500">
                                                        No Action
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                        onClick={() =>
                                                            setConfirmRemove(
                                                                course.id
                                                            )
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
                    </div>
                )}

                {/* Confirmation Dialog */}
                {confirmRemove && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">
                                Confirm Removal
                            </h3>
                            <p className="mb-4">
                                Are you sure you want to remove this course from
                                your registered courses?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold"
                                    onClick={handleRemove}
                                >
                                    Yes, Remove
                                </button>
                                <button
                                    className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800"
                                    onClick={() => setConfirmRemove(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default CourseRegistrations;
