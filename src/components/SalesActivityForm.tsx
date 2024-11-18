import React, { useState } from 'react';
import { useWorkStore } from '../store';

export function SalesActivityForm() {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const addSalesActivity = useWorkStore((state) => state.addSalesActivity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSalesActivity({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type,
      description,
    });
    setType('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Call, Email, Meeting..."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          placeholder="Activity details..."
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Add Activity
      </button>
    </form>
  );
}