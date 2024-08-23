import React, { useState, useEffect } from "react";
import { Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ users, auth, roles, degreePrograms }) {
    const { delete: destroy } = useForm();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
    const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
    const [yearOptions, setYearOptions] = useState([]);

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this user?")) {
            destroy(route("users.destroy", id));
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleAcademicYearChange = (e) => {
        setSelectedAcademicYear(e.target.value);
    };

    const handleDegreeProgramChange = (e) => {
        setSelectedDegreeProgram(e.target.value);
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.registration_no
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole
            ? user.role.name === selectedRole
            : true;
        const matchesAcademicYear = selectedAcademicYear
            ? user.academic_year === selectedAcademicYear
            : true;
        const matchesDegreeProgram = selectedDegreeProgram
            ? user.degree_program_id === parseInt(selectedDegreeProgram)
            : true;
        return (
            matchesSearch &&
            matchesRole &&
            matchesAcademicYear &&
            matchesDegreeProgram
        );
    });

    const handleExport = () => {
        const queryParams = new URLSearchParams({
            searchQuery,
            selectedRole,
            selectedAcademicYear,
            selectedDegreeProgram,
        }).toString();
        window.location.href = `${route("users.export")}?${queryParams}`;
    };

    useEffect(() => {
        // Generate last 10 years for academic year dropdown
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
        setYearOptions(
            years.map((year) => ({ value: year, label: year.toString() }))
        );
    }, []);

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="User Management" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h1 className="text-lg font-bold leading-6 text-gray-900">
                            User Management
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <input
                                type="text"
                                placeholder="Search by name or Registration No"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <select
                                value={selectedRole}
                                onChange={handleRoleChange}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">All Roles</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedAcademicYear}
                                onChange={handleAcademicYearChange}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">All Academic Years</option>
                                {yearOptions.map((year) => (
                                    <option key={year.value} value={year.value}>
                                        {year.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedDegreeProgram}
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
                    </div>
                    <div className="px-4 py-4 sm:p-6">
                        <div className="flex justify-between mb-4">
                            {auth.permissions.includes("create_user") && (
                                <a
                                    href={route("users.create")}
                                    className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Create New User
                                </a>
                            )}
                            {auth.permissions.includes("export_users") && (
                                <button
                                    onClick={handleExport}
                                    className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Export Filtered Data
                                </button>
                            )}
                        </div>
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
                                            Email
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Registration No
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Role
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Academic Year
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
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.registration_no}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.role.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.academic_year}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {auth.permissions.includes(
                                                    "update_user"
                                                ) && (
                                                    <Link
                                                        href={route(
                                                            "users.edit",
                                                            user.id
                                                        )}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                                {auth.permissions.includes(
                                                    "delete_user"
                                                ) && (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id
                                                            )
                                                        }
                                                        className="ml-4 text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
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
            </div>
        </AuthenticatedLayout>
    );
}
