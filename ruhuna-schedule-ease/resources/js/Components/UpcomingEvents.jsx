import { useState } from "react";

export default function UpcomingEvents({ allevents, now }) {
    const [filter, setFilter] = useState("tomorrow");

    // Filter upcoming events based on filter
    const filteredUpcomingEvents = allevents.filter((event) => {
        const eventDate = new Date(event.start);
        if (filter === "all") return eventDate > now;
        if (filter === "nextWeek") {
            const nextWeek = new Date();
            nextWeek.setDate(now.getDate() + 7);
            return eventDate > now && eventDate <= nextWeek;
        }
        if (filter === "tomorrow") {
            const tomorrow = new Date();
            tomorrow.setDate(now.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0); // Start of tomorrow
            const endOfTomorrow = new Date(tomorrow);
            endOfTomorrow.setHours(23, 59, 59, 999); // End of tomorrow
            return eventDate >= tomorrow && eventDate <= endOfTomorrow;
        }
        return false;
    });

    return (
        <div className="dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700">
            {filteredUpcomingEvents.length > 0 && (
                <div className="mt-8 p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                        Upcoming Events
                    </h3>
                    <div className="mb-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-3 py-1.5 rounded-lg text-white ${
                                filter === "all"
                                    ? "bg-blue-500"
                                    : "bg-blue-300 dark:bg-blue-700"
                            } text-xs sm:text-sm`}
                        >
                            All Events
                        </button>
                        <button
                            onClick={() => setFilter("nextWeek")}
                            className={`px-3 py-1.5 rounded-lg text-white ${
                                filter === "nextWeek"
                                    ? "bg-gray-500"
                                    : "bg-gray-300 dark:bg-gray-700"
                            } text-xs sm:text-sm`}
                        >
                            Next Week
                        </button>
                        <button
                            onClick={() => setFilter("tomorrow")}
                            className={`px-3 py-1.5 rounded-lg text-white ${
                                filter === "tomorrow"
                                    ? "bg-yellow-500"
                                    : "bg-yellow-300 dark:bg-yellow-700"
                            } text-xs sm:text-sm`}
                        >
                            Tomorrow
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUpcomingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-green-100 p-4 rounded-lg shadow-md dark:bg-green-700"
                            >
                                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">
                                    {event.event_title}
                                </h4>
                                <p className="text-sm text-green-600 dark:text-green-300">
                                    Date: {new Date(event.start).toDateString()}
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-300">
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
                                <p className="text-sm text-green-600 dark:text-green-300">
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
