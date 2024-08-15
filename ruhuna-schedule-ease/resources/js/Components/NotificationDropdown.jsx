import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const NotificationDropdown = ({ unreadNotifications, readNotifications }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const markAllAsRead = () => {
        Inertia.post(route('markAsRead'));
    };

    const unreadNotification_length = unreadNotifications.length;

    return (
        <li className="relative">
            <a
                id="navbarDropdown"
                className="nav-link flex items-center cursor-pointer"
                role="button"
                aria-haspopup="true"
                aria-expanded={isOpen ? "true" : "false"}
                onClick={toggleDropdown}
            >
                <i className="fa fa-bell text-white"></i>
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-semibold leading-none text-green-800 bg-green-300 rounded-full">
                    {unreadNotification_length}
                </span>
            </a>
            {isOpen && (
                <ul className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50 overflow-hidden">
                    {unreadNotification_length > 0 && (
                        <li className="flex justify-end p-2">
                            <button
                                onClick={markAllAsRead}
                                className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 px-2 py-1 text-xs rounded"
                            >
                                Mark All as Read
                            </button>
                        </li>
                    )}

                    {unreadNotifications.map((notification, index) => (
                        <a
                            key={index}
                            href="#"
                            className="block px-4 py-2 text-green-700 hover:bg-green-100 hover:text-green-900"
                        >
                            <li className="text-green-700">
                                {notification.data.data}
                            </li>
                        </a>
                    ))}
                    {readNotifications.map((notification, index) => (
                        <a
                            key={index}
                            href="#"
                            className="block px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            <li className="text-gray-500">
                                {notification.data.data}
                            </li>
                        </a>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default NotificationDropdown;
