import React, { useState } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import moment from "moment";

const Index = ({ auth, permissions, allevents, semesters, courses, halls, lecturers, users, courseTypes }) => {
    const [searchTitle, setSearchTitle] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [startFilter, setStartFilter] = useState("");
    const [endFilter, setEndFilter] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [events, setEvents] = useState(allevents);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        reset,
        errors,
    } = useForm({
        event_title: "",
        location: "",
        start: "",
        end: "",
        semester_id: "",
        course_id: "",
        hall_id: "",
        lec_id: "",
        user_id: "",
        course_type: "",
    });

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsCreating(false);
        setData({
            event_title: event.event_title,
            location: event.location,
            start: moment(event.start).format("YYYY-MM-DDTHH:mm"),
            end: moment(event.end).format("YYYY-MM-DDTHH:mm"),
            semester_id: event.semester_id,
            course_id: event.course_id,
            hall_id: event.hall_id,
            lec_id: event.lec_id,
            user_id: event.user_id,
            course_type: event.course_type,
        });
    };

    const handleCreateNewEvent = () => {
        setSelectedEvent(null);
        setIsCreating(true);
        reset();
    };

    // const handleChange = (e) => {
    //     setData(e.target.name, e.target.value);
    // };
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    
    //     if (name === 'hall_id') {
    //         const selectedHall = halls.find(hall => hall.id === parseInt(value));
    //         setData({
    //             ...data,
    //             hall_id: selectedHall ? selectedHall.id : '',
    //             // If location is empty, update it with hall name
    //             location: data.location ? data.location : (selectedHall ? selectedHall.name : ''),
    //         });
    //     } else {
    //         setData({
    //             ...data,
    //             [name]: value,
    //         });
    //     }
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'hall_id') {
            const selectedHall = halls.find(hall => hall.id === parseInt(value));
            setData({
                ...data,
                hall_id: selectedHall ? selectedHall.id : '',
                location: selectedHall ? selectedHall.name : '', // Update location with hall name
            });
        } else {
            setData({
                ...data,
                [name]: value,
            });
        }
    };
    
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const submitAction = isCreating ? post : put;
        const routePath = isCreating ? route("events.store") : route("events.update", selectedEvent.id);

        submitAction(routePath, {
            data,
            onSuccess: () => {
                if (isCreating) {
                    setEvents([...events, data]);
                } else {
                    setEvents(events.map((event) =>
                        event.id === selectedEvent.id ? data : event
                    ));
                }
                isCreating ?  console.log('') : reset();
            },
        });
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this event?")) {
            destroy(route("events.destroy", selectedEvent.id), {
                onSuccess: () => {
                    setEvents(events.filter((event) => event.id !== selectedEvent.id));
                    setSelectedEvent(null);
                },
            });
            reset();
        }
    };

    const handleSelectEvent = (id) => {
        setSelectedEvents((prev) =>
            prev.includes(id) ? prev.filter((eventId) => eventId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEvents([]);
        } else {
            setSelectedEvents(filteredEvents.map((event) => event.id));
        }
        setSelectAll(!selectAll);
    };

    const handleDeleteSelected = () => {
        if (confirm("Are you sure you want to delete all selected events?")) {
            Inertia.delete(route('events.destroy', selectedEvents), {
                onSuccess: () => {
                    setEvents(events.filter((event) => !selectedEvents.includes(event.id)));
                    setSelectedEvents([]);
                    setSelectAll(false);
                },
            });
        }
    };

    const filteredEvents = allevents.filter((event) => {
        return (
            event.event_title
                .toLowerCase()
                .includes(searchTitle.toLowerCase()) &&
            event.location
                .toLowerCase()
                .includes(searchLocation.toLowerCase()) &&
            (startFilter === "" || new Date(event.start) >= new Date(startFilter)) &&
            (endFilter === "" || new Date(event.end) <= new Date(endFilter))
        );
    });

    const canCreate = auth.permissions.includes("create_event");
    const canEdit = auth.permissions.includes("update_event");
    const canDelete = auth.permissions.includes("delete_event");

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <Head title="Events" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h1 className="text-lg font-bold leading-6 text-gray-900">
                            Events
                        </h1>
                        {canCreate && (
                            <>
                            <button
                                onClick={handleCreateNewEvent}
                                className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create New Event
                            </button>
                            {selectedEvent && <Link href={route("events.generateAttendanceRecords",selectedEvent.id)}>Generate Attendace Records</Link>}
                            </>
                        )}
                        <br />
                    </div>
                    <div className="px-4 py-5 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search by title"
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                            type="text"
                            placeholder="Search by location"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                            type="datetime-local"
                            placeholder="Start time filter"
                            value={startFilter}
                            onChange={(e) => setStartFilter(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                            type="datetime-local"
                            placeholder="End time filter"
                            value={endFilter}
                            onChange={(e) => setEndFilter(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="px-4 py-5 sm:px-6 flex items-center space-x-4">
                        {canEdit && (
                            <>
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="mr-2"
                                />
                                <span>Select All</span>
                                <button
                                    onClick={handleDeleteSelected}
                                    className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Delete All Selected
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex border border-gray-300 rounded-md">
                        <div className="w-1/3 p-4 border-r border-gray-300">
                            {filteredEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center cursor-pointer hover:bg-gray-200 p-2"
                                    onClick={() => handleEventClick(event)}
                                >
                                    {canEdit && (
                                        <input
                                            type="checkbox"
                                            checked={selectedEvents.includes(event.id)}
                                            onChange={() => handleSelectEvent(event.id)}
                                            className="mr-2"
                                        />
                                    )}
                                    {event.event_title}
                                </div>
                            ))}
                        </div>
                        <div className="w-2/3 p-4">
                            {(selectedEvent || isCreating) && (
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label
                                            htmlFor="event_title"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Event Title
                                        </label>
                                        <input
                                            type="text"
                                            name="event_title"
                                            value={data.event_title}
                                            onChange={handleChange}
                                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.event_title && (
                                            <span className="text-red-500 text-sm">{errors.event_title}</span>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="location"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={data.location}
                                            onChange={handleChange}
                                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.location && (
                                            <span className="text-red-500 text-sm">{errors.location}</span>
                                        )}
                                    </div>
                                    {auth.user.role.role_type!=='student' && 
                                    <>
                                    <div>
                                        <label
                                            htmlFor="hall_id"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Hall
                                        </label>
                                        <select
                                            name="hall_id"
                                            value={data.hall_id}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select Hall</option>
                                            {halls.map((hall) => (
                                                <option key={hall.id} value={hall.id}>
                                                    {hall.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.hall_id && (
                                            <span className="text-red-500 text-sm">{errors.hall_id}</span>
                                        )}
                                    </div>
                                    </>}
                                    <div>
                                        <label
                                            htmlFor="start"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Start Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="start"
                                            value={data.start}
                                            onChange={handleChange}
                                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.start && (
                                            <span className="text-red-500 text-sm">{errors.start}</span>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="end"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            End Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="end"
                                            value={data.end}
                                            onChange={handleChange}
                                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.end && (
                                            <span className="text-red-500 text-sm">{errors.end}</span>
                                        )}
                                    </div>
                                    {auth.user.role.role_type!=='student' && 
                                    <>
                                    <div>
                                        <label
                                            htmlFor="semester_id"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Semester
                                        </label>
                                        <select
                                            name="semester_id"
                                            value={data.semester_id}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select Semester</option>
                                            {semesters.map((semester) => (
                                                <option key={semester.id} value={semester.id}>
                                                    {semester.id}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.semester_id && (
                                            <span className="text-red-500 text-sm">{errors.semester_id}</span>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="course_id"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Course
                                        </label>
                                        <select
                                            name="course_id"
                                            value={data.course_id}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map((course) => (
                                                <option key={course.id} value={course.id}>
                                                    {course.code}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.course_id && (
                                            <span className="text-red-500 text-sm">{errors.course_id}</span>
                                        )}
                                    </div>
{/* 
                                    <div>
                                        <label
                                            htmlFor="hall_id"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Hall
                                        </label>
                                        <select
                                            name="hall_id"
                                            value={data.hall_id}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select Hall</option>
                                            {halls.map((hall) => (
                                                <option key={hall.id} value={hall.id}>
                                                    {hall.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.hall_id && (
                                            <span className="text-red-500 text-sm">{errors.hall_id}</span>
                                        )}
                                    </div> */}

                                    <div>
                                        <label
                                            htmlFor="lec_id"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Lecturer
                                        </label>
                                        <select
                                            name="lec_id"
                                            value={data.lec_id}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select Lecturer</option>
                                            {lecturers.map((lecturer) => (
                                                <option key={lecturer.id} value={lecturer.id}>
                                                    {lecturer.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.lec_id && (
                                            <span className="text-red-500 text-sm">{errors.lec_id}</span>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="user_id"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            User
                                        </label>
                                        <select
                                            name="user_id"
                                            value={data.user_id}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select User</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.user_id && (
                                            <span className="text-red-500 text-sm">{errors.user_id}</span>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="course_type"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Course Type
                                        </label>
                                        <select
                                            name="course_type"
                                            value={data.course_type}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select Course Type</option>
                                            {courseTypes.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.type}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.course_type && (
                                            <span className="text-red-500 text-sm">{errors.course_type}</span>
                                        )}
                                    </div>

                                    <div className="flex space-x-4 mt-4">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            {isCreating ? "Create Event" : "Update Event"}
                                        </button>
                                        {!isCreating && (
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                Delete Event
                                            </button>
                                        )}
                                    </div>
                                    </>}
                                </form>
                                
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
