import React from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";

const Index = () => {
    const { auth, courses, registrations, flash } = usePage().props;

    const handleRegister = (courseId) => {
        Inertia.post(route("course.register", { course: courseId }));
    };

    const handleConfirm = (registrationId) => {
        Inertia.post(
            route("course.registration.confirm", {
                registration: registrationId,
            })
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Course Registration" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* {flash.success && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="mb-4 text-sm font-medium text-red-600">
                        {flash.error}
                    </div>
                )} */}
                <h1 className="text-2xl font-bold mb-4">Courses</h1>
                <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Course Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {course.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() =>
                                                handleRegister(course.id)
                                            }
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Register
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-2xl font-bold mb-4 mt-6">Registrations</h2>
                <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Course
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {registrations.map((registration) => (
                                <tr key={registration.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {registration.user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {registration.course.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {registration.status}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {registration.status === "pending" && (
                                            <button
                                                onClick={() =>
                                                    handleConfirm(
                                                        registration.id
                                                    )
                                                }
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Confirm
                                            </button>
                                        )}
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
