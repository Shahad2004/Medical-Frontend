import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Paper,
  Stack,
  Avatar,
  Button,
  Tabs,
  Tab,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Backdrop,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import PatientBanner from './common/PatientBanner';

const MedicalRecord = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [value, setValue] = useState(1);
  const theme = useTheme();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [patientData, setPatientData] = useState(null);
  
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

      const response = await axios.get(`http://localhost:5000/api/patients/${id}?doctorId=${currentUser.id}`);
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
    if (newValue === 0) {
      navigate(`/patient/${id}/overview`);
    } else if (newValue === 2) {
      navigate(`/patient/${id}/schedule`);
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

      await axios.delete(`http://localhost:5000/api/patients/${id}?doctorId=${currentUser.id}`);
      navigate('/patients');
    } catch (err) {
      setError('Error deleting patient: ' + err.message);
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
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

      const response = await axios.put(`http://localhost:5000/api/patients/${id}?doctorId=${currentUser.id}`, patientData);
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
        onEdit={() => setIsEditing(true)}
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
          },
          '& .Mui-selected': {
            color: theme.palette.primary.main,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
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
          Patient medical record updated successfully
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
                {isEditing ? (
                  <TextField
                    label="Blood Type"
                    value={patientData.blood_type || ''}
                    fullWidth
                    onChange={(e) => handleDataChange('blood_type', e.target.value)}
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <Typography component="span" fontWeight="medium">Blood Type:</Typography> {patientData.blood_type || 'N/A'}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                {isEditing ? (
                  <TextField
                    label="Allergies"
                    value={patientData.allergies || ''}
                    fullWidth
                    multiline
                    rows={3}
                    onChange={(e) => handleDataChange('allergies', e.target.value)}
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <Typography component="span" fontWeight="medium">Allergies:</Typography> {patientData.allergies || 'No observations or notes'}
                  </Typography>
                )}
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
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <TextField
                    label="Chronic Conditions"
                    value={patientData.chronic_conditions || ''}
                    fullWidth
                    multiline
                    rows={3}
                    onChange={(e) => handleDataChange('chronic_conditions', e.target.value)}
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <Typography component="span" fontWeight="medium">Chronic Conditions:</Typography> {patientData.chronic_conditions || 'N/A'}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <TextField
                    label="Current Diagnoses"
                    value={patientData.current_diagnoses || ''}
                    fullWidth
                    multiline
                    rows={3}
                    onChange={(e) => handleDataChange('current_diagnoses', e.target.value)}
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <Typography component="span" fontWeight="medium">Current Diagnoses:</Typography> {patientData.current_diagnoses || 'N/A'}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                {isEditing ? (
                  <TextField
                    label="Previous Diagnoses"
                    value={patientData.previous_diagnoses || ''}
                    fullWidth
                    multiline
                    rows={3}
                    onChange={(e) => handleDataChange('previous_diagnoses', e.target.value)}
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <Typography component="span" fontWeight="medium">Previous Diagnoses:</Typography> {patientData.previous_diagnoses || 'N/A'}
                  </Typography>
                )}
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

export default MedicalRecord;
