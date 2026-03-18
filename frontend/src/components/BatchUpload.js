import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function BatchUpload() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResults(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/predict-batch`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Failed to process batch. Make sure the backend is running and CSV format is correct.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Batch Prediction</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-xl font-semibold text-gray-200">
                {file ? file.name : 'Click to upload CSV file'}
              </p>
              <p className="text-gray-400 mt-2">or drag and drop</p>
            </label>
          </div>

          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
            <h3 className="font-bold text-gray-200 mb-2">📋 CSV Format</h3>
            <p className="text-gray-400 text-sm">
              Your CSV should contain the following columns:
            </p>
            <p className="text-gray-400 text-sm font-mono mt-2 overflow-x-auto">
              dur, sbytes, dbytes, sttl, dttl, sloss, dloss, service, sload, dload, spkts, dpkts, swin, dwin, stcpb, dtcpb, smeansz, dmeansz, trans_depth, res_bdy_len, sjit, djit, tcprpt, synack, ackdat, is_sm_ips_ports, ct_state_ttl, ct_flw_http_mthd, is_ftp_login, ct_ftp_cmd, ct_srv_src, ct_srv_dst, ct_dst_ltm, ct_src_ltm, ct_src_dport_ltm, ct_dst_sport_ltm, ct_dst_src_ltm
            </p>
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            {loading ? 'Processing...' : 'Process Batch'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-200 mb-2">Error</h3>
          <p className="text-red-100">{error}</p>
        </div>
      )}

      {results && (
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <h3 className="text-xl font-bold mb-6">Batch Results Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-400 text-sm">Total Records</p>
              <p className="text-3xl font-bold text-blue-300">
                {results.summary.total}
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-400 text-sm">Anomalies Detected</p>
              <p className="text-3xl font-bold text-red-400">
                {results.summary.anomalies}
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-400 text-sm">Normal Records</p>
              <p className="text-3xl font-bold text-green-400">
                {results.summary.normal}
              </p>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-200">Row</th>
                    <th className="px-6 py-3 text-left text-gray-200">Status</th>
                    <th className="px-6 py-3 text-left text-gray-200">Attack Type</th>
                    <th className="px-6 py-3 text-left text-gray-200">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {results.predictions.slice(0, 20).map((prediction, idx) => (
                    <tr key={idx} className="hover:bg-gray-600 transition">
                      <td className="px-6 py-3 text-gray-300">{prediction.row}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded font-semibold text-sm ${
                          prediction.anomaly === 1
                            ? 'bg-red-900 text-red-200'
                            : 'bg-green-900 text-green-200'
                        }`}>
                          {prediction.anomaly === 1 ? 'ANOMALY' : 'NORMAL'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-300">{prediction.attack_type}</td>
                      <td className="px-6 py-3 text-gray-300">
                        {(prediction.confidence * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {results.predictions.length > 20 && (
              <div className="bg-gray-600 px-6 py-4 text-center text-gray-300">
                Showing 20 of {results.predictions.length} records
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
