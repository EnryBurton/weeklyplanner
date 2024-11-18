import React, { useState } from 'react';
import { useWorkStore } from '../store';

export function ObjectiveForm() {
  const [description, setDescription] = useState('');
  const addObjective = useWorkStore((state) => state.addObjective);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addObjective({
      id: Date.now().toString(),
      description,
      completed: false,
    });
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Objective</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter weekly objective..."
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Add Objective
      </button>
    </form>
  );
}