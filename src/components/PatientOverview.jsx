import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Tabs,
  Tab,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Backdrop,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PatientBanner from './common/PatientBanner';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const PatientOverview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [value, setValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const theme = useTheme();

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser || !currentUser.id) {
        setError('User not found. Please login again.');
        setLoading(false);
        return;
      }

      console.log('Current user from localStorage:', currentUser);
      console.log('Doctor ID being used:', currentUser.id);

      const response = await axios.get(`${BASE_URL}/api/patients/${id}?doctorId=${currentUser.id}`);
      setPatientData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError('Error fetching patient data: ' + err.message);
      setPatientData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      navigate(`/patient/${id}/medical-record`);
    } else if (newValue === 2) {
      navigate(`/patient/${id}/schedule`);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser || !currentUser.id) {
        setError('User not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.put(`${BASE_URL}/api/patients/${id}?doctorId=${currentUser.id}`, patientData);
      setPatientData(response.data);
      setIsEditing(false);
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError('Error updating patient data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser || !currentUser.id) {
        setError('User not found. Please login again.');
        setLoading(false);
        return;
      }

      await axios.delete(`${BASE_URL}/api/patients/${id}?doctorId=${currentUser.id}`);
      navigate('/patients');
    } catch (err) {
      setError('Error deleting patient: ' + err.message);
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const handleDataChange = (field, value) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
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

  if (!patientData) {
    return (
      <Box p={3}>
        <Alert severity="error">Patient not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Patient Banner */}
      <PatientBanner 
        patientData={patientData} 
        onEdit={handleEdit}
        onDelete={handleOpenDeleteDialog}
      />

      {/* Navigation Tabs */}
      <Tabs
        value={value}
        onChange={handleChange}
        sx={{
          mb: 4,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            minWidth: 120,
            color: '#637381',
            '&.Mui-selected': {
              color: '#2065D1'
            }
          }
        }}
      >
        <Tab label="Overview" />
        <Tab label="Medical Record" />
        <Tab label="Schedule" />
      </Tabs>

      {/* Success and Error Snackbars */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Patient information updated successfully
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {value === 0 && (
        <Box>
          {/* Overview Section - Vitals */}
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <MonitorHeartOutlinedIcon /> Vitals
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Weight
                </Typography>
                {isEditing ? (
                  <TextField
                    value={patientData.weight || ''}
                    onChange={(e) => handleDataChange('weight', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Typography variant="h6">{patientData.weight ? `${patientData.weight} Kg` : 'Not recorded'}</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Heart Rate
                </Typography>
                {isEditing ? (
                  <TextField
                    value={patientData.heart_rate || ''}
                    onChange={(e) => handleDataChange('heart_rate', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Typography variant="h6">{patientData.heart_rate ? `${patientData.heart_rate} bpm` : 'Not recorded'}</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Body Temperature
                </Typography>
                {isEditing ? (
                  <TextField
                    value={patientData.body_temperature || ''}
                    onChange={(e) => handleDataChange('body_temperature', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Typography variant="h6">{patientData.body_temperature ? `${patientData.body_temperature} F` : 'Not recorded'}</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Blood Pressure
                </Typography>
                {isEditing ? (
                  <TextField
                    value={patientData.blood_pressure || ''}
                    onChange={(e) => handleDataChange('blood_pressure', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Typography variant="h6">{patientData.blood_pressure || 'Not recorded'}</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Overview Section - Medications */}
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 4, mb: 3 }}>
            <MedicationOutlinedIcon /> Medications
          </Typography>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            {isEditing ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Medication Name"
                    value={patientData.medication || ''}
                    onChange={(e) => handleDataChange('medication', e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Medication Doses"
                    value={patientData.medication_doses || ''}
                    onChange={(e) => handleDataChange('medication_doses', e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Medication Notes"
                    value={patientData.medication_notes || ''}
                    onChange={(e) => handleDataChange('medication_notes', e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            ) : (
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {patientData.medication || 'No current medications'}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {patientData.medication_doses || 'No dosage information'}
                </Typography>
                {patientData.medication_notes && (
                  <Typography color="text.secondary" sx={{ mt: 2 }}>
                    Notes: {patientData.medication_notes}
                  </Typography>
                )}
              </Box>
            )}
          </Paper>

          {isEditing && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  fetchPatientData(); // Revert changes by re-fetching
                }}
                sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>
      )}

      {value === 1 && (
        <Box>
          {/* Medical Information Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BloodtypeOutlinedIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="h6" fontWeight="600">
                    Blood Type & Allergies
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Blood Type"
                      value={patientData.blood_type || ''}
                      fullWidth
                      disabled={!isEditing}
                      onChange={(e) => handleDataChange('blood_type', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Allergies"
                      value={patientData.allergies || ''}
                      fullWidth
                      multiline
                      rows={3}
                      disabled={!isEditing}
                      onChange={(e) => handleDataChange('allergies', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MonitorHeartOutlinedIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="h6" fontWeight="600">
                    Vital Signs
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Blood Pressure"
                      value={patientData.blood_pressure || ''}
                      fullWidth
                      disabled={!isEditing}
                      onChange={(e) => handleDataChange('blood_pressure', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Body Temperature"
                      value={patientData.body_temperature || ''}
                      fullWidth
                      disabled={!isEditing}
                      onChange={(e) => handleDataChange('body_temperature', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Heart Rate"
                      value={patientData.heart_rate || ''}
                      fullWidth
                      disabled={!isEditing}
                      onChange={(e) => handleDataChange('heart_rate', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Weight"
                      value={patientData.weight || ''}
                      fullWidth
                      disabled={!isEditing}
                      onChange={(e) => handleDataChange('weight', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CoronavirusOutlinedIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="h6" fontWeight="600">
                    Diagnoses
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Chronic Conditions"
                      value={patientData.chronic_conditions || ''}
                      fullWidth
                      multiline
                      rows={3}
                      disabled={!isEditing}
                      onChange={(e) => handleDataChange('chronic_conditions', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Current Diagnoses"
                      value={patientData.current_diagnoses || ''}
                      fullWidth
                      multiline
                      rows={3}
                      disabled={!isEditing}
                      onChange={(e) => handleDataChange('current_diagnoses', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Previous Diagnoses"
                      value={patientData.previous_diagnoses || ''}
                      fullWidth
                      multiline
                      rows={3}
                      disabled={!isEditing}
                      onChange={(e) => handleDataChange('previous_diagnoses', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MedicalInformationOutlinedIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="h6" fontWeight="600">
                    Medication
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Medication Name"
                      value={patientData.medication || ''}
                      fullWidth
                      multiline
                      rows={3}
                      disabled={!isEditing}
                      onChange={(e) => handleDataChange('medication', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Medication Doses"
                      value={patientData.medication_doses || ''}
                      fullWidth
                      multiline
                      rows={3}
                      disabled={!isEditing}
                      onChange={(e) => handleDataChange('medication_doses', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Medication Notes"
                      value={patientData.medication_notes || ''}
                      fullWidth
                      multiline
                      rows={3}
                      disabled={!isEditing}
                      onChange={(e) => handleDataChange('medication_notes', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {isEditing && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  fetchPatientData(); // Revert changes by re-fetching
                }}
                sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            width: '100%',
            maxWidth: '450px',
            p: 2,
          }
        }}
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(2px)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          pb: 1
        }}>
          <Typography variant="h6" component="div" sx={{ fontSize: '1.25rem' }}>
            Delete Patient
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDeleteDialog}
            aria-label="close"
            sx={{ 
              '&:hover': { 
                backgroundColor: theme.palette.error.light,
                color: 'white'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2, py: 3 }}>
          <Typography sx={{ fontSize: '1rem' }}>
            Are you sure you want to delete this patient? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              textTransform: 'none',
              color: '#637381',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.error.dark
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientOverview; 