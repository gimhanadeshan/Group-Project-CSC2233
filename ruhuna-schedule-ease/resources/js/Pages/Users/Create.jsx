import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function CreateUsers({ auth, roles }) {
    const [commonData, setCommonData] = useState({
        role_id: "",
        academic_year: "",
        password: "",
    });
    const [users, setUsers] = useState([
        { name: "", email: "", registration_no: "" },
    ]);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleCommonInputChange = (e) => {
        const { name, value } = e.target;
        setCommonData({ ...commonData, [name]: value });
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const newUsers = [...users];
        newUsers[index][name] = value;
        setUsers(newUsers);
    };

    const addUser = () => {
        setUsers([...users, { name: "", email: "", registration_no: "" }]);
    };

    const removeUser = (index) => {
        const newUsers = [...users];
        newUsers.splice(index, 1);
        setUsers(newUsers);
    };

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setSuccessMessage("");
        setErrorMessage("");

        const formData = {
            commonData: commonData,
            users: users,
        };

        try {
            const response = await fetch("/users/storeMany", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": window.csrfToken, // Ensure CSRF token is sent
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(
                    errorResponse.message || "Failed to create users"
                );
            }

            const data = await response.json();
            console.log(data); // Handle success response as needed

            // Reset form after successful submission
            setCommonData({
                role_id: "",
                academic_year: "",
                password: "",
            });
            setUsers([{ name: "", email: "", registration_no: "" }]);
            setErrors({});
            setProcessing(false);
            setSuccessMessage("Users created successfully.");
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error.message || "Failed to create users. Please try again."
            );
            setProcessing(false);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Users" />

            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Create Users</h1>
                <Link
                    href={route("users.createFromImport")}
                    className="bg-green-600 text-white py-2 px-4 rounded-md inline-block mb-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Import Form Excel
                </Link>

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        <strong className="font-bold">Success!</strong>{" "}
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <strong className="font-bold">Error!</strong>{" "}
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="border rounded p-4 mb-6">
                        <h2 className="text-xl font-bold mb-4">
                            Common Details
                        </h2>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <InputLabel htmlFor="role_id" value="Role" />
                                <select
                                    id="role_id"
                                    name="role_id"
                                    value={commonData.role_id}
                                    onChange={handleCommonInputChange}
                                    className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors["commonData.role_id"]}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="academic_year"
                                    value="Academic Year"
                                />
                                <TextInput
                                    id="academic_year"
                                    name="academic_year"
                                    value={commonData.academic_year}
                                    onChange={handleCommonInputChange}
                                    className="mt-1 block w-full"
                                    autoComplete="academic_year"
                                    required
                                />
                                <InputError
                                    message={errors["commonData.academic_year"]}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Temporary Password"
                                />
                                <TextInput
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={commonData.password}
                                    onChange={handleCommonInputChange}
                                    className="mt-1 block w-full"
                                    autoComplete="password"
                                    required
                                />
                                <InputError
                                    message={errors["commonData.password"]}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border">
                                            Name
                                        </th>
                                        <th className="px-4 py-2 border">
                                            Email
                                        </th>
                                        <th className="px-4 py-2 border">
                                            Registration No
                                        </th>
                                        <th className="px-4 py-2 border">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="px-4 py-2 border">
                                                <TextInput
                                                    name="name"
                                                    value={user.name}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    className="mt-1 block w-full"
                                                    autoComplete="name"
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `users.${index}.name`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <TextInput
                                                    type="email"
                                                    name="email"
                                                    value={user.email}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    className="mt-1 block w-full"
                                                    autoComplete="username"
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `users.${index}.email`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <TextInput
                                                    name="registration_no"
                                                    value={user.registration_no}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    className="mt-1 block w-full"
                                                    autoComplete="registration_no"
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `users.${index}.registration_no`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeUser(index)
                                                    }
                                                    className="text-red-600 hover:text-red-700 focus:outline-none"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <button
                                type="button"
                                onClick={addUser}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Add Another User
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={processing || users.length === 0}
                            >
                                {processing ? "Creating..." : "Create Users"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
