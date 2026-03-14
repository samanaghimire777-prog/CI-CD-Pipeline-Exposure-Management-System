import React from 'react';

const StatsCards = ({ stats }) => {
  const severityStats = [
    {
      name: 'Critical',
      count: stats.severity_distribution?.CRITICAL || 0,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      hoverColor: 'hover:bg-red-100',
      severity: 'CRITICAL'
    },
    {
      name: 'High',
      count: stats.severity_distribution?.HIGH || 0,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-100',
      severity: 'HIGH'
    },
    {
      name: 'Medium',
      count: stats.severity_distribution?.MEDIUM || 0,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      hoverColor: 'hover:bg-yellow-100',
      severity: 'MEDIUM'
    },
    {
      name: 'Low',
      count: stats.severity_distribution?.LOW || 0,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      severity: 'LOW'
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {/* Total Scans Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Scans</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{stats.total_scans}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Total Vulnerabilities Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Vulnerabilities</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{stats.total_vulnerabilities}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Severity Distribution Cards */}
      {severityStats.slice(0, 2).map((stat) => (
        <div
          key={stat.name}
          className={`${stat.bgColor} overflow-hidden shadow rounded-lg border-2 ${stat.borderColor}`}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className={`h-6 w-6 ${stat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className={`text-sm font-medium ${stat.textColor} truncate`}>{stat.name} Severity</dt>
                  <dd className="flex items-baseline">
                    <div className={`text-2xl font-semibold ${stat.textColor}`}>{stat.count}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
