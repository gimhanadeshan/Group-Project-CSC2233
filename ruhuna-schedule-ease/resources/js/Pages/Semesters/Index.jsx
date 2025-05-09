import React, { useState, useEffect } from "react";
import { Link, usePage,useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Index = ({ auth, semesters, degreePrograms }) => {
    const { delete: destroy } = useForm();
    const [search, setSearch] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [status, setStatus] = useState("");
    const [degreeProgram, setDegreeProgram] = useState("");

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this semester?")) {
            destroy(route("semesters.destroy", id));
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleAcademicYearChange = (e) => {
        setAcademicYear(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleDegreeProgramChange = (e) => {
        setDegreeProgram(e.target.value);
    };

    const filteredSemesters = semesters.filter((sem) => {
        return (
            (sem.academic_year.toLowerCase().includes(search.toLowerCase()) ||
                sem.degree_program.name
                    .toLowerCase()
                    .includes(search.toLowerCase())) &&
            (academicYear === "" || sem.academic_year === academicYear) &&
            (status === "" || sem.status === status) &&
            (degreeProgram === "" ||
                sem.degree_program.id === parseInt(degreeProgram, 10))
        );
    });

    const { errors } = usePage().props;

    const canCreate = auth.permissions.includes("create_semester");
    const canEdit = auth.permissions.includes("update_semester");
    const canDelete = auth.permissions.includes("delete_semester");
    const canRead = auth.permissions.includes("read_semester");

    // Generate the last 10 years
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Semesters" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-lg font-bold leading-6 text-gray-900">
                                Semesters
                            </h1>
                            {canCreate && (
                                <Link
                                    href={route("semesters.create")}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Semester
                                </Link>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Search by academic year or degree program..."
                                value={search}
                                onChange={handleSearchChange}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <select
                                value={academicYear}
                                onChange={handleAcademicYearChange}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">All Academic Years</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={status}
                                onChange={handleStatusChange}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">All Statuses</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Completed">Completed</option>
                                <option value="In Progress">In Progress</option>
                            </select>
                            <select
                                value={degreeProgram}
                                onChange={handleDegreeProgramChange}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">All Degree Programs</option>
                                {degreePrograms.map((program) => (
                                    <option key={program.id} value={program.id}>
                                        {program.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Academic Year
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Level
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Semester
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Degree Program
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        {canEdit || canRead || canDelete ? (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        ) : null}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredSemesters.map((sem) => (
                                        <tr key={sem.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {sem.academic_year}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {sem.level}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {sem.semester}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {sem.degree_program.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {sem.status}
                                            </td>
                                            {canEdit || canRead || canDelete ? (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {canEdit && (
                                                        <Link
                                                            href={route(
                                                                "semesters.edit",
                                                                sem.id
                                                            )}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            Edit
                                                        </Link>
                                                    )}
                                                    {canRead && (
                                                        <Link
                                                            href={route(
                                                                "semesters.show",
                                                                sem.id
                                                            )}
                                                            className="text-green-600 hover:text-green-900 mr-4"
                                                        >
                                                            View
                                                        </Link>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    sem.id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </td>
                                            ) : null}
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
