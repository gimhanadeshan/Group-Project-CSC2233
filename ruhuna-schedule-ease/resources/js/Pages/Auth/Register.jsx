import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function Register() {
    const { roles } = usePage().props; // Fetch roles from props
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        registration_no: "",
        role_id: "",
        academic_year: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("register"));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

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
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
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

                <div className="mt-4">
                    <InputLabel htmlFor="academic_year" value="Academic Year" />

                    <TextInput
                        id="academic_year"
                        name="academic_year"
                        value={data.academic_year}
                        className="mt-1 block w-full"
                        autoComplete="academic_year"
                        onChange={(e) =>
                            setData("academic_year", e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.academic_year}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route("login")}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
