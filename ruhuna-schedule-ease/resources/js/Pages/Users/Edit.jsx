import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head } from "@inertiajs/react";

export default function Edit({ user, auth, roles, degreePrograms }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        registration_no: user.registration_no,
        role_id: user.role_id.toString(),
        academic_year: user.academic_year || "",
        degree_program_id: user.degree_program_id?.toString() || "",
    });

    const [yearOptions, setYearOptions] = useState([]);

    useEffect(() => {
        // Generate last 10 years for academic year dropdown
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
        setYearOptions(
            years.map((year) => ({ value: year, label: year.toString() }))
        );
    }, []);

    useEffect(() => {
        reset();
    }, [user]);

    const submit = (e) => {
        e.preventDefault();
        put(route("users.update", user.id));
    };

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title={`Edit ${user.name}`} />

            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Edit User</h1>

                <form onSubmit={submit}>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        autoFocus
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="registration_no"
                            value="Registration No"
                        />
                        <TextInput
                            id="registration_no"
                            name="registration_no"
                            value={data.registration_no}
                            className="mt-1 block w-full"
                            autoComplete="registration_no"
                            onChange={(e) =>
                                setData("registration_no", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.registration_no}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="role_id" value="Role" />
                        <select
                            id="role_id"
                            name="role_id"
                            value={data.role_id}
                            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                            onChange={(e) => setData("role_id", e.target.value)}
                            required
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.role_id} className="mt-2" />
                    </div>

                    {data.role_id === "2" && (
                        <>
                            {yearOptions.length > 0 && (
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="academic_year"
                                        value="Academic Year"
                                    />
                                    <select
                                        id="academic_year"
                                        name="academic_year"
                                        value={data.academic_year}
                                        className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                                        onChange={(e) =>
                                            setData(
                                                "academic_year",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select Academic Year
                                        </option>
                                        {yearOptions.map((year) => (
                                            <option
                                                key={year.value}
                                                value={year.value}
                                            >
                                                {year.label}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={errors.academic_year}
                                        className="mt-2"
                                    />
                                </div>
                            )}

                            {degreePrograms.length > 0 && (
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="degree_program_id"
                                        value="Degree Program"
                                    />
                                    <select
                                        id="degree_program_id"
                                        name="degree_program_id"
                                        value={data.degree_program_id}
                                        className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                                        onChange={(e) =>
                                            setData(
                                                "degree_program_id",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select Degree Program
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
                                    <InputError
                                        message={errors.degree_program_id}
                                        className="mt-2"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex items-center justify-end mt-6">
                        <PrimaryButton
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={processing}
                        >
                            {processing ? "Updating..." : "Update User"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
