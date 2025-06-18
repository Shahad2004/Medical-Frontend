import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  Stack,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import NotesIcon from '@mui/icons-material/Notes';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import PatientBanner from './common/PatientBanner';

const PatientSchedules = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [value, setValue] = React.useState(2);
  const theme = useTheme();
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const doctorId = user?.id;
        if (!doctorId) {
          setError('Doctor ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        console.log('Fetching appointments for patient ID:', id);
        console.log('Doctor ID:', doctorId);

        // Fetch patient data
        const patientResponse = await axios.get(`http://localhost:5000/api/patients/${id}?doctorId=${doctorId}`);
        setPatientData(patientResponse.data);

        // Fetch appointments
        const appointmentsResponse = await axios.get(`http://localhost:5000/api/appointments/${id}?doctorId=${doctorId}`);
        console.log('Appointments response:', appointmentsResponse.data);
        setScheduleItems(appointmentsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate(`/patient/${id}/overview`);
    } else if (newValue === 1) {
      navigate(`/patient/${id}/medical-record`);
    }
  };

  const handleOpenDeleteDialog = (appointmentId) => {
    setSelectedItemId(appointmentId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedItemId(null);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const doctorId = user?.id;

      await axios.delete(`http://localhost:5000/api/appointments/${selectedItemId}?doctorId=${doctorId}&patientId=${id}`);
      
      // Refresh appointments
      const response = await axios.get(`http://localhost:5000/api/appointments/${id}?doctorId=${doctorId}`);
      setScheduleItems(response.data);
      
      handleCloseDeleteDialog();
    } catch (err) {
      setError('Error deleting appointment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appointment) => {
    setEditingItem(appointment);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const doctorId = user?.id;

      await axios.put(`http://localhost:5000/api/appointments/${editingItem.id}?doctorId=${doctorId}`, {
        ...editingItem,
        patient_id: parseInt(id)
      });
      
      // Refresh appointments
      const response = await axios.get(`http://localhost:5000/api/appointments/${id}?doctorId=${doctorId}`);
      setScheduleItems(response.data);
      
      setIsEditing(false);
      setEditingItem(null);
    } catch (err) {
      setError('Error updating appointment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleEditChange = (field, value) => {
    setEditingItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Box p={3}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Patient Banner */}
      <PatientBanner patientData={patientData} />

      {/* Navigation Tabs */}
      <Tabs
        value={value}
        onChange={handleChange}
        sx={{
          mb: 4,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            minWidth: 120,
            '&.Mui-selected': {
              color: theme.palette.primary.main
            }
          }
        }}
      >
        <Tab label="Overview" />
        <Tab label="Medical Record" />
        <Tab label="Schedules" />
      </Tabs>

      {/* Schedule Content */}
      <Stack spacing={3}>
        {scheduleItems.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No appointments scheduled for this patient
            </Typography>
          </Paper>
        ) : (
          scheduleItems.map((appointment) => (
            <Paper
              key={appointment.id}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: '#fff',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CalendarTodayOutlinedIcon 
                    sx={{ 
                      color: theme.palette.primary.main,
                      fontSize: 24
                    }} 
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Appointment
                    </Typography>
                    <Typography color="text.primary">
                      {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      Status: {appointment.status}
                    </Typography>
                    {appointment.notes && (
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Notes: {appointment.notes}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(appointment)}
                    sx={{
                      backgroundColor: '#2065D1',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: 1,
                      px: 2,
                      '&:hover': {
                        backgroundColor: '#1939B7'
                      }
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => handleOpenDeleteDialog(appointment.id)}
                    sx={{
                      backgroundColor: '#FF4842',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: 1,
                      px: 2,
                      '&:hover': {
                        backgroundColor: '#B72136'
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
            </Paper>
          ))
        )}
      </Stack>

      {/* Edit Dialog */}
      <Dialog 
        open={isEditing} 
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Date"
              type="date"
              value={editingItem?.appointment_date || ''}
              onChange={(e) => handleEditChange('appointment_date', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              value={editingItem?.appointment_time || ''}
              onChange={(e) => handleEditChange('appointment_time', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Status"
              select
              value={editingItem?.status || 'scheduled'}
              onChange={(e) => handleEditChange('status', e.target.value)}
              fullWidth
            >
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="no-show">No Show</MenuItem>
            </TextField>
            <TextField
              label="Notes"
              multiline
              rows={3}
              value={editingItem?.notes || ''}
              onChange={(e) => handleEditChange('notes', e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Cancel</Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this appointment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientSchedules; 