import React, { useState, useEffect } from 'react';
import VulnerabilityTable from '../components/VulnerabilityTable';
import { fetchVulnerabilities } from '../api';

const Vulnerabilities = () => {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const vulnsData = await fetchVulnerabilities(selectedSeverity);
      setVulnerabilities(vulnsData.vulnerabilities || []);
    } catch (error) {
      console.error('Error loading vulnerabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSeverity]);

  const severityFilters = [
    { value: null, label: 'All', color: 'gray' },
    { value: 'CRITICAL', label: 'Critical', color: 'red' },
    { value: 'HIGH', label: 'High', color: 'orange' },
    { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
    { value: 'LOW', label: 'Low', color: 'green' },
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vulnerabilities</h1>
        <p className="text-gray-600 mt-1">Detailed view of all detected security vulnerabilities</p>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Severity</h3>
        <div className="flex flex-wrap gap-2">
          {severityFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => setSelectedSeverity(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedSeverity === filter.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        {selectedSeverity && (
          <p className="mt-2 text-sm text-gray-600">
            Showing <strong>{selectedSeverity}</strong> severity vulnerabilities
          </p>
        )}
      </div>

      {/* Vulnerability Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Vulnerability Details
            <span className="ml-2 text-sm font-normal text-gray-600">
              ({vulnerabilities.length} total)
            </span>
          </h2>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading vulnerabilities...</p>
          </div>
        ) : (
          <VulnerabilityTable vulnerabilities={vulnerabilities} />
        )}
      </div>
    </div>
  );
};

export default Vulnerabilities;
