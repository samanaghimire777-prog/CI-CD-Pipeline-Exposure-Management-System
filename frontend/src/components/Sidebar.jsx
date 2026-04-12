import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { logoutUser } from '../api';

const Sidebar = ({ user, onLogout }) => {
  const navItems = [
    { path: '/', name: 'Dashboard' },
    { path: '/scanner', name: 'Pre-built Image Scanner' },
    { path: '/local-scanner', name: 'Local Image Scanner' },
    { path: '/vulnerabilities', name: 'Vulnerabilities' },
    { path: '/history', name: 'Scan History' },
    { path: '/scan-lookup', name: 'Scan Lookup' },
  ];

  const displayName = user?.name || user?.email?.split('@')[0] || '';
  const avatarLetter = displayName ? displayName[0].toUpperCase() : '?';

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      if (onLogout) {
        onLogout();
      }
    }
  };

  return (
    <div className="w-64 h-screen shrink-0 flex flex-col sticky top-0 overflow-hidden" style={{ backgroundColor: '#FFC0CB' }}>
      {/* Logo/Header */}
      <div className="p-6 border-b" style={{ borderColor: '#FFB6C1' }}>
        <h1 className="text-2xl font-bold text-gray-800">Docker Image Scanner</h1>
        <p className="text-sm text-gray-700 mt-1">Security Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-hidden">
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

        {user ? (
          <div className="mt-3 bg-white/50 border border-pink-300 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-600 text-white text-sm font-semibold flex items-center justify-center">
                {avatarLetter}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-700 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full text-sm px-3 py-1.5 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              to="/login"
              className="text-center text-sm px-3 py-1.5 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-center text-sm px-3 py-1.5 rounded-md bg-white text-gray-900 border border-pink-300 hover:bg-pink-100 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
