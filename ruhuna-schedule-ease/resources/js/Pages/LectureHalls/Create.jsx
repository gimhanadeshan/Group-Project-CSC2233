import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Create = ({ auth }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        capacity: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("lecture-halls.store"));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Lecture Hall" />
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Create Lecture Hall</h1>
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
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.name && (
                            <div className="text-red-600 text-sm mt-2">
                                {errors.name}
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="capacity"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Capacity
                        </label>
                        <input
                            id="capacity"
                            value={data.capacity}
                            onChange={(e) => setData("capacity", e.target.value)}
                            type="number"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.capacity && (
                            <div className="text-red-600 text-sm mt-2">
                                {errors.capacity}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={processing}
                    >
                        Create
                    </button>
                </form>
                <Link
                    href={route("lecture-halls.index")}
                    className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Back to Lecture Halls
                </Link>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
