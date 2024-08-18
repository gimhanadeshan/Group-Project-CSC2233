import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Show = ({ course, auth }) => {
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
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 border-b pb-2 border-gray-300 dark:text-gray-100 dark:border-gray-600">
                    {course.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800">
                            <tbody>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                                        Code:
                                    </td>
                                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">
                                        {course.code}
                                    </td>
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                                        Credit Hours:
                                    </td>
                                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">
                                        {course.credit_hours}
                                    </td>
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                                        Core:
                                    </td>
                                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">
                                        {course.is_core ? "Yes" : "No"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                                        Level:
                                    </td>
                                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">
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
                                    <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm dark:text-gray-300">
                                        Type
                                    </th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm dark:text-gray-300">
                                        Hours
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200 dark:border-gray-600">
                                    <td className="py-3 px-4 text-gray-700 text-sm dark:text-gray-300">
                                        Theory
                                    </td>
                                    <td className="py-3 px-4 text-gray-700 text-sm dark:text-gray-300">
                                        {course.theory_hours}
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-600">
                                    <td className="py-3 px-4 text-gray-700 text-sm dark:text-gray-300">
                                        Practical
                                    </td>
                                    <td className="py-3 px-4 text-gray-700 text-sm dark:text-gray-300">
                                        {course.practical_hours}
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-600">
                                    <td className="py-3 px-4 text-gray-700 text-sm dark:text-gray-300">
                                        Tutorial
                                    </td>
                                    <td className="py-3 px-4 text-gray-700 text-sm dark:text-gray-300">
                                        {course.tutorial_hours}
                                    </td>
                                </tr>
                                <tr className="bg-gray-50 border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                    <td className="py-3 px-4 font-semibold text-gray-800 text-sm dark:text-gray-100">
                                        Total
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-gray-800 text-sm dark:text-gray-100">
                                        {totalLectureHours}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
