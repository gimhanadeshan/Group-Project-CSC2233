import React, { useState } from "react";
import { Link, useForm, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Index = ({ auth, lectureHalls }) => {
    const { delete: destroy } = useForm();
    const [searchQuery, setSearchQuery] = useState("");
    const [minCapacity, setMinCapacity] = useState("");
    const [maxCapacity, setMaxCapacity] = useState("");

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this lecture hall?")) {
            destroy(route("lecture-halls.destroy", id));
        }
    };

    const canCreate = auth.permissions.includes("create_lecture_hall");
    const canEdit = auth.permissions.includes("update_lecture_hall");
    const canDelete = auth.permissions.includes("delete_lecture_hall");

    const filteredLectureHalls = lectureHalls.filter((hall) => {
        const matchesSearch =
            hall.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMinCapacity =
            !minCapacity || hall.capacity >= parseInt(minCapacity);
        const matchesMaxCapacity =
            !maxCapacity || hall.capacity <= parseInt(maxCapacity);
        return matchesSearch && matchesMinCapacity && matchesMaxCapacity;
    });

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Lecture Halls" />

            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Lecture Halls</h1>
                {canCreate && (
                    <Link
                        href={route("lecture-halls.create")}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md inline-block mb-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Create New Lecture Hall
                    </Link>
                )}
                <div className="mb-6 flex gap-4">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full"
                    />
                    <input
                        type="number"
                        placeholder="Min Capacity"
                        value={minCapacity}
                        onChange={(e) => setMinCapacity(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full"
                    />
                    <input
                        type="number"
                        placeholder="Max Capacity"
                        value={maxCapacity}
                        onChange={(e) => setMaxCapacity(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full"
                    />
                </div>
                <div className="overflow-x-auto">
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
                                    Capacity
                                </th>
                                {(canEdit || canDelete) && (
                                    <th
                                        scope="col"
                                        className="relative px-6 py-3"
                                    >
                                        <span className="sr-only">Actions</span>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLectureHalls.map((hall) => (
                                <tr key={hall.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {hall.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {hall.capacity}
                                    </td>
                                    {(canEdit || canDelete) && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {canEdit && (
                                                <Link
                                                    href={route(
                                                        "lecture-halls.edit",
                                                        hall.id
                                                    )}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(hall.id)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
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
};

export default Index;
