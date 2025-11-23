import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import HomePageIntro from './intro/HomePage'; // Để tránh trùng tên với trang Home trong pages
import ForgotPasswordEmail from './auth/ForgotPasswordEmail';
import ForgotPasswordConfirm from './auth/ForgotPasswordConfirm';
import SignUpPage from './auth/SignUpPage';
import MainLayout from './components/MainLayout';
import DashboardPage from './pages/Dashboard';
import HomePage from './pages/Home';
import AlarmsPage from './pages/Alarms';
import SettingsPage from './pages/Settings';
import SensorMap from './pages/Map';
import DebugData from './pages/DebugData';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePageIntro />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordEmail />} />
        <Route path="/forgot-password/confirm" element={<ForgotPasswordConfirm />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Sử dụng MainLayout làm layout chung cho các trang bên trong */}
        <Route path="/mainlayout" element={<MainLayout />}>
          <Route index element={<HomePage />} /> {/* Default route */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="alarms" element={<AlarmsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="map" element={<SensorMap />} />
          <Route path="debug" element={<DebugData />} />
          {/* <Route path="map3d" element={<Map3D />} /> */}
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;