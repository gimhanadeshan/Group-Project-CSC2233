import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Index = ({ auth, courses }) => {
    const [search, setSearch] = useState("");
    const [level, setLevel] = useState("");
    const [semester, setSemester] = useState("");
    const [coreOptional, setCoreOptional] = useState("");

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleLevelChange = (e) => {
        setLevel(e.target.value);
    };

    const handleSemesterChange = (e) => {
        setSemester(e.target.value);
    };

    const handleCoreOptionalChange = (e) => {
        setCoreOptional(e.target.value);
    };

    const filteredCourses = courses.filter((course) => {
        return (
            (course.name.toLowerCase().includes(search.toLowerCase()) ||
                course.code.toLowerCase().includes(search.toLowerCase())) &&
            (level === "" || course.level === parseInt(level)) &&
            (semester === "" || course.semester === parseInt(semester)) &&
            (coreOptional === "" ||
                (coreOptional === "core" && course.is_core) ||
                (coreOptional === "optional" && !course.is_core))
        );
    });

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Courses" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h1 className="text-lg font-bold leading-6 text-gray-900">
                            Courses
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={search}
                                onChange={handleSearchChange}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <select
                                value={level}
                                onChange={handleLevelChange}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">All Levels</option>
                                <option value="1">Level 1</option>
                                <option value="2">Level 2</option>
                                <option value="3">Level 3</option>
                                <option value="4">Level 4</option>
                            </select>
                            <select
                                value={semester}
                                onChange={handleSemesterChange}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">All Semesters</option>
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                            </select>
                            <select
                                value={coreOptional}
                                onChange={handleCoreOptionalChange}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">All Courses</option>
                                <option value="core">Core</option>
                                <option value="optional">Optional</option>
                            </select>
                        </div>
                    </div>
                    <div className="px-4 py-4 sm:p-6">
                        {auth.permissions.includes("create_course") && (
                            <Link
                                href={route("courses.create")}
                                className="mb-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create New Course
                            </Link>
                        )}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Code
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Theory Hours
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Practical Hours
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Tutorial Hours
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Core Course
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCourses.map((course) => (
                                        <tr key={course.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {course.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {course.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {course.theory_hours}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {course.practical_hours}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {course.tutorial_hours}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {course.is_core ? "Yes" : "No"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {auth.permissions.includes(
                                                    "read_course"
                                                ) && (
                                                    <Link
                                                        href={route(
                                                            "courses.show",
                                                            course.id
                                                        )}
                                                        className="text-green-600 hover:text-green-900 pr-4"
                                                    >
                                                        View
                                                    </Link>
                                                )}

                                                {auth.permissions.includes(
                                                    "update_course"
                                                ) && (
                                                    <Link
                                                        href={route(
                                                            "courses.edit",
                                                            course.id
                                                        )}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                                {auth.permissions.includes(
                                                    "delete_course"
                                                ) && (
                                                    <Link
                                                        href={route(
                                                            "courses.destroy",
                                                            course.id
                                                        )}
                                                        method="delete"
                                                        as="button"
                                                        className="ml-4 text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
