import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function BatchUpload() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const anomalyRate = results ? ((results.summary.anomalies / results.summary.total) * 100).toFixed(1) : 0;

  const getAnomalyRiskLevel = (rate) => {
    if (rate > 30) return { level: 'HIGH RISK', color: 'text-red-400', bgColor: 'bg-red-900/20', description: 'High anomaly rate detected. Investigate immediately.' };
    if (rate > 10) return { level: 'MEDIUM RISK', color: 'text-yellow-400', bgColor: 'bg-yellow-900/20', description: 'Moderate anomaly rate. Monitor closely.' };
    if (rate > 0) return { level: 'LOW RISK', color: 'text-cyan-400', bgColor: 'bg-cyan-900/20', description: 'Few anomalies detected. System appears normal.' };
    return { level: 'SAFE', color: 'text-green-400', bgColor: 'bg-green-900/20', description: 'No anomalies detected. All traffic is normal.' };
  };

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
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 animate-fadeInUp">
        <div className="flex items-center space-x-4">
          <div className="text-5xl animate-bounce-light">📁</div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Batch Upload</h2>
            <p className="text-gray-300 mt-1">Upload CSV file for bulk network traffic analysis</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Area */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700/50 glass animate-slideInLeft">
          <div className="border-2 border-dashed border-slate-600/50 hover:border-blue-500/50 rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer block">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
              <p className="text-xl font-semibold text-gray-200">
                {file ? file.name : 'Click to upload CSV file'}
              </p>
              <p className="text-gray-400 mt-2">or drag and drop</p>
              {file && <p className="text-cyan-400 text-sm mt-3">✓ File selected</p>}
            </label>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mt-6">
            <h3 className="font-bold text-gray-200 mb-3 flex items-center space-x-2">
              <span>📋</span>
              <span>CSV Format Requirements</span>
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              Your CSV should contain the following 37 columns:
            </p>
            <p className="text-gray-400 text-xs font-mono overflow-x-auto bg-slate-900/50 p-3 rounded border border-slate-700/50">
              dur, sbytes, dbytes, sttl, dttl, sloss, dloss, service, sload, dload, spkts, dpkts, swin, dwin, stcpb, dtcpb, smeansz, dmeansz, trans_depth, res_bdy_len, sjit, djit, tcprpt, synack, ackdat, is_sm_ips_ports, ct_state_ttl, ct_flw_http_mthd, is_ftp_login, ct_ftp_cmd, ct_srv_src, ct_srv_dst, ct_dst_ltm, ct_src_ltm, ct_src_dport_ltm, ct_dst_sport_ltm, ct_dst_src_ltm
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={!file || loading}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold rounded-lg transition-all duration-300 button-hover shadow-lg shadow-blue-500/50 flex items-center space-x-2 text-lg"
            >
              <span>{loading ? '⏳ Processing...' : '🚀 Process Batch'}</span>
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

      {results && (
        <div className="space-y-8">
          {/* Results Header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 animate-fadeInUp">
            <div className="flex items-center space-x-4">
              <div className="text-5xl animate-bounce-light">📊</div>
              <div>
                <h2 className="text-3xl font-bold gradient-text">Batch Analysis Complete</h2>
                <p className="text-gray-300 mt-1">{results.summary.total} records analyzed</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/50 shadow-2xl shadow-blue-500/20 card-hover animate-slideInLeft">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-5xl animate-pulse-scale">📈</div>
                <p className="text-gray-300 text-sm">Total Records</p>
                <p className="text-3xl font-bold text-blue-300">{results.summary.total}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/50 shadow-2xl shadow-red-500/20 card-hover animate-scaleIn">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-5xl animate-pulse-scale">🚨</div>
                <p className="text-gray-300 text-sm">Anomalies</p>
                <p className="text-3xl font-bold text-red-300">{results.summary.anomalies}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/50 shadow-2xl shadow-green-500/20 card-hover animate-slideInRight">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-5xl animate-pulse-scale">✅</div>
                <p className="text-gray-300 text-sm">Normal</p>
                <p className="text-3xl font-bold text-green-300">{results.summary.normal}</p>
              </div>
            </div>

            <div className={`bg-gradient-to-br ${getAnomalyRiskLevel(anomalyRate).bgColor} backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/50 shadow-2xl shadow-yellow-500/20 card-hover animate-slideInRight relative group`}>
              <button
                onClick={() => setActiveTooltip(activeTooltip === 'risk' ? null : 'risk')}
                className="absolute top-4 right-4 w-6 h-6 bg-blue-500/50 hover:bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200"
                title="Learn more about risk levels"
              >
                ⓘ
              </button>
              <div className="flex flex-col items-center space-y-4">
                <div className="text-3xl">⚠️</div>
                <p className="text-gray-300 text-sm">Risk Level</p>
                <p className={`text-2xl font-bold ${getAnomalyRiskLevel(anomalyRate).color}`}>
                  {getAnomalyRiskLevel(anomalyRate).level}
                </p>
                <p className="text-xs text-gray-400 text-center">{anomalyRate}% anomalies</p>
              </div>
              {activeTooltip === 'risk' && (
                <div className="mt-4 pt-4 border-t border-slate-600/50 text-xs leading-relaxed text-gray-300 animate-fadeInUp">
                  {getAnomalyRiskLevel(anomalyRate).description}
                </div>
              )}
            </div>
          </div>

          {/* Batch Results Explanation */}
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 glass animate-slideInLeft">
            <h3 className="font-bold text-xl mb-6 flex items-center space-x-2 gradient-text">
              <span>💡</span>
              <span>Batch Results Insights</span>
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-start space-x-3">
                  <span className="text-lg">📊</span>
                  <div>
                    <p className="font-semibold text-cyan-300 mb-1">What do these results mean?</p>
                    <p className="text-sm text-gray-300">
                      Out of {results.summary.total} network traffic records analyzed:
                      <br />• <strong>{results.summary.anomalies}</strong> records ({anomalyRate}%) show anomalous patterns
                      <br />• <strong>{results.summary.normal}</strong> records ({(100 - anomalyRate).toFixed(1)}%) are normal traffic
                      <br />• Risk level is <strong>{getAnomalyRiskLevel(anomalyRate).level}</strong> based on anomaly percentage
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">📈</span>
                    <div>
                      <p className="font-semibold text-yellow-300 mb-1">Anomaly Rate Interpretation</p>
                      <p className="text-xs text-gray-400 space-y-1">
                        <div>• <span className="font-medium">&gt;30%</span> - HIGH RISK</div>
                        <div>• <span className="font-medium">10-30%</span> - MEDIUM RISK</div>
                        <div>• <span className="font-medium">&lt;10%</span> - LOW RISK</div>
                        <div>• <span className="font-medium">0%</span> - SAFE</div>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">🛡️</span>
                    <div>
                      <p className="font-semibold text-green-300 mb-1">Recommended Actions</p>
                      <p className="text-xs text-gray-400">
                        {anomalyRate > 30
                          ? 'HIGH RISK: Investigate all anomalies immediately, review firewall rules, block suspicious IPs'
                          : anomalyRate > 10
                          ? 'MEDIUM RISK: Review detected anomalies, enhance monitoring, prepare response procedures'
                          : anomalyRate > 0
                          ? 'LOW RISK: Continue monitoring, investigate isolated anomalies'
                          : 'SAFE: No anomalies detected. Maintain current security posture'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results Table */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 glass">
            <h3 className="font-bold text-lg mb-6 flex items-center space-x-2">
              <span>📋</span>
              <span>Detailed Results ({results.predictions.length > 20 ? `Showing first 20 of ${results.predictions.length}` : results.predictions.length})</span>
            </h3>

            <div className="glass-light rounded-xl overflow-hidden border border-slate-700/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50 border-b border-slate-600/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-gray-300 font-semibold">Row</th>
                      <th className="px-6 py-3 text-left text-gray-300 font-semibold">Status</th>
                      <th className="px-6 py-3 text-left text-gray-300 font-semibold">Attack Type</th>
                      <th className="px-6 py-3 text-left text-gray-300 font-semibold">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {results.predictions.slice(0, 20).map((prediction, idx) => (
                      <tr key={idx} className="hover:bg-slate-700/30 transition-all duration-200">
                        <td className="px-6 py-3 text-gray-300">{prediction.row}</td>
                        <td className="px-6 py-3">
                          <span className={`px-3 py-1 rounded-lg font-semibold text-sm flex items-center w-fit ${
                            prediction.anomaly === 1
                              ? 'bg-red-900/40 text-red-200 border border-red-500/50'
                              : 'bg-green-900/40 text-green-200 border border-green-500/50'
                          }`}>
                            <span className="mr-2">{prediction.anomaly === 1 ? '🚨' : '✅'}</span>
                            {prediction.anomaly === 1 ? 'ANOMALY' : 'NORMAL'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-300 font-medium">{prediction.attack_type}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-slate-700/50 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full"
                                style={{ width: `${prediction.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-gray-300 text-sm font-semibold">{(prediction.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {results.predictions.length > 20 && (
                <div className="bg-slate-700/30 px-6 py-4 text-center text-gray-400 border-t border-slate-600/50">
                  Showing first 20 of {results.predictions.length} records (download CSV for complete results)
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
