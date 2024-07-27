import Authenticated from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head,Link,useForm } from '@inertiajs/react';

export default function ShowTimeTable({ auth, timetables,semester }) {
    const { data, setData, delete: deleteTimeTable } = useForm();

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this TimeTable?")) {
            deleteTimeTable(route("timetables.destroy", semester));
        }
    };
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const renderTableRows = (day) => {
    const lunchBreak = {
      start_time: '12:00:00',
      end_time: '13:00:00',
      course: { name: 'Lunch Break' },
      hall: { name: '' },
      lecturer: { name: '' },
    };

    const dayTimetables = timetables
      .filter((timetable) => timetable.day_of_week === day)
      .concat(lunchBreak)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    return dayTimetables.map((timetable, index) => (
      <tr
        key={index}
        className={timetable.course.name === 'Lunch Break' ? 'bg-yellow-200' : ''}
      >
        <td>{timetable.start_time}</td>
        <td>{timetable.end_time}</td>
        <td>{timetable.course.name}</td>
        <td>{timetable.hall.name}</td>
        <td>{timetable.lecturer.name}</td>
      </tr>
    ));
  };

  return (
    <Authenticated
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">TimeTable</h2>}
    >
      <Head title="TimeTable" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <Link href={route('timetables.index')}>Back</Link>
        <hr />
        <button onClick={handleDelete}>drop timetable of semester{semester}</button>
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              {daysOfWeek.map((day) => (
                <div key={day} className="mb-4">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{day}</h3>
                  <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead>
                      <tr>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Course</th>
                        <th>Hall</th>
                        <th>Lecturer</th>
                      </tr>
                    </thead>
                    <tbody>{renderTableRows(day)}</tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
