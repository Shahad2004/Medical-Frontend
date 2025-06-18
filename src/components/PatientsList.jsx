import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.header": {
    backgroundColor: "#f5f5f5",
    fontWeight: 600,
    fontSize: "0.875rem",
    borderBottom: "2px solid #e0e0e0",
  },
  "&.body": {
    borderBottom: "1px solid #e0e0e0",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#f0f4ff",
  },
  "&.Mui-selected": {
    backgroundColor: "#e6f0ff !important",
  },
}));

const AddButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  alignSelf: "flex-end",
}));

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser || !currentUser.id) {
          setError('User not found. Please login again.');
          setLoading(false);
          return;
        }

        console.log('Current user from localStorage:', currentUser);
        console.log('Doctor ID being used:', currentUser.id);

        // Use the logged-in doctor's ID
        const response = await axios.get(`http://localhost:5000/api/patients/assigned/${currentUser.id}`);
        console.log('API response for assigned patients:', response.data);
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Error fetching patients: ' + err.message);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleMedicalRecordClick = (patientId, event) => {
    event.stopPropagation();
    navigate(`/patient/${patientId}/overview`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <AddButton
          sx={{
            ml: 2,
            borderRadius: '10px',
            color: '#fff',
            backgroundColor: '#40A2E3',
            '&:hover': {
              backgroundColor: '#3595d1',
            },
          }}
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => navigate("/patient-details")}
        >
          Add Patient
        </AddButton>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table aria-label="patients table">
          <TableHead>
            <TableRow>
              <StyledTableCell className="header">PATIENT</StyledTableCell>
              <StyledTableCell className="header">FILE NO.</StyledTableCell>
              <StyledTableCell className="header">BLOOD TYPE</StyledTableCell>
              <StyledTableCell className="header">CONTACT</StyledTableCell>
              <StyledTableCell className="header">ALLERGIES</StyledTableCell>
              <StyledTableCell className="header" align="center">ACTIONS</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient, index) => (
              <StyledTableRow
                key={patient.id}
                selected={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
                hover
              >
                <StyledTableCell className="body">{patient.full_name}</StyledTableCell>
                <StyledTableCell className="body">{patient.file_number}</StyledTableCell>
                <StyledTableCell className="body">{patient.blood_type}</StyledTableCell>
                <StyledTableCell className="body">{patient.phone}</StyledTableCell>
                <StyledTableCell className="body">{patient.allergies || 'No allergies'}</StyledTableCell>
                <StyledTableCell className="body" align="center">
                  <IconButton
                    onClick={(e) => handleMedicalRecordClick(patient.id, e)}
                    sx={{
                      color: '#2065D1',
                      '&:hover': {
                        backgroundColor: 'rgba(32, 101, 209, 0.08)',
                      },
                    }}
                  >
                    <LocalHospitalIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PatientsList; 