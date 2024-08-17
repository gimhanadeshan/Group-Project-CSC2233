import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const UserRegisteredCourses = ({ auth, userCourses }) => {
    const { data, setData, post, processing } = useForm({
        course_id: "",
    });

    //console.log(userCourses);

    const handleConfirmCourse = (courseCode) => {
        setData("course_id", courseCode);
        post(route("course-confirmation.confirm", { courseCode }), {
            preserveScroll: true,
        });
    };

    const handleCancelCourse = (courseCode) => {
        setData("course_id", courseCode);
        post(route("course-confirmation.cancel", { courseCode }), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="User Registered Courses" />
            <div>
                <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
                    User Registered Courses
                </h1>

                <table className="min-w-full divide-y divide-gray-300 bg-white mb-6">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Student
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Course Code
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Course Name
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {userCourses.map((course) => (
                            <tr key={course.course.id}>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {course.user.registration_no}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {course.course.code}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {course.course.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {course.status === "confirmed" ? (
                                        <button
                                            className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${
                                                processing
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleCancelCourse(
                                                    course.course.code
                                                )
                                            }
                                            disabled={processing}
                                        >
                                            Cancel
                                        </button>
                                    ) : (
                                        <button
                                            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 ${
                                                processing
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleConfirmCourse(
                                                    course.course.code
                                                )
                                            }
                                            disabled={processing}
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
        </AuthenticatedLayout>
    );
};

export default UserRegisteredCourses;
