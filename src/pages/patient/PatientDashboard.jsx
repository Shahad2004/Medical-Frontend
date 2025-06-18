import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  useTheme,
  Chip,
  Divider,
} from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});
  const theme = useTheme();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.id) {
          setError('User not found. Please log in again.');
          setLoading(false);
          return;
        }

        console.log('Fetching appointments for patient ID:', user.id);

        // Fetch appointments for the logged-in patient
        const response = await axios.get(`${BASE_URL}/api/appointments/patient/${user.id}`);
        console.log('Appointments response:', response.data);
        setAppointments(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to fetch appointments: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [appointmentId]: true }));
      
      const user = JSON.parse(localStorage.getItem('user'));
      
      await axios.put(`${BASE_URL}/api/appointments/${appointmentId}`, {
        status: newStatus,
        patient_id: user.id
      });

      // Update local state
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Failed to update appointment status: ' + err.message);
    } finally {
      setUpdating(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'no-show':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'no-show':
        return 'No Show';
      default:
        return status;
    }
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
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          My Appointments
        </Typography>
        <Typography color="text.secondary">
          View and manage your scheduled appointments
        </Typography>
      </Box>

      {/* Appointments List */}
      <Stack spacing={3}>
        {appointments.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No appointments scheduled
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Your doctor will schedule appointments for you here.
            </Typography>
          </Paper>
        ) : (
          appointments.map((appointment) => (
            <Paper
              key={appointment.id}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: '#fff',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flex: 1 }}>
                  <CalendarTodayOutlinedIcon 
                    sx={{ 
                      color: theme.palette.primary.main,
                      fontSize: 24,
                      mt: 0.5
                    }} 
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Appointment
                      </Typography>
                      <Chip 
                        label={getStatusLabel(appointment.status)}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Typography color="text.primary" sx={{ mb: 1 }}>
                      {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                    
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      Time: {appointment.appointment_time}
                    </Typography>
                    
                    {appointment.doctor_name && (
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        Doctor: {appointment.doctor_name}
                      </Typography>
                    )}
                    
                    {appointment.notes && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography color="text.secondary">
                          <strong>Notes:</strong> {appointment.notes}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {appointment.status === 'scheduled' && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={false}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.checked ? 'completed' : 'scheduled')}
                          disabled={updating[appointment.id]}
                          icon={<CheckCircleOutlineIcon />}
                          checkedIcon={<CheckCircleOutlineIcon color="success" />}
                          sx={{
                            '&.Mui-checked': {
                              color: theme.palette.success.main,
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" color="text.secondary">
                          {updating[appointment.id] ? 'Updating...' : 'Mark as completed'}
                        </Typography>
                      }
                    />
                  )}
                  
                  {appointment.status === 'completed' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleOutlineIcon color="success" />
                      <Typography variant="body2" color="success.main" fontWeight={500}>
                        Completed
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default PatientDashboard;