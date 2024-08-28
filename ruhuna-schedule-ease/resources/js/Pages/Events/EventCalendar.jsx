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

const EventCalendar = ({ allevents, auth,semesters,courses, halls, lecturers, users, courseTypes,attendances }) => {
    
    var attendanceEventIds=[];

    for (let index = 0; index < attendances.length; index++) {
        const element = attendances[index];
        attendanceEventIds[index]=element['event_id'];
        
    }

    
    //console.log(attendanceEventIds);

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
        id:"",
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

const [genAttendance,setGenAttendance]=useState(false);


    const openModal = (event = null) => {
        if (event) {
           // console.log(attendances);
            setCurrentEvent(event);
            
           if(!attendanceEventIds.includes(event.id)){
            setGenAttendance(true);
            console.log('Chcked records')
           }

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
            //console.log(data);
        } else {
            setCurrentEvent(null);
            reset();
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setIsAdding(false);
        setGenAttendance(false);
    };

    const handleSelectSlot = ({ start, end }) => {
        setData({
            event_title: "",
            location: "",
            start: moment(start).format("YYYY-MM-DDTHH:mm"),
            end: moment(end).format("YYYY-MM-DDTHH:mm"),
            course_type:"",
            semester_id:"",
            user_id:"",
            course_id:"",
            hall_id:"",
            lec_id:"",
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
        let backgroundColor = '#007bff'; // Default color (Blue)
    
        if (event.semester_id === null) {
            backgroundColor = '#800080'; // Purple
        } else if (roleID == 3 && event.Lec_attended) {
            backgroundColor = '#0e6e28'; // Green
        } else if (roleID == 2) {
            // Loop through attendances to find if this user attended this event
            for (let i = 0; i < attendances.length; i++) {
                const element = attendances[i];
                if (element['event_id'] == event.id) {
                    if (element['attended'] == 1) {
                        backgroundColor = '#0e6e28'; // Green
                    } else {
                        backgroundColor = '#007bff'; // Blue
                    }
                    break; // Exit loop once a match is found to avoid unnecessary iterations
                }
            }
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


    

    const [calendarView, setCalendarView] = useState(window.innerWidth < 768 ? 'day' : 'week');

useEffect(() => {
    // Function to check the screen width and set the view
    const updateView = () => {
        if (window.innerWidth < 768) {
            setCalendarView((prevView) => (prevView === 'week' ? 'day' : prevView));
        } else {
            setCalendarView((prevView) => (prevView === 'day' ? 'week' : prevView));
        }
    };

    // Add event listener for window resize
    window.addEventListener('resize', updateView);

    // Call updateView initially to set the correct view based on current width
    updateView();

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', updateView);
}, []); // Empty dependency array to only run on mount and unmount




    
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Create a copy of the current data state
        let updatedData = { ...data, [name]: value };
    
        if (name === 'hall_id') {
            const selectedHall = halls.find(hall => hall.id === parseInt(value));
            updatedData.hall_id = selectedHall ? selectedHall.id : '';
            updatedData.location = selectedHall ? selectedHall.name : ''; // Update location with hall name
        } else if (name === 'course_id' || name === 'course_type') {
            const selectedCourse = courses.find(course => course.course_id === parseInt(updatedData.course_id));
            const selectedCourseType = courseTypes.find(type => type.id === parseInt(updatedData.course_type));
    
            // Automatically set the event title based on course code and course type if both are selected
            if (selectedCourse && selectedCourseType) {
                updatedData.event_title = `${selectedCourse.code} (${selectedCourseType.type})`;
            }
        }
    
        // Update state with the new data
        setData(updatedData);
    };
    


    const show = 1;
    const roleID = auth.user.role_id;

    return (
        <AuthenticatedLayout user={auth.user} permissions={auth.permissions}>
            <div style={{ height: '850px'}}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    //defaultView={calendarView}
                    view={calendarView}

                    //views={['month', 'week', 'day', 'agenda']}
                    onView={(view) => setCalendarView(view)}  // Allow user to change the view
                    views={['month', 'week', 'day', 'agenda']}
                    formats={{
                        weekdayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
                    }}
                    max={maxTime}
                    min={minTime}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ margin: '10px' }}
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
                    
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full overflow-auto max-h-[80vh]">
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
                                    disabled={currentEvent && roleID==2}

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
                                    name="location"
                                    value={data.location}
                                    //onChange={(e) =>setData("location", e.target.value)}
                                    onChange={handleChange}
                                    
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                    disabled={currentEvent && roleID==2}
                                />
                                {errors.location && (
                                    <div className="text-red-600">
                                        {errors.location}
                                    </div>
                                )}
                            </div>
                            {roleID!=2 && 
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
                                    </div>}
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
                                    disabled={currentEvent && roleID==2}
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
                                    disabled={currentEvent && roleID==2}
                                />
                                {errors.end && (
                                    <div className="text-red-600">{errors.end}</div>
                                )}
                            </div>
                        {roleID!=2 && 
                                <>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="semester_id"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Semester
                                        </label>
                                        <select
                                            name="semester_id"
                                            value={data.semester_id}
                                            onChange={(e) => setData("semester_id", e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select Semester</option>
                                            {semesters.map((semester) => (
                                                <option key={semester.id} value={semester.id}>
                                                    {`${semester.name} Level ${semester.level} Semester ${semester.semester} ${semester.academic_year}`}
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
                                            Course Code
                                        </label>
                                        <select
                                            name="course_id"
                                            value={data.course_id}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map((course) => (
                                                <option key={course.course_id} value={course.course_id}>
                                                    {`${course.code} ${course.name}`}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.course_id && (
                                            <span className="text-red-500 text-sm">{errors.course_id}</span>
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
                                    {true &&
                                    <div>
                                        <label
                                            htmlFor="user_id"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            You are
                                        </label>
                                        <select
                                            name="user_id"
                                            value={auth.user.id}
                                            onChange={handleChange}
                                            disabled={roleID!=1}
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
                                    }
                                    
                                </>                       
                                    }
                            
                            {roleID != 2 && currentEvent && currentEvent.semester_id && genAttendance &&
                            <div
                                className="mt-2 mb-2"
                            >
                                <Link href={route("events.generateAttendanceRecords", currentEvent.id)}
                                    className="  px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                        Generate Attendace Records
                                </Link>
                            </div>
                            }

                            {/* Recurrence Checkboxes  */}
                            {roleID==1 && <div className="mb-4">
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
                           


                            {/* Attentedance Checkboxes */}
                            {auth.user.role.role_type==='student' && data.course_type!=null && currentEvent && !genAttendance &&
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
