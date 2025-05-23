import { useEffect } from 'react';
import Header from './components/Header';
import DoctorDashboard from './components/doctor_dashboard';
import PatientDashboard from './components/patient_dashbaord';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
      </Routes>
    </>
  );
}

export default App;