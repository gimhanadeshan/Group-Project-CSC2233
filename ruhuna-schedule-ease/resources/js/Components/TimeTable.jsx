import React, { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import '../../css/TimeTable.css';

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

export default function TimeTable() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      const events = response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
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
    </div>
  );
}
