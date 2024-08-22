import React, { useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import "../../../css/bigCalendar.css";
import Modal from "react-modal";
import { useForm, Link } from "@inertiajs/react";

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

    const canCreate = auth.permissions.includes("create_event");
    const canEdit = auth.permissions.includes("update_event");
    const canDelete = auth.permissions.includes("delete_event");
    const canRead = auth.permissions.includes("read_event");




    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isAdding,setIsAdding]=useState(false);



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
        course_type:"",
        semester_id:"",
        user_id:"",
        course_id:"",
        hall_id:"",
        lec_id:"",
        Lec_attended:false,
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
            //console.log(event);
            setCurrentEvent(event);
            setData({
                id:event.id,
                event_title: event.event_title,
                location: event.location,
                start: moment(event.start).format("YYYY-MM-DDTHH:mm"),
                end: moment(event.end).format("YYYY-MM-DDTHH:mm"),
                course_type:event.course_type,
                semester_id:event.semester_id,
                user_id:event.user_id,
                course_id:event.course_id,
                hall_id:event.hall_id,
                lec_id:event.lec_id,
                Lec_attended:event.Lec_attended,
                daily: event.daily,
                weekly: event.weekly,
                monthly: event.monthly,
            });
            console.log(data);
        } else {
            setCurrentEvent(null);
            reset();
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setIsAdding(false);
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
        setIsAdding(true);
    };

    const handleSubmit = () => {
        console.log(currentEvent);
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

    const eventPropGetter = (event) => {
        const roleID = auth.user.role_id;
        let backgroundColor;

        if(event.semester_id===null){
            backgroundColor = '#800080'; // Purple
        }
        else if(roleID==3 && event.Lec_attended){
            backgroundColor = '#0e6e28'; // Green
        }
        else if(roleID==2 ){
            //backgroundColor = '#00ff00'; // Green
            backgroundColor = '#007bff'; // Blue
        }
        else{
            backgroundColor = '#007bff'; // Blue
        }
    
        return { style: { backgroundColor } };
    };
    
    const CustomEvent = ({ event }) => {
        const startTime = new Date(event.start).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // If you want a 12-hour clock, set this to true; for a 24-hour clock, set it to false
        });
    
        const endTime = new Date(event.end).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    
        return (
           
                <span>
                    <strong>{event.event_title}</strong>
                    <br />
                    
                    <em>{event.location}</em>
                    <br />
                    <em>{startTime} - {endTime}</em>
                </span>
           
        );
    };
    


    const show = 1;
    

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <div style={{ height: '850px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    defaultView={'week'}
                    views={['month', 'week', 'day', 'agenda']}
                    formats={{
                        weekdayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
                    }}
                    max={maxTime}
                    min={minTime}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ margin: '50px' }}
                    selectable
                    onSelectEvent={openModal}
                    onSelectSlot={handleSelectSlot}
                    components={{
                        event: CustomEvent,
                    }}
                    eventPropGetter={eventPropGetter}
                />
            </div>

            {show &&
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
                                    disabled={!canEdit}

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
                                    disabled={!canEdit}
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
                                    disabled={!canEdit}
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
                                    disabled={!canEdit}
                                />
                                {errors.end && (
                                    <div className="text-red-600">{errors.end}</div>
                                )}
                            </div>

                            {/* Recurrence Checkboxes 
                            {canEdit && <div className="mb-4">
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
                            }
                            */}


                            {/* Attentedance Checkboxes */}
                            {auth.user.role.role_type==='student' && data.course_type!=null &&
                            <div className="mb-4">
                                   <Link href={`/attendance/${data.course_type}/${data.id}/${auth.user.id}`} className="text-blue-500">Update Attendance</Link>
                                     
                            </div>
                        
                        }
                         {auth.user.role.role_type==='lecturer' && !isAdding &&
                            <div className="mb-1">
                            <label htmlFor="attended" className="block text-lg font-medium text-black dark:text-black-300 mb-1 text-center">
                                Mark as Completed
                            </label>
                            <div className="flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    id="attended"
                                    name="attended"
                                    checked={data.Lec_attended || false} // Convert null to false for the checkbox
                                    onChange={(e) =>
                                        setData((prevData) => ({
                                            ...prevData,
                                            Lec_attended: e.target.checked || null, // If unchecked, set to null
                                        }))
                                    }
                                    className="form-checkbox h-6 w-6 text-indigo-800 dark:text-indigo-800 rounded focus:ring-indigo-800 focus:border-indigo-800 transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>
                        

                            }


                            <div className="flex justify-center mt-2">
                                {currentEvent && canDelete && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="mr-4 bg-red-600 text-white py-2 px-4 rounded-md"
                                    >
                                        Delete
                                    </button>
                                )}
                                {canEdit &&
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 rounded-md"
                                    >
                                        {currentEvent ? "Update" : "Add"}

                                    </button>
                                }

                                {!canEdit && !currentEvent &&
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 rounded-md"
                                    >
                                        Add
                                    </button>
                                }




                            </div>
                        </form>
                    </div>
                </Modal>
            }
        </AuthenticatedLayout>
    );
};

export default EventCalendar;
