import React, { useState } from 'react';
import { useWorkStore } from '../store';

export function ActivityForm() {
  const [calls, setCalls] = useState('0');
  const [emails, setEmails] = useState('0');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const addBulkActivities = useWorkStore((state) => state.addBulkActivities);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBulkActivities({
      calls: parseInt(calls),
      emails: parseInt(emails),
      date,
    });
    setCalls('0');
    setEmails('0');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Bulk Activity Entry</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cold Calls</label>
            <input
              type="number"
              min="0"
              value={calls}
              onChange={(e) => setCalls(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Emails</label>
            <input
              type="number"
              min="0"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Activities
        </button>
      </div>
    </form>
  );
}