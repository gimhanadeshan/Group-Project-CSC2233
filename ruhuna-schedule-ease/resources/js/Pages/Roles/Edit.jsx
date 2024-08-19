import React from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({ auth }) {
    const { role, permissions, rolePermissions } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        role_type: role.role_type || '', // Initialize role_type
        permissions: rolePermissions,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("roles.update", role.id));
    };

    const handleCheckboxChange = (permissionId) => {
        const updatedPermissions = data.permissions.includes(permissionId)
            ? data.permissions.filter((id) => id !== permissionId)
            : [...data.permissions, permissionId];
        setData("permissions", updatedPermissions);
    };

    // Organize permissions by module
    const organizedPermissions = permissions.reduce((acc, permission) => {
        if (!acc[permission.module_name]) {
            acc[permission.module_name] = [];
        }
        acc[permission.module_name].push(permission);
        return acc;
    }, {});

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <Head title={`Edit ${role.name}`} />
                <h1 className="text-2xl font-bold mb-6">Edit Role</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.name && (
                            <div className="text-red-600 text-sm mt-2">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    {/* Role Type Selection */}
                    <div className="mb-4">
                        <label
                            htmlFor="role_type"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Role Type
                        </label>
                        <select
                            id="role_type"
                            name="role_type"
                            value={data.role_type}
                            onChange={(e) => setData("role_type", e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select a role type</option>
                            <option value="administrator">Administrator</option>
                            <option value="lecturer">Lecturer</option>
                            <option value="student">Student</option>
                        </select>
                        {errors.role_type && (
                            <div className="text-red-600 text-sm mt-2">
                                {errors.role_type}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Permissions
                        </label>
                        {Object.keys(organizedPermissions).map((moduleName) => (
                            <div key={moduleName} className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {moduleName}
                                </h3>
                                {organizedPermissions[moduleName].map(
                                    (permission) => (
                                        <div
                                            key={permission.id}
                                            className="mt-1"
                                        >
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={permission.id}
                                                    checked={data.permissions.includes(
                                                        permission.id
                                                    )}
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            permission.id
                                                        )
                                                    }
                                                    className="rounded text-indigo-500 focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    {permission.name}
                                                </span>
                                            </label>
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Update
                    </button>
                </form>
                <Link
                    href={route("roles.index")}
                    className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Back to Roles
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
