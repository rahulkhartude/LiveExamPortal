import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TestPage from './pages/TestPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/test/:section" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
