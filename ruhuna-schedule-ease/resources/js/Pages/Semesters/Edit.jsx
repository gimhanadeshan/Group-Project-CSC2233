import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Edit = ({ auth, semester }) => {
    const { data, setData, put, processing, errors } = useForm({
        academic_year: semester.academic_year,
        level: semester.level,
        semester: semester.semester,
        name: semester.name,
        start_date: semester.start_date,
        end_date: semester.end_date,
        registration_start_date: semester.registration_start_date,
        registration_end_date: semester.registration_end_date,
        course_registration_open: semester.course_registration_open,
    });

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setData(id, type === "checkbox" ? checked : value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("semesters.update", semester.id));
    };

    // Options for select dropdowns
    const levels = ["Level 1", "Level 2", "Level 3", "Level 4"];
    const semesters = ["Semester 1", "Semester 2"];
    const currentYear = new Date().getFullYear();
    const academicYears = Array.from(
        { length: 10 },
        (_, index) => currentYear - index
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Semester" />
            <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h1 className="text-lg font-bold leading-6 text-gray-900">
                            Edit Semester
                        </h1>
                    </div>
                    <div className="border-t border-gray-200">
                        <form onSubmit={handleSubmit}>
                            <div className="px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="academic_year"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Academic Year
                                        </label>
                                        <select
                                            id="academic_year"
                                            name="academic_year"
                                            value={data.academic_year}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">
                                                Select Academic Year
                                            </option>
                                            {academicYears.map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="level"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Level
                                        </label>
                                        <select
                                            id="level"
                                            name="level"
                                            value={data.level}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">
                                                Select Level
                                            </option>
                                            {levels.map((level, index) => (
                                                <option
                                                    key={index}
                                                    value={level}
                                                >
                                                    {level}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="semester"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Semester
                                        </label>
                                        <select
                                            id="semester"
                                            name="semester"
                                            value={data.semester}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">
                                                Select Semester
                                            </option>
                                            {semesters.map(
                                                (semester, index) => (
                                                    <option
                                                        key={index}
                                                        value={semester}
                                                    >
                                                        {semester}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Remarks
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.name && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="start_date"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            id="start_date"
                                            name="start_date"
                                            value={data.start_date}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="end_date"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            id="end_date"
                                            name="end_date"
                                            value={data.end_date}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    {data.course_registration_open && (
                                        <>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="registration_start_date"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Registration Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    id="registration_start_date"
                                                    name="registration_start_date"
                                                    value={
                                                        data.registration_start_date
                                                    }
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    required
                                                />
                                            </div>

                                            <div className="col-span-6 sm:col-span-3">
                                                <label
                                                    htmlFor="registration_end_date"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Registration End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    id="registration_end_date"
                                                    name="registration_end_date"
                                                    value={
                                                        data.registration_end_date
                                                    }
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="col-span-6 sm:col-span-3">
                                        <div className="flex items-center">
                                            <input
                                                id="course_registration_open"
                                                name="course_registration_open"
                                                type="checkbox"
                                                checked={
                                                    data.course_registration_open
                                                }
                                                onChange={handleChange}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <label
                                                htmlFor="course_registration_open"
                                                className="ml-2 block text-sm font-medium text-gray-700"
                                            >
                                                Open Course Registration
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 text-right sm:px-6">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={processing}
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                        <div className="px-4 py-3 text-left sm:px-6">
                            <Link
                                href={route("semesters.index")}
                                className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Back to Semesters
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
