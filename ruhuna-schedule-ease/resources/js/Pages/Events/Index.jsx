import React, { useState } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

const localizer = momentLocalizer(moment);

const Index = () => {
    const { auth, allevents } = usePage().props;
    const [searchTitle, setSearchTitle] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [startFilter, setStartFilter] = useState("");
    const [endFilter, setEndFilter] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [events, setEvents] = useState(allevents); // State for the list of events
    const [selectedEvents, setSelectedEvents] = useState([]); // State for selected events
    const [selectAll, setSelectAll] = useState(false); // State for "Select All" checkbox

    const { data, setData, post, put,delete: destroy, reset, errors } = useForm({
        event_title: "",
        location: "",
        start: "",
        end: ""
    });

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsCreating(false);
        setData({
            event_title: event.event_title,
            location: event.location,
            start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
            end: moment(event.end).format('YYYY-MM-DDTHH:mm'),
        });
    };

    const handleCreateNewEvent = () => {
        setSelectedEvent(null);
        setIsCreating(true);
        reset();
    };

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isCreating) {
            put(route("events.store"), {
                onSuccess: () => {
                    setEvents([...events, data]);
                    reset();
                },
            });
        } else {
            put(route("events.update", selectedEvent.id), {
                onSuccess: () => {
                    const updatedEvents = events.map(event =>
                        event.id === selectedEvent.id ? data : event
                    );
                    setEvents(updatedEvents);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this event?")) {
            destroy(route("events.destroy", selectedEvent.id), {
                onSuccess: () => {
                    setEvents(events.filter(event => event.id !== selectedEvent.id));
                    setSelectedEvent(null);
                    
                }
            });
            reset();
        }
    };

    const handleSelectEvent = (id) => {
        setSelectedEvents(prev => {
            const isSelected = prev.includes(id);
            if (isSelected) {
                return prev.filter(eventId => eventId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEvents([]);
        } else {
            setSelectedEvents(filteredEvents.map(event => event.id));
        }
        setSelectAll(!selectAll);
    };

    const handleDeleteSelected = () => {
        if (confirm("Are you sure you want to delete all selected events?")) {
            selectedEvents.forEach(id => {
                Inertia.delete(route("events.destroy", id), {
                    onSuccess: () => {
                        setEvents(events.filter(event => event.id !== id));
                    }
                });
            });
            setSelectedEvents([]);
            setSelectAll(false);
        }
    };

    const filteredEvents = allevents.filter(event => {
        return (
            event.event_title.toLowerCase().includes(searchTitle.toLowerCase()) &&
            event.location.toLowerCase().includes(searchLocation.toLowerCase()) &&
            (startFilter === "" || new Date(event.start) >= new Date(startFilter)) &&
            (endFilter === "" || new Date(event.end) <= new Date(endFilter))
        );
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Events" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h1 className="text-lg font-bold leading-6 text-gray-900">
                            Events
                        </h1>
                        <button
                            onClick={handleCreateNewEvent}
                            className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create New Event
                        </button>
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
                    </div>
                    <div className="flex border border-gray-300 rounded-md">
                        <div className="w-1/3 p-4 border-r border-gray-300">
                            {filteredEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center cursor-pointer hover:bg-gray-200 p-2"
                                    onClick={() => handleEventClick(event)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedEvents.includes(event.id)}
                                        onChange={() => handleSelectEvent(event.id)}
                                        className="mr-2"
                                    />
                                    {event.event_title}
                                </div>
                            ))}
                        </div>
                        <div className="w-2/3 p-4">
                            {(selectedEvent || isCreating) && (
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="event_title" className="block text-sm font-medium text-gray-700">
                                            Event Title
                                        </label>
                                        <input
                                            type="text"
                                            name="event_title"
                                            value={data.event_title}
                                            onChange={handleChange}
                                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.event_title && <div className="text-red-500 text-xs">{errors.event_title}</div>}
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={data.location}
                                            onChange={handleChange}
                                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.location && <div className="text-red-500 text-xs">{errors.location}</div>}
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                                            Start
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="start"
                                            value={moment(data.start).format('YYYY-MM-DDTHH:mm')}
                                            onChange={handleChange}
                                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.start && <div className="text-red-500 text-xs">{errors.start}</div>}
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="end" className="block text-sm font-medium text-gray-700">
                                            End
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="end"
                                            value={moment(data.end).format('YYYY-MM-DDTHH:mm')}
                                            onChange={handleChange}
                                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.end && <div className="text-red-500 text-xs">{errors.end}</div>}
                                    </div>
                                    <div className="mt-4 flex space-x-4">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            {isCreating ? "Create Event" : "Update Event"}
                                        </button>
                                        {!isCreating && (
                                            <Link
                                                href={route(
                                                    "events.destroy",
                                                    selectedEvent.id
                                                )}
                                                method="delete"
                                                as="button"
                                                className="ml-4 text-red-600 hover:text-red-900"
                                            >
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    onClick={handleDelete}
                                                >
                                                    Delete
                                                </button>
                                            </Link>
                                        )}
                                    </div>
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
