import React, { useState } from 'react';

export default function Popup({ closePopup, saveSettings, initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [mainKey, subKey] = name.split('.');
    setSettings((prev) => ({
      ...prev,
      [mainKey]: {
        ...prev[mainKey],
        [subKey]: value,
      },
    }));
  };

  const handleFreeTimeslotChange = (index, field, value) => {
    const newFreeTimeslots = settings.freeTimeslots.map((timeslot, i) => {
      if (i === index) {
        return { ...timeslot, [field]: value };
      }
      return timeslot;
    });
    setSettings((prev) => ({ ...prev, freeTimeslots: newFreeTimeslots }));
  };

  const addFreeTimeslot = () => {
    setSettings((prev) => ({
      ...prev,
      freeTimeslots: [...prev.freeTimeslots, { start: '', end: '', day: '' }],
    }));
  };

  const removeFreeTimeslot = (index) => {
    const newFreeTimeslots = settings.freeTimeslots.filter((_, i) => i !== index);
    setSettings((prev) => ({ ...prev, freeTimeslots: newFreeTimeslots }));
  };

  const handleSave = () => {
    saveSettings(settings);
  };

  return (
    <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50  ">
      <div className="popup-inner bg-white p-8 rounded-md shadow-md w-full max-w-2xl dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-6 dark:text-gray-100">Advanced Settings</h2>
        <div className="mb-6">
          <label className="block text-lg mb-3 dark:text-gray-100">Lunch Time</label>
          <div className="flex space-x-4">
            <input
              type="time"
              name="lunchTime.start"
              value={settings.lunchTime.start}
              onChange={handleChange}
              placeholder="Start Time"
              className="border rounded p-2 w-1/2 mb-3"
            />
            <input
              type="time"
              name="lunchTime.end"
              value={settings.lunchTime.end}
              onChange={handleChange}
              placeholder="End Time"
              className="border rounded p-2 w-1/2 mb-3"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-lg mb-3 dark:text-gray-100">Lecture Time</label>
          <div className="flex space-x-4">
            <input
              type="time"
              name="lectureTime.start"
              value={settings.lectureTime.start}
              onChange={handleChange}
              placeholder="Start Time"
              className="border rounded p-2 w-1/2 mb-3"
            />
            <input
              type="time"
              name="lectureTime.end"
              value={settings.lectureTime.end}
              onChange={handleChange}
              placeholder="End Time"
              className="border rounded p-2 w-1/2 mb-3"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-lg mb-3 dark:text-gray-100">Practical Time</label>
          <div className="flex space-x-4">
            <input
              type="time"
              name="practicalTime.start"
              value={settings.practicalTime.start}
              onChange={handleChange}
              placeholder="Start Time"
              className="border rounded p-2 w-1/2 mb-3"
            />
            <input
              type="time"
              name="practicalTime.end"
              value={settings.practicalTime.end}
              onChange={handleChange}
              placeholder="End Time"
              className="border rounded p-2 w-1/2 mb-3"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-lg mb-3 dark:text-gray-100">Free Timeslots</label>
          {settings.freeTimeslots.map((timeslot, index) => (
            <div key={index} className="mb-4">
              <div className="flex space-x-4 mb-2">
                <input
                  type="time"
                  value={timeslot.start}
                  onChange={(e) => handleFreeTimeslotChange(index, 'start', e.target.value)}
                  placeholder="Start Time"
                  className="border rounded p-2 w-1/3"
                />
                <input
                  type="time"
                  value={timeslot.end}
                  onChange={(e) => handleFreeTimeslotChange(index, 'end', e.target.value)}
                  placeholder="End Time"
                  className="border rounded p-2 w-1/3"
                />
                <select
                  value={timeslot.day}
                  onChange={(e) => handleFreeTimeslotChange(index, 'day', e.target.value)}
                  className="border rounded p-2 w-1/3"
                >
                  <option value="">Select Day</option>
                  {weekdays.map((day, idx) => (
                    <option key={idx} value={day}>{day}</option>
                  ))}
                </select>
                <button
                type="button"
                onClick={() => removeFreeTimeslot(index)}
                className="text-red-600 hover:text-red-700 focus:outline-none"
              >
                Remove
              </button>
              </div>

            </div>
          ))}
          <button
            type="button"
            onClick={addFreeTimeslot}
            className="bg-blue-600 text-white py-2 px-4 rounded-md inline-block hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Another Timeslot
          </button>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleSave}
            className="bg-green-600 text-white py-2 px-4 rounded-md inline-block mr-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={closePopup}
            className="bg-red-600 text-white py-2 px-4 rounded-md inline-block hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
