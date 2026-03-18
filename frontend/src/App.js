import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import PredictionForm from './components/PredictionForm';
import BatchUpload from './components/BatchUpload';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold">Network Traffic IDS</h1>
          <p className="text-gray-300 mt-2">Real-time Anomaly Detection & Attack Classification</p>
        </div>
      </header>

      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-3 font-medium text-sm border-b-2 transition ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('single')}
              className={`py-4 px-3 font-medium text-sm border-b-2 transition ${
                activeTab === 'single'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Single Prediction
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`py-4 px-3 font-medium text-sm border-b-2 transition ${
                activeTab === 'batch'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Batch Upload
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'single' && <PredictionForm />}
        {activeTab === 'batch' && <BatchUpload />}
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-400">
          <p>Network Traffic Anomaly Detection System | API: http://localhost:8000</p>
        </div>
      </footer>
    </div>
  );
}
