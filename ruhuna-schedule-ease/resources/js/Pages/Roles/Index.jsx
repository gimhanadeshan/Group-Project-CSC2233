import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth }) {
    const { roles } = usePage().props;

    const canCreate = auth.permissions.includes("create_role");
    const canEdit = auth.permissions.includes("update_role");
    const canDelete = auth.permissions.includes("delete_role");

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Roles" />
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Roles</h1>
                {canCreate && (
                    <Link
                        href={route("roles.create")}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md inline-block mb-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Create Role
                    </Link>
                )}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Permissions
                                </th>
                                {(canEdit || canDelete) && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {roles.map((role) => (
                                <tr key={role.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {role.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex flex-wrap gap-2">
                                            {role.permissions.map(
                                                (permission, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-xs"
                                                    >
                                                        {permission.name}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </td>

                                    {(canEdit || canDelete) && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {canEdit && (
                                                <Link
                                                    href={route(
                                                        "roles.edit",
                                                        role.id
                                                    )}
                                                    className="text-yellow-600 hover:text-yellow-900 mr-4"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                            {canDelete && (
                                                <form
                                                    action={route(
                                                        "roles.destroy",
                                                        role.id
                                                    )}
                                                    method="POST"
                                                    className="inline-block"
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        if (
                                                            confirm(
                                                                "Are you sure you want to delete this role?"
                                                            )
                                                        ) {
                                                            e.target.submit();
                                                        }
                                                    }}
                                                >
                                                    <input
                                                        type="hidden"
                                                        name="_method"
                                                        value="DELETE"
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="_token"
                                                        value={auth.csrf_token}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </form>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
