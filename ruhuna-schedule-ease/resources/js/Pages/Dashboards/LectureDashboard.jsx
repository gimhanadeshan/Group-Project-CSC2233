import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TimeTable from './TimeTable';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import React, { useState, useEffect } from 'react';

const localizer = momentLocalizer(moment);

// Configure moment to start the week on Monday
moment.updateLocale('en', {
    week: {
        dow: 1, // Monday is the first day of the week
        doy: 1, 
    },
});

// Define min and max times
const minTime = new Date(1970, 1, 1, 8, 0); // 8:00 AM
const maxTime = new Date(1970, 1, 1, 19, 0); // 6:00 PM


export default function LectureDashboard({ auth ,allevents}) {




    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventTitle, setEventTitle] = useState('');
    const [selectEvent, setSelectEvent] = useState(null);


    


    useEffect(() => {

        if (allevents) {
            console.log('okokok')
            const parsedEvents = allevents.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
            }));


            setEvents(parsedEvents);

        }
        else {
            console.log('No Allevents')
        }
    }, [allevents]);

    const handleSelectSlot = (slotInfo) => {
        setShowModal(true);
        setSelectedDate(slotInfo.start);
        setSelectEvent(null);
    };

    const handleSelectedEvent = (event) => {
        setShowModal(true);
        setSelectEvent(event);
        setEventTitle(event.title);
    };

    const saveEvent = () => {
        if (eventTitle && selectedDate) {
            if (selectEvent) {
                const updatedEvent = { ...selectEvent, title: eventTitle };
                const updatedEvents = events.map((event) =>
                    event === selectEvent ? updatedEvent : event
                );
                setEvents(updatedEvents);
            } else {
                const newEvent = {
                    title: eventTitle,
                    start: selectedDate,
                    end: moment(selectedDate)
                        .add(2, "hours")
                        .toDate(),
                };
                setEvents([...events, newEvent]);
            }
            setShowModal(false);
            setEventTitle("");
            setSelectEvent(null);
        }
    };

    const deleteEvent = () => {
        if (selectEvent) {
            const updatedEvents = events.filter((event) => event !== selectEvent);
            setEvents(updatedEvents);
            setShowModal(false);
            setEventTitle('');
            setSelectEvent(null);
        }
    };
    const CustomEvent = ({ event }) => {
        return (
            <span>
                <strong>{event.subject_code}</strong>
                <br />
                <em>{event.location}</em>
            </span>
        );
    };








    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">










                        <div style={{ height: '800px' }}>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                defaultView={'week'}
                                views={["month", "week", "day", "agenda"]}
                                formats={{ weekdayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture) }}
                                max={maxTime}
                                min={minTime}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ margin: '50px' }}
                                selectable={true}
                                components={{
                                    event: CustomEvent
                                }}
                                onSelectSlot={handleSelectSlot}
                                onSelectEvent={handleSelectedEvent}
                            />

                            {showModal && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
                                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                        {selectEvent ? "Edit Event" : "Add Event"}
                                                    </h3>
                                                </div>
                                                <div className="mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
                                                    <button
                                                        type="button"
                                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                                        onClick={() => {
                                                            setShowModal(false);
                                                            setEventTitle("");
                                                            setSelectEvent(null);
                                                        }}
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700">
                                                    Event Title:
                                                </label>
                                                <input
                                                    type="text"
                                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    id="eventTitle"
                                                    value={eventTitle}
                                                    onChange={(e) => setEventTitle(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                            {selectEvent && (
                                                <button
                                                    type="button"
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                    onClick={deleteEvent}
                                                >
                                                    Delete Event
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={saveEvent}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>






                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
