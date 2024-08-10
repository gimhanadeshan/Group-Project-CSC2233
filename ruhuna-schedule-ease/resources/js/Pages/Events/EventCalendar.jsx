import React, { useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import "./bigCalendar.css";
import Modal from "react-modal";
import { useForm } from "@inertiajs/react";

const localizer = momentLocalizer(moment);

moment.updateLocale("en", {
    week: {
        dow: 1,
        doy: 1,
    },
});

const minTime = new Date(1970, 1, 1, 8, 0);
const maxTime = new Date(1970, 1, 1, 19, 0);

const EventCalendar = ({ allevents, auth }) => {
    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

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
        daily: false,
        weekly: false,
        monthly: false,
    });

    useEffect(() => {
        if (allevents) {
            const parsedEvents = allevents.map((event) => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
            }));
            setEvents(parsedEvents);
        }
    }, [allevents]);

    const openModal = (event = null) => {
        if (event) {
            setCurrentEvent(event);
            setData({
                event_title: event.event_title,
                location: event.location,
                start: moment(event.start).format("YYYY-MM-DDTHH:mm"),
                end: moment(event.end).format("YYYY-MM-DDTHH:mm"),
                daily: event.daily,
                weekly: event.weekly,
                monthly: event.monthly,
            });
        } else {
            setCurrentEvent(null);
            reset();
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSelectSlot = ({ start, end }) => {
        setData({
            event_title: "",
            location: "",
            start: moment(start).format("YYYY-MM-DDTHH:mm"),
            end: moment(end).format("YYYY-MM-DDTHH:mm"),
            daily: false,
            weekly: false,
            monthly: false,
        });
        setCurrentEvent(null);
        setModalIsOpen(true);
    };

    const handleSubmit = () => {
        if (currentEvent) {
            put(`/events/${currentEvent.id}`, {
                onSuccess: () => {
                    updateEventsState();
                    closeModal();
                },
            });
            closeModal();
        } else {
            put("/events", {
                onSuccess: () => {
                    updateEventsState();
                    closeModal();
                },
            });
            closeModal();
        }
    };

    const handleDelete = () => {
        if (!currentEvent) return;

        destroy(`/events/${currentEvent.id}`, {
            onSuccess: () => {
                updateEventsState();
                closeModal();
            },
        });
        closeModal();
    };

    const updateEventsState = () => {
        Inertia.reload({
            only: ["allevents"],
            onSuccess: ({ props }) => {
                const updatedEvents = props.allevents.map((event) => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end),
                }));
                setEvents(updatedEvents);
            },
        });
    };

    const CustomEvent = ({ event }) => {
        return (
            <span>
                <hr />
                <br />
                <strong>{event.event_title}</strong>
                <br />
                <br />
                <hr />
                <br />
                <em>{event.location}</em>
            </span>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <div style={{ height: "800px" }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    defaultView={"week"}
                    views={["month", "week", "day", "agenda"]}
                    formats={{
                        weekdayFormat: (date, culture, localizer) =>
                            localizer.format(date, "dddd", culture),
                    }}
                    max={maxTime}
                    min={minTime}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ margin: "50px" }}
                    selectable
                    onSelectEvent={openModal}
                    onSelectSlot={handleSelectSlot}
                    components={{
                        event: CustomEvent,
                    }}
                />
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Event Modal"
                className="fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 z-40"
            >
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">
                            {currentEvent ? "Edit Event" : "Add Event"}
                        </h2>
                        <button
                            className="bg-red-600 text-white py-2 px-4 rounded-md"
                            onClick={closeModal}
                        >
                            X
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Title:
                            </label>
                            <input
                                type="text"
                                value={data.event_title}
                                onChange={(e) =>
                                    setData("event_title", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.event_title && (
                                <div className="text-red-600">
                                    {errors.event_title}
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Location:
                            </label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) =>
                                    setData("location", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.location && (
                                <div className="text-red-600">
                                    {errors.location}
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Start Time:
                            </label>
                            <input
                                type="datetime-local"
                                value={data.start}
                                onChange={(e) =>
                                    setData("start", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.start && (
                                <div className="text-red-600">
                                    {errors.start}
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                End Time:
                            </label>
                            <input
                                type="datetime-local"
                                value={data.end}
                                onChange={(e) => setData("end", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.end && (
                                <div className="text-red-600">{errors.end}</div>
                            )}
                        </div>

                        {/* Recurrence Checkboxes */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Recurrence:
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.daily}
                                    onChange={(e) =>
                                        setData("daily", e.target.checked)
                                    }
                                    className="mr-2"
                                />
                                <span>Daily</span>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.weekly}
                                    onChange={(e) =>
                                        setData("weekly", e.target.checked)
                                    }
                                    className="mr-2"
                                />
                                <span>Weekly</span>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.monthly}
                                    onChange={(e) =>
                                        setData("monthly", e.target.checked)
                                    }
                                    className="mr-2"
                                />
                                <span>Monthly</span>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            {currentEvent && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="mr-4 bg-red-600 text-white py-2 px-4 rounded-md"
                                >
                                    Delete
                                </button>
                            )}
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-4 rounded-md"
                            >
                                {currentEvent ? "Update" : "Add"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
};

export default EventCalendar;
