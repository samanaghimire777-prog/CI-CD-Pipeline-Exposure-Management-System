import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Vulnerabilities from './pages/Vulnerabilities';
import ScanHistory from './pages/ScanHistory';
import ScanLookup from './pages/ScanLookup';
import LocalDockerScanner from './pages/LocalDockerScanner';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { clearAuthToken, fetchCurrentUser, getAuthToken } from './api';

const AppShell = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const publicPaths = ['/login', '/signup'];
  const isPublicPath = publicPaths.includes(location.pathname);

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!getAuthToken()) {
        setAuthLoading(false);
        return;
      }

      try {
        const result = await fetchCurrentUser();
        setUser(result.user);
      } catch {
        clearAuthToken();
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-700">
        Checking session...
      </div>
    );
  }

  if (!user && !isPublicPath) {
    return <Navigate to="/login" replace />;
  }

  if (user && isPublicPath) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {!isPublicPath && <Sidebar user={user} onLogout={() => setUser(null)} />}

      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scanner" element={<Scanner alertEmail={user?.email || null} />} />
          <Route path="/local-scanner" element={<LocalDockerScanner alertEmail={user?.email || null} />} />
          <Route path="/vulnerabilities" element={<Vulnerabilities />} />
          <Route path="/history" element={<ScanHistory />} />
          <Route path="/scan-lookup" element={<ScanLookup />} />
          <Route path="/login" element={<Login onAuthSuccess={setUser} />} />
          <Route path="/signup" element={<Signup onAuthSuccess={setUser} />} />
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
