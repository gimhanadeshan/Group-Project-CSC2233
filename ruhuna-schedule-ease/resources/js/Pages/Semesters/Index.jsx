import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Index = ({ auth, semesters }) => {
    const { errors } = usePage().props;

    const canCreate = auth.permissions.includes("create_semester");
    const canEdit = auth.permissions.includes("update_semester");
    const canDelete = auth.permissions.includes("delete_semester");
    const canRead = auth.permissions.includes("read_semester");

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
                                    {semesters.map((semester) => (
                                        <tr key={semester.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {semester.academic_year}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {semester.level}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {semester.semester}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {semester.status}
                                            </td>
                                            {canEdit || canRead || canDelete ? (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {canEdit && (
                                                        <Link
                                                            href={route(
                                                                "semesters.edit",
                                                                semester.id
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
                                                                semester.id
                                                            )}
                                                            className="text-green-600 hover:text-green-900 mr-4"
                                                        >
                                                            View
                                                        </Link>
                                                    )}
                                                    {canDelete && (
                                                        <Link
                                                            href={route(
                                                                "semesters.destroy",
                                                                semester.id
                                                            )}
                                                            method="delete"
                                                            as="button"
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </Link>
                                                    )}
                                                </td>
                                            ) : null}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {semesters.length === 0 && (
                            <div className="text-center text-gray-500 py-4">
                                No semesters found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
