import React from "react";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const SemesterProgressReport = ({ auth, semester, courses }) => {
    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Semester Details" />
            <div className="p-8 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Semester Progress Report
                </h2>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-700">
                        Academic Year: <span className="text-gray-900">{semester.academic_year}</span>
                    </h3>
                    <p className="text-gray-600">
                        Degree Program: <span className="text-gray-800">{semester.degree_program.name}</span>
                    </p>
                    <p className="text-gray-600">
                        Level: <span className="text-gray-800">{semester.level}</span>
                    </p>
                    <p className="text-gray-600">
                        Semester: <span className="text-gray-800">{semester.semester}</span>
                    </p>
                </div>

                <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-700 mb-4">
                        Course-wise Progress
                    </h4>
                    {courses.map((course, index) => (
                        <div key={index} className="mb-6 p-6 bg-gray-100 rounded-lg shadow-sm">
                            <h5 className="text-lg font-semibold text-gray-800 mb-2">
                                {course.course}
                            </h5>
                            <p className="text-gray-600">
                                Total Events: <span className="text-gray-800">{course.totalEvents}</span>
                            </p>
                            <p className="text-gray-600">
                                Attended Events: <span className="text-gray-800">{course.attendedEvents}</span>
                            </p>
                            <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
                                <div
                                    className={`h-4 rounded-full ${course.progressPercentage > 75 ? 'bg-green-600' : course.progressPercentage > 50 ? 'bg-yellow-500' : 'bg-red-600'}`}
                                    style={{
                                        width: `${course.progressPercentage}%`,
                                    }}
                                ></div>
                            </div>
                            <p className="text-gray-600">
                                Progress: <span className="font-semibold text-gray-900">{course.progressPercentage}%</span>
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Link href="/semesters" className="text-blue-600 font-semibold hover:underline">
                        Back to Semesters
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SemesterProgressReport;
