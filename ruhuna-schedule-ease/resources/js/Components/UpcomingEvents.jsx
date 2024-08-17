import { useState } from "react";

export default function UpcomingEvents({allevents,now}) {
   
    const [filter, setFilter] = useState("tomorrow"); // Add state for filter
    
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
        <div>
            {filteredUpcomingEvents.length > 0 && (
                <div className="mt-8 p-6 border rounded-lg shadow-lg bg-white">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Upcoming Events
                    </h3>
                    <div className="mb-4 flex space-x-4">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-lg text-white ${
                                filter === "all" ? "bg-blue-500" : "bg-blue-300"
                            }`}
                        >
                            All Events
                        </button>
                        <button
                            onClick={() => setFilter("nextWeek")}
                            className={`px-4 py-2 rounded-lg text-white ${
                                filter === "nextWeek"
                                    ? "bg-gray-500"
                                    : "bg-gray-300"
                            }`}
                        >
                            Next Week
                        </button>
                        <button
                            onClick={() => setFilter("tomorrow")}
                            className={`px-4 py-2 rounded-lg text-white ${
                                filter === "tomorrow"
                                    ? "bg-yellow-500"
                                    : "bg-yellow-300"
                            }`}
                        >
                            Tomorrow
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUpcomingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-green-100 p-4 rounded-lg shadow-md"
                            >
                                <h4 className="text-lg font-semibold text-green-800">
                                    {event.event_title}
                                </h4>
                                <p className="text-sm text-green-600">
                                    Date: {new Date(event.start).toDateString()}
                                </p>
                                <p className="text-sm text-green-600">
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
                                <p className="text-sm text-green-600">
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
