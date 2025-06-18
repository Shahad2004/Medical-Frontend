<<<<<<< HEAD
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
=======
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Patient from './components/patient';
import Sidebar from './components/sidebar';
import PatientDetails from './components/PatientDetails';
import MedicalRecord from './components/MedicalRecord';
import './App.css';
import PatientOverview from './components/PatientOverview';
import PatientSchedules from './components/PatientSchedules';

const App = () => {
  return (
    <>
      <Header />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/overview" element={<PatientOverview />} />
            <Route path="/medical-record" element={<MedicalRecord />} />
            <Route path="/schedule" element={<PatientSchedules />} />
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/Patient" element={<Patient />} />
            <Route path="/patient-details" element={<PatientDetails />} />
          </Routes>
        </div>
      </div>
    </>
  );
};
>>>>>>> 727b64d (Initial commit of medical project)

export default App;