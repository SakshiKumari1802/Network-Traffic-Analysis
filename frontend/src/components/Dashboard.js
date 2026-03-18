import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      setHealth(response.data);
      setError(null);
    } catch (err) {
      setError('Unable to connect to backend API');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* System Status */}
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">System Status</h2>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-6 mb-6">
            <p className="text-red-100">{error}</p>
            <p className="text-red-300 text-sm mt-2">
              Make sure the backend server is running at {API_URL}
            </p>
          </div>
        )}

        {health && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 text-sm font-semibold mb-2">Status</h3>
              <div className={`flex items-center space-x-2 text-2xl font-bold ${
                health.status === 'healthy' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                <span className={`w-4 h-4 rounded-full ${
                  health.status === 'healthy' ? 'bg-green-400' : 'bg-yellow-400'
                }`}></span>
                <span className="capitalize">{health.status}</span>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 text-sm font-semibold mb-2">Models Loaded</h3>
              <p className={`text-2xl font-bold ${
                health.models_loaded ? 'text-green-400' : 'text-red-400'
              }`}>
                {health.models_loaded ? '✓ Ready' : '✗ Not Ready'}
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 text-sm font-semibold mb-2">API Version</h3>
              <p className="text-2xl font-bold text-blue-300">1.0.0</p>
            </div>
          </div>
        )}

        {loading && !health && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin text-blue-400">
              <p className="text-2xl">⟳</p>
            </div>
            <p className="ml-4 text-gray-300">Checking system status...</p>
          </div>
        )}
      </div>

      {/* Features Overview */}
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-blue-300 mb-2">Anomaly Detection</h3>
            <p className="text-gray-400 text-sm">
              Identifies unknown attack patterns using Isolation Forest
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-blue-300 mb-2">Attack Classification</h3>
            <p className="text-gray-400 text-sm">
              Categorizes detected attacks into 9 known attack types
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-blue-300 mb-2">Real-time Predictions</h3>
            <p className="text-gray-400 text-sm">
              Instant analysis of single network traffic flows
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-blue-300 mb-2">Batch Processing</h3>
            <p className="text-gray-400 text-sm">
              Upload CSV files with multiple network flows for processing
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-bold text-blue-300 mb-2">ML Pipeline</h3>
            <p className="text-gray-400 text-sm">
              StandardScaler → PCA → Isolation Forest → Classification
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-bold text-blue-300 mb-2">API Documentation</h3>
            <p className="text-gray-400 text-sm">
              Auto-generated Swagger docs at /docs
            </p>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Getting Started</h2>

        <div className="space-y-6">
          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-200">Single Prediction</h3>
              <p className="text-gray-400">
                Navigate to the "Single Prediction" tab and fill in network traffic features to get instant predictions.
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-200">Batch Upload</h3>
              <p className="text-gray-400">
                Use the "Batch Upload" tab to upload a CSV file with multiple network flows for bulk predictions.
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-200">API Integration</h3>
              <p className="text-gray-400">
                Use the REST APIs directly for programmatic access. Documentation available at the /docs endpoint.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Information */}
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Model Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-blue-300 mb-4">Training Data</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• <span className="font-semibold">Dataset:</span> UNSW-NB15</li>
              <li>• <span className="font-semibold">Features:</span> 43 network traffic features</li>
              <li>• <span className="font-semibold">Classes:</span> Normal + 9 attack types</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-blue-300 mb-4">Performance Metrics</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• <span className="font-semibold">Accuracy:</span> ~95%</li>
              <li>• <span className="font-semibold">Precision:</span> ~94%</li>
              <li>• <span className="font-semibold">Recall:</span> ~93%</li>
              <li>• <span className="font-semibold">F1-Score:</span> ~93%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
