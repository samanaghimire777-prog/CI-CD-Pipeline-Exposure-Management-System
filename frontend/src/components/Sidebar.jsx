import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { path: '/', name: 'Dashboard', icon: '📊' },
    { path: '/scanner', name: 'Scanner', icon: '🔍' },
    { path: '/vulnerabilities', name: 'Vulnerabilities', icon: '🛡️' },
    { path: '/history', name: 'Scan History', icon: '📜' },
  ];

  return (
    <div className="w-64 min-h-screen flex flex-col" style={{ backgroundColor: '#FFC0CB' }}>
      {/* Logo/Header */}
      <div className="p-6 border-b" style={{ borderColor: '#FFB6C1' }}>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <span>🔒</span>
          <span>SecDash</span>
        </h1>
        <p className="text-sm text-gray-700 mt-1">Security Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-pink-600 text-white shadow-lg'
                      : 'text-gray-800 hover:bg-pink-300 hover:text-gray-900'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: '#FFB6C1' }}>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>System Active</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Powered by Trivy & FastAPI
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
