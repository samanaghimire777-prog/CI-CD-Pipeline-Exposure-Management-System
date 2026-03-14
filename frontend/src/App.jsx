import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Vulnerabilities from './pages/Vulnerabilities';
import ScanHistory from './pages/ScanHistory';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/vulnerabilities" element={<Vulnerabilities />} />
            <Route path="/history" element={<ScanHistory />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
