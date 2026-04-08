import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createDockerEventsStream, downloadScanReport, fetchLocalDockerImages, scanLocalImage } from '../api';

const severityClass = (count, tone) => {
  if (count > 0) {
    return tone;
  }
  return 'text-gray-600';
};

const LocalDockerScanner = ({ alertEmail = null }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [autoScanBusy, setAutoScanBusy] = useState(false);
  const [autoScanLastRun, setAutoScanLastRun] = useState('No auto-scans yet.');
  const [autoScanHistory, setAutoScanHistory] = useState([]);
  const [streamState, setStreamState] = useState('connecting');
  const [lastEvent, setLastEvent] = useState('Waiting for Docker image events...');
  const [reportLoading, setReportLoading] = useState({ pdf: false, excel: false });
  const [reportError, setReportError] = useState('');
  const [scanState, setScanState] = useState({
    scanningImage: '',
    lastResult: null,
    error: '',
    success: '',
  });
  const knownImageKeysRef = useRef(new Set());
  const initialLoadRef = useRef(false);

  const scanSelectedImage = useCallback(async (imageName) => {
    setScanState({ scanningImage: imageName, lastResult: null, error: '', success: '' });

    try {
      const result = await scanLocalImage(imageName, alertEmail);
      let successMessage = `Scan completed! Found ${result.total_vulnerabilities} vulnerabilities in ${result.image_name}.`;

      if (result.alert_sent) {
        successMessage += ' Alert sent: VULNERABILITY DETECTED.';
      } else if (result.alert_error) {
        successMessage += ` Alert could not be sent: ${result.alert_error}`;
      }

      setReportError('');
      setScanState({
        scanningImage: '',
        lastResult: result,
        error: '',
        success: successMessage,
      });
      return result;
    } catch (err) {
      setScanState({
        scanningImage: '',
        lastResult: null,
        error: err?.response?.data?.detail || 'Local scan failed.',
        success: '',
      });
      return null;
    }
  }, [alertEmail]);

  const loadImages = useCallback(async ({ fromEvent = false } = {}) => {
    try {
      const data = await fetchLocalDockerImages();
      const latestImages = data.images || [];
      setImages(latestImages);
      setError('');

      const latestKeys = new Set(
        latestImages.map((img) => `${img.image_name}::${img.image_id}`)
      );

      if (!initialLoadRef.current) {
        knownImageKeysRef.current = latestKeys;
        initialLoadRef.current = true;
        return;
      }

      const newImages = latestImages.filter(
        (img) => !knownImageKeysRef.current.has(`${img.image_name}::${img.image_id}`)
      );

      knownImageKeysRef.current = latestKeys;

      if (fromEvent && autoScanEnabled && newImages.length > 0) {
        setAutoScanBusy(true);
        setAutoScanLastRun(`Detected ${newImages.length} new image(s). Starting auto-scan...`);

        for (const img of newImages) {
          const result = await scanSelectedImage(img.image_name);

          if (result) {
            const historyItem = {
              id: `${img.image_name}-${Date.now()}`,
              image_name: result.image_name,
              scanned_at: new Date().toLocaleString(),
              severity_counts: result.severity_counts,
              total_vulnerabilities: result.total_vulnerabilities,
            };

            setAutoScanHistory((prev) => [historyItem, ...prev].slice(0, 20));
          }

          setAutoScanLastRun(
            result
              ? `Auto-scanned ${img.image_name}`
              : `Auto-scan failed for ${img.image_name}`
          );
        }

        setAutoScanBusy(false);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load local Docker images.');
    } finally {
      setLoading(false);
    }
  }, [autoScanEnabled, scanSelectedImage]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    let activeStream = null;
    let reconnectTimer = null;
    let stopped = false;

    const connectStream = () => {
      if (stopped) {
        return;
      }

      setStreamState('connecting');
      activeStream = createDockerEventsStream();

      activeStream.onopen = () => {
        setStreamState('connected');
      };

      activeStream.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.type === 'connected') {
            setLastEvent('Live Docker sync connected.');
            return;
          }

          if (payload.type === 'image_event') {
            setLastEvent(`Image event: ${payload.action}`);
            loadImages({ fromEvent: true });
          }
        } catch (parseError) {
          setLastEvent('Received an unreadable Docker event payload.');
        }
      };

      activeStream.onerror = () => {
        setStreamState('reconnecting');
        setLastEvent('Lost event stream connection. Reconnecting...');

        if (activeStream) {
          activeStream.close();
        }

        reconnectTimer = setTimeout(() => {
          connectStream();
        }, 1500);
      };
    };

    connectStream();

    return () => {
      stopped = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (activeStream) {
        activeStream.close();
      }
    };
  }, [loadImages]);

  const handleScanImage = async (imageName) => {
    await scanSelectedImage(imageName);
  };

  const handleDownload = async (format) => {
    if (!scanState?.lastResult?.scan_id) {
      return;
    }

    setReportError('');
    setReportLoading((prev) => ({ ...prev, [format]: true }));
    try {
      await downloadScanReport(scanState.lastResult.scan_id, format);
    } catch (err) {
      setReportError(err?.response?.data?.detail || 'Failed to download report.');
    } finally {
      setReportLoading((prev) => ({ ...prev, [format]: false }));
    }
  };

  const streamBadgeClass = useMemo(() => {
    if (streamState === 'connected') {
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }

    if (streamState === 'reconnecting') {
      return 'bg-amber-100 text-amber-700 border-amber-200';
    }

    return 'bg-slate-100 text-slate-700 border-slate-200';
  }, [streamState]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Local Image Scanner</h1>
          <p className="text-gray-600 mt-1">
            Real-time local image discovery from Docker daemon events. No image build is triggered here.
          </p>
        </div>
        <button
          onClick={loadImages}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
        >
          Refresh List
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-900">Live Sync Status</h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${streamBadgeClass}`}>
              {streamState}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{lastEvent}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-900">Auto-Scan New Images</h2>
            <button
              onClick={() => setAutoScanEnabled((prev) => !prev)}
              className={`px-4 py-2 rounded-lg text-white transition ${
                autoScanEnabled ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {autoScanEnabled ? 'Auto-Scan ON' : 'Auto-Scan OFF'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">{autoScanLastRun}</p>
          {autoScanBusy && (
            <p className="mt-1 text-sm text-amber-700">Auto-scan is currently running...</p>
          )}
        </div>
      </div>

      {autoScanHistory.length > 0 && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Auto-Scan History</h2>
            <span className="text-sm text-gray-600">Showing {autoScanHistory.length} recent entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Scanned At</th>
                  <th className="text-left px-4 py-3 font-medium">Image</th>
                  <th className="text-left px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Critical</th>
                  <th className="text-left px-4 py-3 font-medium">High</th>
                  <th className="text-left px-4 py-3 font-medium">Medium</th>
                  <th className="text-left px-4 py-3 font-medium">Low</th>
                </tr>
              </thead>
              <tbody>
                {autoScanHistory.map((row) => (
                  <tr key={row.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.scanned_at}</td>
                    <td className="px-4 py-3 font-mono text-xs md:text-sm text-blue-700">{row.image_name}</td>
                    <td className="px-4 py-3 text-gray-700">{row.total_vulnerabilities}</td>
                    <td className="px-4 py-3 text-red-700">{row.severity_counts.CRITICAL}</td>
                    <td className="px-4 py-3 text-orange-700">{row.severity_counts.HIGH}</td>
                    <td className="px-4 py-3 text-amber-700">{row.severity_counts.MEDIUM}</td>
                    <td className="px-4 py-3 text-emerald-700">{row.severity_counts.LOW}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {scanState.error && (
        <div className="mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3">
          {scanState.error}
        </div>
      )}

      {scanState.success && (
        <div className="mb-4 bg-green-50 text-green-800 border border-green-200 rounded-lg px-4 py-3">
          {scanState.success}
        </div>
      )}

      {scanState.lastResult && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900">Download Local Scanner Report</h3>
          <p className="mt-1 text-sm text-gray-600">
            Generate report for scan ID {scanState.lastResult.scan_id} ({scanState.lastResult.image_name}).
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              onClick={() => handleDownload('pdf')}
              disabled={reportLoading.pdf}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 transition"
            >
              {reportLoading.pdf ? 'Generating PDF...' : 'Download PDF'}
            </button>
            <button
              onClick={() => handleDownload('excel')}
              disabled={reportLoading.excel}
              className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-400 transition"
            >
              {reportLoading.excel ? 'Generating Excel...' : 'Download Excel'}
            </button>
          </div>
          {reportError && (
            <p className="mt-3 text-sm text-red-700">{reportError}</p>
          )}
        </div>
      )}

      {scanState.lastResult && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Latest Local Scan Result</h3>
          <p className="text-sm text-gray-700 mb-3">
            Image: <span className="font-mono">{scanState.lastResult.image_name}</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className={severityClass(scanState.lastResult.severity_counts.CRITICAL, 'text-red-700')}>
              Critical: {scanState.lastResult.severity_counts.CRITICAL}
            </div>
            <div className={severityClass(scanState.lastResult.severity_counts.HIGH, 'text-orange-700')}>
              High: {scanState.lastResult.severity_counts.HIGH}
            </div>
            <div className="text-amber-700">
              Medium: {scanState.lastResult.severity_counts.MEDIUM}
            </div>
            <div className="text-emerald-700">
              Low: {scanState.lastResult.severity_counts.LOW}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Local Docker Images</h2>
          <span className="text-sm text-gray-600">{images.length} images</span>
        </div>

        {loading ? (
          <div className="p-6 text-gray-600">Loading local images...</div>
        ) : images.length === 0 ? (
          <div className="p-6 text-gray-600">No local Docker images found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Image</th>
                  <th className="text-left px-4 py-3 font-medium">Image ID</th>
                  <th className="text-left px-4 py-3 font-medium">Created</th>
                  <th className="text-left px-4 py-3 font-medium">Size</th>
                  <th className="text-left px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {images.map((img) => (
                  <tr key={`${img.image_name}-${img.image_id}`} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs md:text-sm text-blue-700">{img.image_name}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{img.image_id}</td>
                    <td className="px-4 py-3 text-gray-700">{img.created_since}</td>
                    <td className="px-4 py-3 text-gray-700">{img.size}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleScanImage(img.image_name)}
                        disabled={scanState.scanningImage === img.image_name}
                        className="px-3 py-2 rounded-md bg-pink-600 text-white hover:bg-pink-700 disabled:bg-gray-400 transition"
                      >
                        {scanState.scanningImage === img.image_name ? 'Scanning...' : 'Scan Local Image'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalDockerScanner;
