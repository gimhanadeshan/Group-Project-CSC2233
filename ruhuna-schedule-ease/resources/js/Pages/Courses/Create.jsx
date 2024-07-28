import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Create = ({ auth }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        code: "",
        theory_hours: "",
        practical_hours: "",
        tutorial_hours: "",
        credit_hours: "",
        description: "",
        is_core: false,
        level: "",
        semester: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "code") {
            const level = value[3] ? parseInt(value[3]) : "";
            const semester = value[4] ? parseInt(value[4]) : "";
            setData({ ...data, code: value, level, semester });
        } else {
            setData(name, type === "checkbox" ? checked : value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("courses.store"));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Course" />
            <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h1 className="text-lg font-bold leading-6 text-gray-900">
                            Create Course
                        </h1>
                    </div>
                    <div className="border-t border-gray-200">
                        <form onSubmit={handleSubmit}>
                            <div className="px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.name && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="code"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Code
                                        </label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={data.code}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.code && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.code}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="level"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Level
                                        </label>
                                        <input
                                            type="number"
                                            name="level"
                                            value={data.level}
                                            onChange={handleChange}
                                            readOnly
                                            className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="semester"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Semester
                                        </label>
                                        <input
                                            type="number"
                                            name="semester"
                                            value={data.semester}
                                            onChange={handleChange}
                                            readOnly
                                            className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="theory_hours"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Theory Hours(For One TimeSlot)
                                        </label>
                                        <input
                                            type="number"
                                            name="theory_hours"
                                            value={data.theory_hours}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="practical_hours"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Practical Hours(For One TimeSlot)
                                        </label>
                                        <input
                                            type="number"
                                            name="practical_hours"
                                            value={data.practical_hours}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="tutorial_hours"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Tutorial Hours(For One TimeSlot)
                                        </label>
                                        <input
                                            type="number"
                                            name="tutorial_hours"
                                            value={data.tutorial_hours}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="credit_hours"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Credit Hours
                                        </label>
                                        <input
                                            type="number"
                                            name="credit_hours"
                                            value={data.credit_hours}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.credit_hours && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.credit_hours}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-6">
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={data.description}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="is_core"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Core Course
                                        </label>
                                        <input
                                            type="checkbox"
                                            name="is_core"
                                            checked={data.is_core}
                                            onChange={handleChange}
                                            className="mt-1 block"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 text-right sm:px-6">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={processing}
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="px-4 py-3 text-left sm:px-6">
                        <Link
                            href={route("courses.index")}
                            className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Back to Courses
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
