import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Show = ({ auth, semester }) => {
    const { errors } = usePage().props;

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Semester Details" />
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h1 className="text-lg font-bold leading-6 text-gray-900">
                            Semester Details
                        </h1>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl className="px-4 py-5 sm:px-6">
                            <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Academic Year
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {semester.academic_year}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Level
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {semester.level}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Semester
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {semester.semester}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Degree Program
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {semester.degree_program
                                            ? semester.degree_program.name
                                            : "No degree program assigned"}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Start Date
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {semester.start_date}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        End Date
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {semester.end_date}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Registration Start Date
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {semester.registration_start_date}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Registration End Date
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {semester.registration_end_date}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Status
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {semester.status}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Description
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {semester.description ||
                                            "No description available"}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                        <div className="px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:justify-start gap-4">
                            <Link
                                href={route("semesters.index")}
                                className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Back to Semesters
                            </Link>
                            <Link
                                href={route("semesters.edit", semester.id)}
                                className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Edit Semester
                            </Link>
                            <Link
                                href={route(
                                    "semesters.progressReport",
                                    semester.id
                                )}
                                className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Progress Report
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
