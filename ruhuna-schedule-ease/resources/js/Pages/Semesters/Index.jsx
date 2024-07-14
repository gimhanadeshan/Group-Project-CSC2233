import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Index = ({ semesters, auth }) => {
    const { data, setData, delete: deleteSemester } = useForm();

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this semester?")) {
            deleteSemester(route("semesters.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Semesters" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold">Semesters</h1>
                    <Link
                        href={route("semesters.create")}
                        className="inline-block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm"
                    >
                        Create Semester
                    </Link>
                </div>
                <div className="overflow-x-auto border-b border-gray-200 shadow sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
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
                                    Reference Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Start Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    End Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {semesters.map((semester) => (
                                <tr key={semester.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {semester.academic_year}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {semester.level}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {semester.semester}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {semester.reference_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {semester.start_date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {semester.end_date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            href={route(
                                                "semesters.edit",
                                                semester.id
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(semester.id)
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
};

export default Index;
