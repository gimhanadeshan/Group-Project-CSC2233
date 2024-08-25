import React, { useState } from "react";
import { Link, useForm, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Index = ({ auth, degreePrograms }) => {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this degree program?")) {
            destroy(route("degree-programs.destroy", id));
        }
    };

    const filteredPrograms = degreePrograms.filter((program) =>
        program.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const canCreate = auth.permissions.includes("create_degree_program");
    const canEdit = auth.permissions.includes("update_degree_program");
    const canDelete = auth.permissions.includes("delete_degree_program");

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Degree Programs" />

            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Degree Programs</h1>
                {canCreate && (
                    <Link
                        href={route("degree-programs.create")}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md inline-block mb-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Create New Degree Program
                    </Link>
                )}
                
                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search degree programs..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>

                <div className="space-y-4">
                    {filteredPrograms.map((degreeProgram) => (
                        <div
                            key={degreeProgram.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    {degreeProgram.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {degreeProgram.description}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {canEdit && (
                                    <Link
                                        href={route(
                                            "degree-programs.edit",
                                            degreeProgram.id
                                        )}
                                        className=" text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </Link>
                                )}
                                {canDelete && (
                                    <button
                                        onClick={() =>
                                            handleDelete(degreeProgram.id)
                                        }
                                        className=" text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
