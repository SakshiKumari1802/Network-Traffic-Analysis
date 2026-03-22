import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function PredictionForm() {
  const [features, setFeatures] = useState({
    dur: 0.001, sbytes: 200, dbytes: 200, sttl: 254, dttl: 0, sloss: 0, dloss: 0,
    service: 'http', sload: 800000.0, dload: 800000.0, spkts: 2, dpkts: 0, swin: 0, dwin: 0,
    stcpb: 0, dtcpb: 0, smeansz: 100, dmeansz: 0, trans_depth: 0, res_bdy_len: 0, sjit: 0.0,
    djit: 0.0, tcprtt: 0.0, synack: 0.0, ackdat: 0.0, is_sm_ips_ports: 0, ct_state_ttl: 0,
    ct_flw_http_mthd: 0, is_ftp_login: 0, ct_ftp_cmd: 0, ct_srv_src: 1, ct_srv_dst: 1,
    ct_dst_ltm: 1, ct_src_ltm: 1, ct_src_dport_ltm: 1, ct_dst_sport_ltm: 1, ct_dst_src_ltm: 1,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeatures(prev => ({ ...prev, [name]: isNaN(value) ? value : parseFloat(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/predict`, { features });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get prediction. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 animate-fadeInUp">
        <div className="flex items-center space-x-4">
          <div className="text-5xl animate-bounce-light">🎯</div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Single Prediction</h2>
            <p className="text-gray-300 mt-1">Analyze network traffic in real-time with 37 features</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700/50 glass animate-slideInLeft">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <span className="text-2xl">📝</span>
            <span>Network Features</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(features).map((key, idx) => (
              <div key={key} className="animate-fadeInUp" style={{ animationDelay: `${idx * 20}ms` }}>
                <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                  {key.replace(/_/g, ' ')}
                </label>
                {key === 'service' ? (
                  <select
                    name={key}
                    value={features[key]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 hover:border-blue-400/50 transition-all duration-200"
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
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 hover:border-blue-400/50 transition-all duration-200"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold rounded-lg transition-all duration-300 button-hover shadow-lg shadow-blue-500/50 flex items-center space-x-2 text-lg"
            >
              <span>{loading ? '⏳ Analyzing...' : '🚀 Get Prediction'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 backdrop-blur-sm border border-red-500/50 rounded-xl p-6 animate-scaleIn">
          <div className="flex items-start space-x-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-200 mb-2">Error</h3>
              <p className="text-red-100">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-fadeInUp">
          {/* Main Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Anomaly Status */}
            <div className={`rounded-2xl p-8 backdrop-blur-sm border ${
              result.anomaly === 1
                ? 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/50 shadow-2xl shadow-red-500/20'
                : 'bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/50 shadow-2xl shadow-green-500/20'
            } card-hover animate-slideInLeft`}>
              <div className="flex flex-col items-center space-y-4">
                <div className="text-5xl animate-pulse-scale">
                  {result.anomaly === 1 ? '🚨' : '✅'}
                </div>
                <p className="text-gray-300 text-sm">Anomaly Status</p>
                <p className={`text-3xl font-bold ${
                  result.anomaly === 1 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {result.anomaly === 1 ? 'ANOMALY' : 'NORMAL'}
                </p>
              </div>
            </div>

            {/* Attack Type */}
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/50 shadow-2xl shadow-purple-500/20 card-hover animate-scaleIn">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-5xl animate-float">🎯</div>
                <p className="text-gray-300 text-sm">Attack Type</p>
                <p className="text-2xl font-bold text-purple-300">{result.attack_type}</p>
              </div>
            </div>

            {/* Confidence */}
            <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/50 shadow-2xl shadow-yellow-500/20 card-hover animate-slideInRight">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-5xl">📊</div>
                <p className="text-gray-300 text-sm">Confidence</p>
                <p className="text-3xl font-bold text-yellow-300">{(result.confidence * 100).toFixed(1)}%</p>
                {/* Confidence Bar */}
                <div className="w-full bg-slate-700/50 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 glass">
            <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
              <span>📈</span>
              <span>Prediction Details</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Model Accuracy</p>
                <p className="text-blue-300 font-bold mt-1">~95%</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Response Time</p>
                <p className="text-cyan-300 font-bold mt-1">< 100ms</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Features Analyzed</p>
                <p className="text-green-300 font-bold mt-1">37</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Model Type</p>
                <p className="text-purple-300 font-bold mt-1">Random Forest</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
