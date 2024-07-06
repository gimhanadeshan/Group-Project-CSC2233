import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Edit = ({ role, auth }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("roles.update", role.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Roles" />
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
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
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.name && (
                            <div className="text-red-500 mt-1 text-sm">
                                {errors.name}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md inline-block hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={processing}
                    >
                        Update
                    </button>
                </form>
                <Link
                    href={route("roles.index")}
                    className="block mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-center hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Back to Roles
                </Link>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
