import React, { useState } from 'react';
import { useWorkStore } from '../store';

export function OutputForm() {
  const [type, setType] = useState<'meeting' | 'opportunity'>('meeting');
  const [name, setName] = useState('');
  const addOutput = useWorkStore((state) => state.addOutput);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOutput({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type,
      name,
    });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'meeting' | 'opportunity')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="meeting">Meeting Booked</option>
          <option value="opportunity">Opportunity</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Contact or company name..."
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
      >
        Add Output
      </button>
    </form>
  );
}