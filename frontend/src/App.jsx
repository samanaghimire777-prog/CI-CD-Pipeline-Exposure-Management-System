import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Vulnerabilities from './pages/Vulnerabilities';
import ScanHistory from './pages/ScanHistory';
import ScanLookup from './pages/ScanLookup';
import LocalDockerScanner from './pages/LocalDockerScanner';

const AppShell = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/local-scanner" element={<LocalDockerScanner />} />
          <Route path="/vulnerabilities" element={<Vulnerabilities />} />
          <Route path="/history" element={<ScanHistory />} />
          <Route path="/scan-lookup" element={<ScanLookup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
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
