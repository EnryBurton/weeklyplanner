import React, { useState } from 'react';
import { ActivityForm } from './components/ActivityForm';
import { ObjectiveForm } from './components/ObjectiveForm';
import { OutputForm } from './components/OutputForm';
import { Dashboard } from './components/Dashboard';
import { QuarterlySummary } from './components/QuarterlySummary';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Work Week Tracker</h1>
        
        <div className="mb-6">
          <nav className="flex space-x-4">
            {['dashboard', 'activity', 'objectives', 'output', 'quarterly'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'activity' && <ActivityForm />}
          {activeTab === 'objectives' && <ObjectiveForm />}
          {activeTab === 'output' && <OutputForm />}
          {activeTab === 'quarterly' && <QuarterlySummary />}
        </div>
      </div>
    </div>
  );
}

export default App;