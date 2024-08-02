import React, { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';



const localizer = momentLocalizer(moment);

// Configure moment to start the week on Monday
moment.updateLocale('en', {
  week: {
    dow: 1, // Monday is the first day of the week
    doy: 1, // First week of the year must contain January 1 (7 + 1 - 7)
  },
});

// Define min and max times
const minTime = new Date(1970, 1, 1, 8, 0); // 8:00 AM
const maxTime = new Date(1970, 1, 1, 19, 0); // 6:00 PM

const TimeTable = ({ allevents,auth})=> {



  const [events, setEvents] = useState([]);


  useEffect(() => {
   
   if(allevents){
    console.log('Events Fetched!')
      const parsedEvents = allevents.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));

    
        setEvents(parsedEvents);

    }     
    else{
      console.log('No Allevents')
    }
  }, [allevents]);



  const CustomEvent = ({ event }) => {
    return (
      <span>
        <strong>{event.event_title}</strong>
        <br />
        <em>{event.location}</em>
      </span>
    );
  };
 
  return (

    <AuthenticatedLayout
      user={auth.user}
    >
     
      <div style={{ height: '800px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          defaultView={'week'}
          views={["month","week","day","agenda"]}
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
      
        />

        {/* {showModal && (
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
                      //onClick=
                        
                      
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
                    //onChange={(e) => setEventTitle(e.target.value)}
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
        )} */}
      </div>

    
    </AuthenticatedLayout>
  );
}

export default TimeTable;