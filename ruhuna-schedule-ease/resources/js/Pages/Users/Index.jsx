import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ users, auth, roles }) {
    const { delete: destroy } = useForm();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

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
        return matchesSearch && matchesRole && matchesAcademicYear;
    });

    const uniqueAcademicYears = [
        ...new Set(users.map((user) => user.academic_year)),
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="User Management" />

            <div>
                <h1 className="text-2xl font-bold mb-6">User Management</h1>

                <div className="flex justify-between mb-4">
                    <Link
                        href={route("users.create")}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md inline-block mb-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Create New User
                    </Link>
                    
                    <a
                        href={route("users.export")}
                        className="bg-green-600 text-white py-2 px-4 rounded-md inline-block mb-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Export to Excel
                    </a>
                </div>

                <div className="flex mb-4 space-x-4">
                    <input
                        type="text"
                        placeholder="Search by name or Registration No"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="p-2 border rounded w-1/3"
                    />
                    <select
                        value={selectedRole}
                        onChange={handleRoleChange}
                        className="p-2 border rounded w-1/4"
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
                        className="p-2 border rounded w-1/4"
                    >
                        <option value="">All Academic Years</option>
                        {uniqueAcademicYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-4">
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
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Delete</span>
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
                                        <Link
                                            href={route("users.edit", user.id)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() =>
                                                handleDelete(user.id)
                                            }
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
