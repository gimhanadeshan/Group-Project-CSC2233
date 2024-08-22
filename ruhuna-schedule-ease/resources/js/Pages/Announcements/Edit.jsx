import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const Edit = ({ announcement, auth }) => {
    const { data, setData, put, processing, errors } = useForm({
        title: announcement.title || '',
        body: announcement.body || '',
        start_date: announcement.start_date || '',
        start_time: announcement.start_time || '',
        expiration_date: announcement.expiration_date || '',
        expiration_time: announcement.expiration_time || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('announcements.update', announcement.id));
    };

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Edit Announcement" />
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Edit Announcement</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.title && (
                            <div className="text-red-600 text-sm mt-2">{errors.title}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                            Body
                        </label>
                        <textarea
                            id="body"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.body && (
                            <div className="text-red-600 text-sm mt-2">{errors.body}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <input
                            id="start_date"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                            type="date"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.start_date && (
                            <div className="text-red-600 text-sm mt-2">{errors.start_date}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                            Start Time
                        </label>
                        <input
                            id="start_time"
                            value={data.start_time}
                            onChange={(e) => setData('start_time', e.target.value)}
                            type="time"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.start_time && (
                            <div className="text-red-600 text-sm mt-2">{errors.start_time}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="expiration_date" className="block text-sm font-medium text-gray-700">
                            Expiration Date
                        </label>
                        <input
                            id="expiration_date"
                            value={data.expiration_date}
                            onChange={(e) => setData('expiration_date', e.target.value)}
                            type="date"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.expiration_date && (
                            <div className="text-red-600 text-sm mt-2">{errors.expiration_date}</div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="expiration_time" className="block text-sm font-medium text-gray-700">
                            Expiration Time
                        </label>
                        <input
                            id="expiration_time"
                            value={data.expiration_time}
                            onChange={(e) => setData('expiration_time', e.target.value)}
                            type="time"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.expiration_time && (
                            <div className="text-red-600 text-sm mt-2">{errors.expiration_time}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={processing}
                    >
                        Update
                    </button>
                </form>
                <Link
                    href={route('announcements.index')}
                    className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Back to Announcements
                </Link>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
