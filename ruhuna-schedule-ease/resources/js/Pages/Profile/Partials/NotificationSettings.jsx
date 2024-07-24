import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Transition, Switch, Description, Field, Label } from '@headlessui/react';


export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const [smsN, setSMSEnabled] = useState(false);
    const [emailN, setEmailEnabled] = useState(false);
    const [pushN, setPushEnabled] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 ">Notifications</h2>

                <p className="mt-1 text-sm text-gray-600 mb-3">
                    Update your Notification Preferences.
                </p>
            </header>


            <div class="grid grid-flow-row-dense mt-1 gap-3 grid-cols-4 grid-rows-3 ...">
                <div class="col-span-2">Email</div>
                <div class="col-span-2">
                    <Switch
                        checked={smsN}
                        onChange={setSMSEnabled}
                        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
                    >
                        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                    </Switch>
                </div>


                <div class="col-span-2">SMS</div>
                <div class="col-span-2">
                    <Switch
                        checked={emailN}
                        onChange={setEmailEnabled}
                        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
                    >
                        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                    </Switch>
                </div>

                <div class="col-span-2">Push</div>
                <div class="col-span-2">
                    <Switch
                        checked={pushN}
                        onChange={setPushEnabled}
                        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
                    >
                        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                    </Switch>
                </div>



            </div>


        </section>
    );
}
