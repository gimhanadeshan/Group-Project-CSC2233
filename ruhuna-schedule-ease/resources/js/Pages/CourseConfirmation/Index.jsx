import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";


const UserRegisteredCourses = ({ auth }) => {
    const { userCourses } = usePage().props;
   

    const handleConfirmCourse = (courseCode) => {
        Inertia.post(`/course-confirmation/${courseCode}/confirm`, {}, {
            onSuccess: () => {
               
                console.log('Course confirmed successfully');
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    const handleCancelCourse = (courseCode) => {
        Inertia.delete(`/course-confirmation/${courseCode}/cancel`, {
            onSuccess: () => {
                setIsConfirmed(false);
                console.log('Course canceled successfully');
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="User Registered Courses" />
            <div>
                <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">User Registered Courses</h1>
                <table className="min-w-full divide-y divide-gray-300 bg-white mb-6">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                User Id
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
                    <tbody  className="bg-white divide-y divide-gray-200">
                        {userCourses.map((course) => (
                            <tr key={course.course.id}>
                                <td className="px-6 py-4 text-sm text-gray-700">{course.user_id}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{course.course.code}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{course.course.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 ">
                                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => handleConfirmCourse(course.course.code)}>
                                        Confirm
                                    </button>
                                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleCancelCourse(course.course.code)}>
                                        Cancel
                                    </button>
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
