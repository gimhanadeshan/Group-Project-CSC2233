import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';

const NotificationDropdown = ({ unreadNotifications, readNotifications }) => {
    const markAllAsRead = () => {
        Inertia.post(route('markAllAsRead'));
    };
    const markAsRead = (id,link) => {
        console.log(id);
        Inertia.post(route('markAsRead', { id:id }));
        Inertia.visit(link);
    }

    const unreadNotification_length = unreadNotifications.length;
    return (

        <div className="flex flex-col lg:flex-row">
        {/* Left Side - Unread Notifications */}
        <div className="flex-1 p-4 bg-gray-900 text-white dark:bg-gray-800 dark:text-gray-200">
          <ul className="space-y-4">
            {unreadNotification_length > 0 && (
              <li>
                <button
                  onClick={markAllAsRead}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Mark All as Read
                </button>
              </li>
            )}

            {unreadNotifications.map((notification, index) => (
              <li key={index} className="bg-green-500 p-3 rounded-md shadow-md transition-all duration-300 hover:bg-green-600">
                <Link onClick={markAsRead(notification.id,notification.link)}>{notification.data.data}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side - Read Notifications */}
        <div className="flex-1 p-4 bg-gray-800 text-gray-300 dark:bg-gray-700">
          <ul className="space-y-4">
            {readNotifications.map((notification, index) => (
              <li key={index} className="bg-gray-600 p-3 rounded-md shadow-md transition-all duration-300 hover:bg-gray-500">
                {notification.data.data}
              </li>
            ))}
          </ul>
        </div>
      </div>

    );
};

export default NotificationDropdown;
