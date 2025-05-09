import React from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Edit = ({ auth }) => {
    const { permission } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        module_name: permission.module_name,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("permissions.update", permission.id));
    };

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title={`Edit ${permission.name}`} />
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">
                    Edit Permission: {permission.name}
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="module_name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Module Name
                        </label>
                        <input
                            id="module_name"
                            value={data.module_name}
                            onChange={(e) =>
                                setData("module_name", e.target.value)
                            }
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        {errors.module_name && (
                            <div className="text-red-600 text-sm mt-2">
                                {errors.module_name}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={processing}
                    >
                        Update
                    </button>
                </form>
                <Link
                    href={route("permissions.index")}
                    className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Back to Permissions
                </Link>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
