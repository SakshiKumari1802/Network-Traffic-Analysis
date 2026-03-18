import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function PredictionForm() {
  const [features, setFeatures] = useState({
    dur: 0.001,
    sbytes: 200,
    dbytes: 200,
    sttl: 254,
    dttl: 0,
    sloss: 0,
    dloss: 0,
    service: 'http',
    sload: 800000.0,
    dload: 800000.0,
    spkts: 2,
    dpkts: 0,
    swin: 0,
    dwin: 0,
    stcpb: 0,
    dtcpb: 0,
    smeansz: 100,
    dmeansz: 0,
    trans_depth: 0,
    res_bdy_len: 0,
    sjit: 0.0,
    djit: 0.0,
    tcprpt: 0.0,
    synack: 0.0,
    ackdat: 0.0,
    is_sm_ips_ports: 0,
    ct_state_ttl: 0,
    ct_flw_http_mthd: 0,
    is_ftp_login: 0,
    ct_ftp_cmd: 0,
    ct_srv_src: 1,
    ct_srv_dst: 1,
    ct_dst_ltm: 1,
    ct_src_ltm: 1,
    ct_src_dport_ltm: 1,
    ct_dst_sport_ltm: 1,
    ct_dst_src_ltm: 1,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeatures(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/predict`, {
        features
      });

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Failed to get prediction. Make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Single Prediction</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(features).map(key => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {key}
                </label>
                {key === 'service' ? (
                  <select
                    name={key}
                    value={features[key]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="http">http</option>
                    <option value="ftp">ftp</option>
                    <option value="ssh">ssh</option>
                    <option value="dns">dns</option>
                    <option value="smtp">smtp</option>
                    <option value="ssl">ssl</option>
                    <option value="other">other</option>
                  </select>
                ) : (
                  <input
                    type="number"
                    name={key}
                    value={features[key]}
                    onChange={handleInputChange}
                    step="any"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            {loading ? 'Predicting...' : 'Get Prediction'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-200 mb-2">Error</h3>
          <p className="text-red-100">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <h3 className="text-xl font-bold mb-6">Prediction Result</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-400 text-sm">Anomaly Status</p>
              <p className={`text-3xl font-bold ${
                result.anomaly === 1 ? 'text-red-400' : 'text-green-400'
              }`}>
                {result.anomaly === 1 ? 'ANOMALY' : 'NORMAL'}
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-400 text-sm">Attack Type</p>
              <p className="text-2xl font-bold text-blue-300">{result.attack_type}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-400 text-sm">Confidence</p>
              <p className="text-2xl font-bold text-yellow-300">{(result.confidence * 100).toFixed(2)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
