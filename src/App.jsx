import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PatientDetails from './components/PatientDetails';
import MedicalRecord from './components/MedicalRecord';
import './App.css';
import PatientOverview from './components/PatientOverview';
import PatientSchedules from './components/PatientSchedules';
import Appointments from './components/Appointments';
import DoctorDashboard from './components/DoctorDashboard';
import PatientsList from './components/PatientsList';
import PatientDashboard from './pages/patient/PatientDashboard';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Settings from './components/Settings';

const App = () => {
  return (
    <Routes>
      {/* صفحات الدخول والتسجيل بدون Header/Sidebar */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      {/* باقي صفحات التطبيق مع Header/Sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/patient/:id/overview" element={<PatientOverview />} />
        <Route path="/patient/:id/medical-record" element={<MedicalRecord />} />
        <Route path="/patient/:id/schedule" element={<PatientSchedules />} />
        <Route path="/patient-details" element={<PatientDetails />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/doctor-appointments" element={<Appointments />} />
        <Route path="/PatientDashboard" element={<PatientDashboard/>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
