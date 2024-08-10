import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

const CourseRegistrations = ({
    auth,
    semesterCourses,
    confirmedCourses = [],
    pendingCourses = [],
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
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Course Registrations
                </h1>
                {message && (
                    <p className="text-center text-red-500">{message}</p>
                )}

                {/* Available Courses Table */}
                {Object.keys(localSemesterCourses).length > 0 ? (
                    Object.entries(localSemesterCourses).map(
                        ([semesterId, { semester, courses }]) => (
                            <div key={semesterId} className="mb-8">
                                <h2 className="text-xl font-bold mb-4 text-center">
                                    {`Level ${semester.level} - Semester ${semester.semester} (${semester.academic_year})`}
                                </h2>
                                <h3 className="text-lg font-semibold mb-2 text-center">
                                    Registration closes on:{" "}
                                    {new Date(
                                        semester.registration_end_date
                                    ).toLocaleDateString()}
                                </h3>
                                <table className="min-w-full bg-white mb-4">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b">
                                                Code
                                            </th>
                                            <th className="py-2 px-4 border-b text-left">
                                                Name
                                            </th>
                                            <th className="py-2 px-4 border-b">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((course) => (
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
                                                    {!confirmedCourses.includes(
                                                        course.id
                                                    ) && (
                                                        <button
                                                            className={`text-base px-4 py-2 rounded-md ${
                                                                selectedCourses.includes(
                                                                    course.id
                                                                )
                                                                    ? "bg-red-500"
                                                                    : "bg-green-500"
                                                            } hover:bg-red-700 text-white w-24`}
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
                                        <div className="text-center">
                                            {!confirmedCourses.length > 0 && (
                                                <button
                                                    className="text-base px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4"
                                                    onClick={handleSubmit}
                                                >
                                                    Submit
                                                </button>
                                            )}
                                            {confirmedCourses.length > 0 && (
                                                <button
                                                    className="text-base px-4 py-2 rounded-md bg-green-500 hover:bg-green-700 text-white font-bold mt-4"
                                                    onClick={handleConfirm}
                                                >
                                                    Confirm Selected
                                                </button>
                                            )}
                                        </div>
                                    )}
                            </div>
                        )
                    )
                ) : (
                    <p className="text-center">
                        No courses available for registration.
                    </p>
                )}

                {/* Registered Courses Table */}
                {localRegisteredCourses.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 text-center">
                            Registered Courses
                        </h2>
                        <table className="min-w-full bg-white mb-4">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Code</th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Name
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Status
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {localRegisteredCourses.map((course) => (
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
                                            {course.status === "confirmed" ? (
                                                <span className="text-green-500 font-semibold">
                                                    Confirmed
                                                </span>
                                            ) : (
                                                <span className="text-yellow-500 font-semibold">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b text-center">
                                            {course.status === "confirmed" ? (
                                                <span className="text-gray-500">
                                                    No Action
                                                </span>
                                            ) : (
                                                <button
                                                    className="text-base px-4 py-2 rounded-md bg-red-500 hover:bg-red-700 text-white w-24"
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
