import React, { useState } from 'react';
import { useWorkStore } from '../store';

export function MeetingForm() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [attendees, setAttendees] = useState('');
  const addMeeting = useWorkStore((state) => state.addMeeting);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMeeting({
      id: Date.now().toString(),
      title,
      date,
      attendees,
    });
    setTitle('');
    setDate('');
    setAttendees('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Meeting title..."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date & Time</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Attendees</label>
        <input
          type="text"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="John Doe, Jane Smith..."
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
      >
        Add Meeting
      </button>
    </form>
  );
}