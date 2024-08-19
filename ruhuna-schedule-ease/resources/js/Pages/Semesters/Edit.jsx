import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

const Edit = ({ auth, semester, degreePrograms}) => {
    const { data, setData, put, processing, errors } = useForm({
        academic_year: semester.academic_year || "",
        level: semester.level || "",
        semester: semester.semester || "",
        start_date: semester.start_date || "",
        end_date: semester.end_date || "",
        registration_start_date: semester.registration_start_date || "",
        registration_end_date: semester.registration_end_date || "",
        description: semester.description || "",
        degree_program_id: semester.degree_program_id || "",
    });

    useEffect(() => {
        // Set data when semester prop changes
        setData({ ...semester });
    }, [semester]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setData(id, type === "checkbox" ? checked : value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("semesters.update", semester.id));
    };

    const levels = ["Level 1", "Level 2", "Level 3", "Level 4"];
    const semesters = ["Semester 1", "Semester 2"];
    const currentYear = new Date().getFullYear();
    const academicYears = Array.from(
        { length: 10 },
        (_, index) => currentYear - index
    );

    const renderErrors = () => {
        if (!Object.keys(errors).length) return null;

        return (
            <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
            >
                <strong className="font-bold">
                    Whoops! Something went wrong.
                </strong>
                <ul className="mt-3 list-disc list-inside text-sm">
                    {Object.values(errors).map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
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
                                {renderErrors()}
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
                                        {errors.academic_year && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.academic_year}
                                            </div>
                                        )}
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
                                                    value={index + 1}
                                                >
                                                    {level}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.level && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.level}
                                            </div>
                                        )}
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
                                                        value={index + 1}
                                                    >
                                                        {semester}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        {errors.semester && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.semester}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="degree_program_id"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Degree Program
                                        </label>
                                        <select
                                            id="degree_program_id"
                                            name="degree_program_id"
                                            value={data.degree_program_id}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">
                                                Select a Degree Program
                                            </option>
                                            {degreePrograms.map((program) => (
                                                <option
                                                    key={program.id}
                                                    value={program.id}
                                                >
                                                    {program.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.degree_program_id && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.degree_program_id}
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
                                        {errors.start_date && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.start_date}
                                            </div>
                                        )}
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
                                        {errors.end_date && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.end_date}
                                            </div>
                                        )}
                                    </div>

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
                                            value={data.registration_start_date}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.registration_start_date && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.registration_start_date}
                                            </div>
                                        )}
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
                                            value={data.registration_end_date}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.registration_end_date && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.registration_end_date}
                                            </div>
                                        )}
                                    </div>                                    

                                    <div className="col-span-6">
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={handleChange}
                                            rows="3"
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.description && (
                                            <div className="text-red-600 text-sm mt-2">
                                                {errors.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Save
                                </button>
                                <Link
                                    href={route("semesters.index")}
                                    className="inline-flex ml-4 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
