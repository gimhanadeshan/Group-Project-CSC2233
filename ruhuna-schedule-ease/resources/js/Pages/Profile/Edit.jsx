import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import NotificationSettings from './Partials/NotificationSettings';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import UpdateProfilePhotoForm from './Partials/UpdateProfilePhotoForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="py-12">
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
        {/* Wrap both Profile Information and Profile Photo in a single box */}
        <div className="flex flex-col md:flex-row bg-white shadow sm:rounded-lg p-4 sm:p-8">
            <div className="md:w-1/2">
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                    className="max-w-xl"
                />
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 md:ml-10">
                <UpdateProfilePhotoForm
                    user={auth.user}
                    className="max-w-xl"
                />
            </div>
        </div>

        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <UpdatePasswordForm className="max-w-xl" />
        </div>

        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <NotificationSettings className="max-w-xl" />
        </div>
    </div>
</div>


        </AuthenticatedLayout>
    );
}
