import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head } from "@inertiajs/react";

export default function CreateFromImport({ auth, roles }) {
    const [file, setFile] = useState(null);
    const [academicYear, setAcademicYear] = useState("");
    const [temporaryPassword, setTemporaryPassword] = useState("");
    const [roleId, setRoleId] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [importedUsers, setImportedUsers] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("academic_year", academicYear);
        formData.append("temporary_password", temporaryPassword);
        formData.append("role_id", roleId);

        try {
            const response = await fetch("/import-users", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                    "X-CSRF-TOKEN": window.csrfToken,
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(
                    errorResponse.message || "Error importing users"
                );
            }

            const data = await response.json();
            setSuccessMessage(data.message);
            setError(null);
            setImportedUsers(data.users);
        } catch (error) {
            setError(
                error.message || "Error importing users. Please try again."
            );
            setSuccessMessage(null);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Import Users" />

            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">
                    Import Users from Excel
                </h1>

                {error && (
                    <div className="text-red-600 mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="text-green-600 mb-4">
                        <p>{successMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="academic_year"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Academic Year
                        </label>
                        <input
                            type="text"
                            id="academic_year"
                            name="academic_year"
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="temporary_password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Temporary Password
                        </label>
                        <input
                            type="password"
                            id="temporary_password"
                            name="temporary_password"
                            value={temporaryPassword}
                            onChange={(e) =>
                                setTemporaryPassword(e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="role_id"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Role
                        </label>
                        <select
                            id="role_id"
                            name="role_id"
                            value={roleId}
                            className="mt-1 block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                            onChange={(e) => setRoleId(e.target.value)}
                            required
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="file"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Upload Excel file
                        </label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <PrimaryButton
                        type="submit"
                        className="w-full"
                        disabled={!file}
                    >
                        Import Users
                    </PrimaryButton>
                </form>

                {importedUsers.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-4">
                            Imported Users
                        </h2>
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border">Name</th>
                                    <th className="px-4 py-2 border">Email</th>
                                    <th className="px-4 py-2 border">
                                        Registration No
                                    </th>
                                    <th className="px-4 py-2 border">
                                        Role ID
                                    </th>
                                    <th className="px-4 py-2 border">
                                        Academic Year
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {importedUsers.map((user, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-2 border">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {user.registration_no}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {user.role_id}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {user.academic_year}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
