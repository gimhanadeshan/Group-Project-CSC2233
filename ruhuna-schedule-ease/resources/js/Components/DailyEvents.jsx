import React from "react";

export default function DailyEvents({ allevents, now }) {
    // Filter daily events
    const dailyEvents = allevents.filter((event) => {
        const eventDate = new Date(event.start);
        return eventDate.toDateString() === now.toDateString();
    });

    return (
        <div className="dark:bg-gray-900 dark:text-gray-200">
            {dailyEvents.length > 0 && (
                <div className="mt-8 p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                        Today's Events
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dailyEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-blue-100 p-4 rounded-lg shadow-md dark:bg-blue-700"
                            >
                                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-100">
                                    {event.event_title}
                                </h4>
                                <p className="text-sm text-blue-600 dark:text-blue-100">
                                    Time:{" "}
                                    {new Date(event.start).toLocaleTimeString(
                                        "en-US",
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        }
                                    )}{" "}
                                    -{" "}
                                    {new Date(event.end).toLocaleTimeString(
                                        "en-US",
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        }
                                    )}
                                </p>
                                <p className="text-sm text-blue-600 dark:text-blue-100">
                                    Location:{" "}
                                    {event.location || "Not specified"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
