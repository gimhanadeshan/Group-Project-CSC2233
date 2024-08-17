import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function EventDetails({ auth, event }) {
    const [eventData, setEventData] = useState(event[0]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setEventData(event[0]);
    }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        console.log(eventData.attended);
        e.preventDefault();
        setLoading(true);
        setErrors({});

        //const { user_id, course_id, semester_id, lec_id, hall_id } = eventData;

        Inertia.put(`/events/view/${eventData.id}`, eventData, {
            onSuccess: () => {
                // Optionally, handle success, e.g., redirect or show a success message
            },
            onError: (errors) => {
                // Handle validation errors
                setErrors(errors);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <>
            <Head title="EventDetails" />
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">EventDetails</h2>}
                permissions={auth.permissions}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="event_title" className="block text-sm font-medium text-gray-700">Event Title</label>
                        <input
                            type="text"
                            id="event_title"
                            name="event_title"
                            value={eventData.event_title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.event_title && <p className="text-red-600 text-sm">{errors.event_title}</p>}
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={eventData.location}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.location && <p className="text-red-600 text-sm">{errors.location}</p>}
                    </div>

                    <div>
                        <label htmlFor="start" className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                        <input
                            type="datetime-local"
                            id="start"
                            name="start"
                            value={eventData.start}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.start && <p className="text-red-600 text-sm">{errors.start}</p>}
                    </div>

                    <div>
                        <label htmlFor="end" className="block text-sm font-medium text-gray-700">End Date & Time</label>
                        <input
                            type="datetime-local"
                            id="end"
                            name="end"
                            value={eventData.end}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.end && <p className="text-red-600 text-sm">{errors.end}</p>}
                    </div>

                    <div>
                        <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">User</label>
                        <input
                            type="text"
                            id="user_id"
                            name="user_id"
                            value={eventData.user_id}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.user_id && <p className="text-red-600 text-sm">{errors.user_id}</p>}
                    </div>

                    <div>
                        <label htmlFor="course_id" className="block text-sm font-medium text-gray-700">Course</label>
                        <input
                            type="text"
                            id="course_id"
                            name="course_id"
                            value={eventData.course_id}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.course_id && <p className="text-red-600 text-sm">{errors.course_id}</p>}
                    </div>

                    <div>
                        <label htmlFor="semester_id" className="block text-sm font-medium text-gray-700">Semester</label>
                        <input
                            type="text"
                            id="semester_id"
                            name="semester_id"
                            value={eventData.semester_id}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.semester_id && <p className="text-red-600 text-sm">{errors.semester_id}</p>}
                    </div>

                    <div>
                        <label htmlFor="lec_id" className="block text-sm font-medium text-gray-700">Lecturer</label>
                        <input
                            type="text"
                            id="lec_id"
                            name="lec_id"
                            value={eventData.lec_id}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.lec_id && <p className="text-red-600 text-sm">{errors.lec_id}</p>}
                    </div>

                    <div>
                        <label htmlFor="hall_id" className="block text-sm font-medium text-gray-700">Lecture Hall</label>
                        <input
                            type="text"
                            id="hall_id"
                            name="hall_id"
                            value={eventData.hall_id}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.hall_id && <p className="text-red-600 text-sm">{errors.hall_id}</p>}
                    </div>

                    <div>
    <label htmlFor="attended" className="block text-sm font-medium text-gray-700">Attended</label>
    <input
        type="checkbox"
        id="attended"
        name="attended"
        checked={!!eventData.attended} // Convert null to false for the checkbox
        onChange={(e) =>
            
            setEventData((prevData) => ({
                ...prevData,
                attended: e.target.checked || null, // If unchecked, set to null
            }))
            
        }
        className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
    {errors.attended && <p className="text-red-600 text-sm">{errors.attended}</p>}
</div>


                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </AuthenticatedLayout>
        </>
    );
}
