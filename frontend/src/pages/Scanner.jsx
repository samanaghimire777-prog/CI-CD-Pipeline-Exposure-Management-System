import React, { useState } from 'react';
import ScanForm from '../components/ScanForm';
import { downloadScanReport } from '../api';

const Scanner = ({ alertEmail = null }) => {
  const [lastScan, setLastScan] = useState(null);
  const [reportLoading, setReportLoading] = useState({ pdf: false, excel: false });
  const [reportError, setReportError] = useState('');

  const handleScanComplete = (result) => {
    setLastScan(result);
    setReportError('');
  };

  const handleDownload = async (format) => {
    if (!lastScan?.scan_id) {
      return;
    }

    setReportError('');
    setReportLoading((prev) => ({ ...prev, [format]: true }));
    try {
      await downloadScanReport(lastScan.scan_id, format);
    } catch (err) {
      setReportError(err?.response?.data?.detail || 'Failed to download report.');
    } finally {
      setReportLoading((prev) => ({ ...prev, [format]: false }));
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pre-built Image Scanner</h1>
        <p className="text-gray-600 mt-1">Scan Docker images for security vulnerabilities using Trivy</p>
      </div>

      {/* Scan Form */}
      <div className="max-w-4xl">
        <ScanForm onScanComplete={handleScanComplete} alertEmail={alertEmail} />
      </div>

      {lastScan && (
        <div className="mt-6 max-w-4xl bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Download Pre-built Image Scanner Report</h2>
          <p className="text-sm text-gray-600 mt-1">
            Generate report for scan ID {lastScan.scan_id} ({lastScan.image_name}).
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
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

      {/* Popular Images */}
      <div className="mt-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Popular Images to Scan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'nginx:latest', desc: 'Web server' },
              { name: 'ubuntu:20.04', desc: 'Operating system' },
              { name: 'python:3.11', desc: 'Python runtime' },
              { name: 'node:20-alpine', desc: 'Node.js runtime' },
              { name: 'redis:latest', desc: 'In-memory database' },
              { name: 'postgres:15', desc: 'SQL database' },
            ].map((image) => (
              <button
                key={image.name}
                onClick={() => {
                  const input = document.querySelector('input[type="text"]');
                  if (input) {
                    input.value = image.name;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
                className="text-left p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <p className="font-mono text-sm text-blue-600">{image.name}</p>
                <p className="text-xs text-gray-500 mt-1">{image.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="mt-8 max-w-4xl">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Enter a Docker image name in the format <code className="bg-gray-200 px-2 py-1 rounded">image:tag</code></li>
            <li>Click the "Scan Image" button</li>
            <li>Wait for the scan to complete (30-120 seconds)</li>
            <li>View results in the Dashboard or Vulnerabilities page</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            <strong>Note:</strong> The scanner will automatically pull the Docker image if it's not already available locally.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
