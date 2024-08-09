import React, { useState, useEffect } from 'react';
import {  Link,useForm } from "@inertiajs/react";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import './bigCalendar.css';
import Modal from 'react-modal';
import { Inertia } from '@inertiajs/inertia';

const localizer = momentLocalizer(moment);
//Modal.setAppElement(el);
moment.updateLocale('en', {
  week: {
    dow: 1,
    doy: 1,
  },
});

const minTime = new Date(1970, 1, 1, 8, 0);
const maxTime = new Date(1970, 1, 1, 19, 0);

const EventCalendar = ({ allevents, auth }) => {

  const [events, setEvents] = useState([allevents]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  // const [data, setData] = useState({
  //   event_title: '',
  //   location: '',
  //   start: '',
  //   end: '',
  // });

  const { data, setData, post, put, destroy, reset, errors } = useForm({
    event_title: "",
    location: "",
    start: "",
    end: ""
});

  useEffect(() => {
    if (allevents) {
      const parsedEvents = allevents.map(event => ({
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
        start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
        end: moment(event.end).format('YYYY-MM-DDTHH:mm'),
      });
    } else {
      setCurrentEvent(null);
      setData({
        event_title: '',
        location: '',
        start: '',
        end: '',
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSelectSlot = ({ start, end }) => {
    setData({
      event_title: '',
      location: '',
      start: moment(start).format('YYYY-MM-DDTHH:mm'),
      end: moment(end).format('YYYY-MM-DDTHH:mm'),
    });
    setCurrentEvent(null);
    setModalIsOpen(true);
  };

  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentEvent) {
      // Update event
      Inertia.put(`/events/${currentEvent.id}`, data, {
        
        // onSuccess: () => {
        //   updateEventsState();
        //   closeModal();
        // },
        // onError: (errors) => {
        //   console.error(errors);
        //   closeModal();
        // }
        
      });
      closeModal();
      updateEventsState();
      Inertia.reload();
    } else {
      // Create new event
      Inertia.put('/events', data, {
        onSuccess: () => {
          updateEventsState();
          closeModal();
        },
        onError: (errors) => {
          console.error(errors);
          closeModal();
        }
      });
      closeModal();
      updateEventsState();
      Inertia.reload();
    }
  };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (currentEvent==null) {
//         put(route("event.store"), {
//             onSuccess: () => {
//                 // Update the events state on success
//                 setEvents([...events, data]);
//                 reset();
//             },
//         });

//     } else {
//         put(route("event.update", currentEvent.id), {
//             onSuccess: () => {
//                 // Update the events state on success
//                 const updatedEvents = events.map(event =>
//                     event.id === currentEvent.id ? data : event
//                 );
//                 setEvents(updatedEvents);
//             },
//         });
//     }
// };
  // const handleDelete = async () => {
  //   if (currentEvent) {
  //     Inertia.delete(`/events/${currentEvent.id}`, {
  //       onSuccess: () => {
  //         updateEventsState();
  //         closeModal();
  //       },
  //       onError: (errors) => {
  //         console.error(errors);
  //       }
  //     });
  //   }
  // };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this event?")) {
        
      closeModal();
    }
};

  const updateEventsState = () => {
    Inertia.reload({ only: ['allevents'], onSuccess: (page) => {
      const updatedEvents = page.props.allevents.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(updatedEvents);
    }});
  };

  const CustomEvent = ({ event }) => {
    return (
      <>
      <span id='title'>
        <strong>{event.event_title}</strong>
      </span>  
        <hr />
        <hr />
        <br/>
      <span id='location'>
        <em>{event.location}</em>
      </span>
      </> 
    );
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <div style={{ height: '800px' }}>
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
          <h2 className="text-2xl font-bold mb-4">{currentEvent ? 'Edit Event' : 'Add Event'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title:</label>
              <input
                type="text"
                name="event_title"
                value={data.event_title}
                //onChange={(e) => setData({ ...data, event_title: e.target.value })}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Location:</label>
              <input
                type="text"
                name="location"
                value={data.location}
                //onChange={(e) => setData({ ...data, location: e.target.value })}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Start Time:</label>
              <input
                type="datetime-local"
                name="start"
                value={data.start}
                //onChange={(e) => setData({ ...data, start: e.target.value })}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">End Time:</label>
              <input
                type="datetime-local"
                name="end"
                value={data.end}
                //onChange={(e) => setData({ ...data, end: e.target.value })}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currentEvent ? 'Update' : 'Add'} Event
              </button>
              {currentEvent && (
                // <button
                //   type="button"
                //   onClick={handleDelete}
                //   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                // >
                //   Delete Event
                // </button>

                <Link
                                            href={route(
                                                "events.destroy",
                                                currentEvent.id
                                            )}
                                            method="delete"
                                            as="button"
                                            className="ml-4 text-red-600 hover:text-red-900"
                                        >
                                            <button

                                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </button>
                                            
                                        </Link>
              )}
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </AuthenticatedLayout>
  );
};

export default EventCalendar;
