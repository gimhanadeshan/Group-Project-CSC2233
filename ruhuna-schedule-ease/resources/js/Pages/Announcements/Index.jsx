import React from "react";
import { Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Index = ({ announcements, auth }) => {
    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <Head title="Announcements" />
                <h1 className="text-2xl font-bold mb-6">Announcements</h1>

                {auth.permissions.includes("create_announcement") && (
                    <Link
                        href={route("announcements.create")}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md inline-block mb-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Create New Announcement
                    </Link>
                )}
                <ul className="space-y-4">
                    {announcements.map((announcement) => (
                        <li
                            key={announcement.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        {announcement.title}
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        {announcement.body}
                                    </p>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    {auth.permissions.includes(
                                        "update_announcement"
                                    ) && (
                                        <Link
                                            href={route(
                                                "announcements.edit",
                                                announcement.id
                                            )}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </Link>
                                    )}

                                    {auth.permissions.includes(
                                        "delete_announcement"
                                    ) && (
                                        <form
                                            method="POST"
                                            action={route(
                                                "announcements.destroy",
                                                announcement.id
                                            )}
                                            className="inline"
                                        >
                                            <input
                                                type="hidden"
                                                name="_method"
                                                value="DELETE"
                                            />
                                            <button
                                                type="submit"
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
