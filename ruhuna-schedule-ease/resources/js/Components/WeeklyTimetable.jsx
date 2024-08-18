import React from "react";

const WeeklyTimetable = ({ allevents }) => {
    // Group events by day of the week
    const groupedEvents = allevents.reduce((acc, event) => {
        const eventDay = new Date(event.start).getDay();
        if (!acc[eventDay]) {
            acc[eventDay] = [];
        }
        acc[eventDay].push(event);
        return acc;
    }, {});

    // Define days of the week for Sunday to Saturday
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    // Function to get the unique events for a given hour and day
    const getUniqueEventsForHour = (events, hour) => {
        const uniqueEvents = [];
        events.forEach((event) => {
            const eventStartHour = new Date(event.start).getHours();
            const eventEndHour = new Date(event.end).getHours();
            if (eventStartHour <= hour && eventEndHour > hour) {
                if (!uniqueEvents.find((e) => e.id === event.id)) {
                    uniqueEvents.push(event);
                }
            }
        });
        return uniqueEvents;
    };

    return (
        <div className="mt-8">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                Time
                            </th>
                            {daysOfWeek.map((day, index) => (
                                <th
                                    key={index}
                                    className="py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                >
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 11 }, (_, hourIndex) => {
                            const hour = hourIndex + 8; // Start from 8 AM
                            return (
                                <tr key={hourIndex} className="border-none">
                                    <td className="py-3 px-4 text-center bg-gray-300 dark:bg-gray-900 border-none">
                                        {`${hour
                                            .toString()
                                            .padStart(2, "0")}:00`}
                                    </td>
                                    {daysOfWeek.map((day, dayIndex) => {
                                        const events =
                                            groupedEvents[dayIndex] || [];
                                        const uniqueEventsForHour =
                                            getUniqueEventsForHour(
                                                events,
                                                hour
                                            );

                                        return (
                                            <td
                                                key={dayIndex}
                                                className="py-3 px-4 text-center border-none relative"
                                                style={{
                                                    position: "relative",
                                                    verticalAlign: "top",
                                                }}
                                            >
                                                {uniqueEventsForHour.map(
                                                    (event) => {
                                                        const eventStartHour =
                                                            new Date(
                                                                event.start
                                                            ).getHours();
                                                        const eventEndHour =
                                                            new Date(
                                                                event.end
                                                            ).getHours();
                                                        const rowspan =
                                                            eventEndHour -
                                                            eventStartHour;
                                                        const isEventVisible =
                                                            hour ===
                                                            eventStartHour;

                                                        return (
                                                            isEventVisible && (
                                                                <div
                                                                    key={
                                                                        event.id
                                                                    }
                                                                    className="bg-purple-400 dark:bg-purple-500 text-purple-900 dark:text-purple-100 rounded-lg px-2 py-1 text-xs font-medium absolute flex flex-col items-center justify-center"
                                                                    style={{
                                                                        top: `${
                                                                            (hour -
                                                                                eventStartHour) *
                                                                            49
                                                                        }px`, // Adjust top position
                                                                        height: `${
                                                                            rowspan *
                                                                            49
                                                                        }px`, // Adjust height as needed
                                                                        left: "50%",
                                                                        transform:
                                                                            "translateX(-50%)", // Center horizontally
                                                                        zIndex: 1,
                                                                        whiteSpace:
                                                                            "nowrap",
                                                                        overflow:
                                                                            "hidden",
                                                                        textOverflow:
                                                                            "ellipsis",
                                                                    }}
                                                                >
                                                                    <div className="text-sm font-semibold text-center">
                                                                        {
                                                                            event.event_title
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-center">{`${new Date(
                                                                        event.start
                                                                    ).toLocaleTimeString(
                                                                        [],
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        }
                                                                    )} - ${new Date(
                                                                        event.end
                                                                    ).toLocaleTimeString(
                                                                        [],
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        }
                                                                    )}`}</div>
                                                                </div>
                                                            )
                                                        );
                                                    }
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WeeklyTimetable;
