import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Show = ({ course, auth, lectures, registrations }) => {
    console.log(lectures);
    // Calculate total lecture hours per week
    const totalLectureHours = (
        course.theory_hours +
        course.practical_hours +
        course.tutorial_hours
    ).toFixed(2);

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title={`Course Details - ${course.code}`} />
            <div className="max-w-4xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-800 dark:text-gray-200 bg-white shadow sm:rounded-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 border-b pb-2 border-gray-300 dark:text-gray-100 dark:border-gray-600">
                    {course.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800">
                            <tbody>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300 text-xs">
                                        Code:
                                    </td>
                                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200 text-xs">
                                        {course.code}
                                    </td>
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300 text-xs">
                                        Credit Hours:
                                    </td>
                                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200 text-xs">
                                        {course.credit_hours}
                                    </td>
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300 text-xs">
                                        Core:
                                    </td>
                                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200 text-xs">
                                        {course.is_core ? "Yes" : "No"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300 text-xs">
                                        Level:
                                    </td>
                                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200 text-xs">
                                        {course.level}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-300 dark:bg-gray-900 dark:border-gray-700">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 dark:text-gray-100">
                            Description
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            {course.description}
                        </p>
                    </div>
                </div>

                <div className="mt-6 sm:mt-8">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 dark:text-gray-100">
                        Lecture Hours Per Week
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-600">
                            <thead className="bg-gray-100 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                <tr>
                                    <th className="py-3 px-4 text-left text-gray-600 font-medium text-xs dark:text-gray-300">
                                        Type
                                    </th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-medium text-xs dark:text-gray-300">
                                        Hours
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200 dark:border-gray-600">
                                    <td className="py-3 px-4 text-gray-700 text-xs dark:text-gray-300">
                                        Theory
                                    </td>
                                    <td className="py-3 px-4 text-gray-700 text-xs dark:text-gray-300">
                                        {course.theory_hours}
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-600">
                                    <td className="py-3 px-4 text-gray-700 text-xs dark:text-gray-300">
                                        Practical
                                    </td>
                                    <td className="py-3 px-4 text-gray-700 text-xs dark:text-gray-300">
                                        {course.practical_hours}
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-600">
                                    <td className="py-3 px-4 text-gray-700 text-xs dark:text-gray-300">
                                        Tutorial
                                    </td>
                                    <td className="py-3 px-4 text-gray-700 text-xs dark:text-gray-300">
                                        {course.tutorial_hours}
                                    </td>
                                </tr>
                                <tr className="bg-gray-50 border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                    <td className="py-3 px-4 font-semibold text-gray-800 text-xs dark:text-gray-100">
                                        Total
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-gray-800 text-xs dark:text-gray-100">
                                        {totalLectureHours}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 sm:mt-8">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 dark:text-gray-100">
                        Lecturers
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-300 dark:bg-gray-900 dark:border-gray-700">
                        {lectures.length > 0 ? (
                            <div className="flex flex-wrap gap-4">
                                {lectures.map((lecture) => (
                                    <div
                                        key={lecture.id}
                                        className="flex items-center space-x-3"
                                    >
                                        {/* Circular initials */}
                                        <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white text-lg font-bold rounded-full dark:bg-blue-600">
                                            {lecture.lecturer
                                                ? lecture.lecturer.name
                                                      .charAt(0)
                                                      .toUpperCase()
                                                : "U"}
                                        </div>
                                        {/* Lecturer name */}
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {lecture.lecturer
                                                ? lecture.lecturer.name
                                                : "Unknown Lecturer"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                                No lecturer data available
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 sm:mt-8">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 dark:text-gray-100">
                        Student Registrations
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-600">
                            <thead className="bg-gray-100 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                <tr>
                                    <th className="py-3 px-4 text-left text-gray-600 font-medium text-xs dark:text-gray-300">
                                        Academic Year
                                    </th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-medium text-xs dark:text-gray-300">
                                        Number of Registrations
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.length > 0 ? (
                                    registrations.map((registration) => (
                                        <tr
                                            key={registration.academicYear}
                                            className="border-b border-gray-200 dark:border-gray-600"
                                        >
                                            <td className="py-3 px-4 text-gray-700 text-xs dark:text-gray-300">
                                                {registration.academicYear}
                                            </td>
                                            <td className="py-3 px-4 text-gray-700 text-xs dark:text-gray-300">
                                                {registration.count}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="2"
                                            className="py-3 px-4 text-gray-700 text-xs dark:text-gray-300 text-center"
                                        >
                                            No registrations found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
