import React, { useState, useEffect } from 'react';
import SeverityChart from '../components/SeverityChart';
import TimelineChart from '../components/TimelineChart';
import StatsCards from '../components/StatsCards';
import { fetchStats } from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Monitor your security scan metrics and trends</p>
      </div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Severity Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Vulnerability Distribution
          </h2>
          {stats && <SeverityChart data={stats.severity_distribution} />}
        </div>

        {/* Timeline Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Scan History Timeline
          </h2>
          {stats && <TimelineChart scans={stats.recent_scans} />}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Quick Actions</h3>
        <p className="text-sm text-blue-700">
          Use the <strong>Scanner</strong> page to scan new Docker images or view detailed vulnerability information.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
