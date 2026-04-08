import React, { useState } from 'react';
import VulnerabilityTable from '../components/VulnerabilityTable';
import { downloadScanReport, fetchScanById } from '../api';

const ScanLookup = () => {
  const [scanIdInput, setScanIdInput] = useState('');
  const [scan, setScan] = useState(null);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookupScan = async (event) => {
    event.preventDefault();

    const normalized = scanIdInput.trim();
    const parsed = Number(normalized);

    if (!normalized || Number.isNaN(parsed) || parsed < 1 || !Number.isInteger(parsed)) {
      setError('Please enter a valid numeric scan ID (for example: 12).');
      setScan(null);
      setVulnerabilities([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchScanById(parsed);
      setScan(data.scan || null);
      setVulnerabilities(data.vulnerabilities || []);
    } catch (requestError) {
      const detail = requestError?.response?.data?.detail;
      setError(detail || 'Unable to fetch scan details. Please try again.');
      setScan(null);
      setVulnerabilities([]);
    } finally {
      setLoading(false);
    }
  };

  const clearLookup = () => {
    setScanIdInput('');
    setScan(null);
    setVulnerabilities([]);
    setError('');
  };

  const handleDownload = async (format) => {
    if (!scan?.id) {
      return;
    }

    try {
      await downloadScanReport(scan.id, format);
    } catch (downloadError) {
      console.error('Failed to download report:', downloadError);
      setError('Failed to download report. Please try again.');
    }
  };

  const sourceLabel = scan?.scan_source === 'local' ? 'Local Image Scanner' : 'Pre-built Image Scanner';

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Scan Lookup</h1>
        <p className="text-gray-600 mt-1">Search any past scan by scan ID and inspect full results</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={lookupScan} className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="w-full md:max-w-xs">
            <label htmlFor="scanIdLookup" className="block text-sm font-semibold text-gray-700 mb-1">
              Scan ID
            </label>
            <input
              id="scanIdLookup"
              type="number"
              min="1"
              inputMode="numeric"
              placeholder="Enter scan ID"
              value={scanIdInput}
              onChange={(event) => setScanIdInput(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={clearLookup}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>

      {scan && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Scan ID</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{scan.id}</p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Image</p>
              <p className="mt-2 text-sm font-medium text-gray-900 break-all">{scan.image_name}</p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Source</p>
              <p className="mt-2 text-sm font-medium text-gray-900">{sourceLabel}</p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Scanned At</p>
              <p className="mt-2 text-sm font-medium text-gray-900">{new Date(scan.scan_date).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="bg-red-50 rounded-lg border border-red-200 p-4">
              <p className="text-xs uppercase text-red-700">Critical</p>
              <p className="text-2xl font-semibold text-red-800">{scan.critical_count}</p>
            </div>
            <div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
              <p className="text-xs uppercase text-orange-700">High</p>
              <p className="text-2xl font-semibold text-orange-800">{scan.high_count}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
              <p className="text-xs uppercase text-yellow-700">Medium</p>
              <p className="text-2xl font-semibold text-yellow-800">{scan.medium_count}</p>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <p className="text-xs uppercase text-green-700">Low</p>
              <p className="text-2xl font-semibold text-green-800">{scan.low_count}</p>
            </div>
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 col-span-2 md:col-span-1">
              <p className="text-xs uppercase text-blue-700">Total</p>
              <p className="text-2xl font-semibold text-blue-800">{scan.total_vulnerabilities}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-wrap gap-2">
            <button
              onClick={() => handleDownload('pdf')}
              className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Download PDF Report
            </button>
            <button
              onClick={() => handleDownload('excel')}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Download Excel Report
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Vulnerabilities for Scan {scan.id}
                <span className="ml-2 text-sm font-normal text-gray-600">({vulnerabilities.length} total)</span>
              </h2>
            </div>
            <VulnerabilityTable vulnerabilities={vulnerabilities} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanLookup;
