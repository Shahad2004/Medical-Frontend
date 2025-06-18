import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  styled,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

const TimeColumn = styled(Box)({
  width: '60px',
  '& .time': {
    color: '#637381',
    fontSize: '0.75rem',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const DayColumn = styled(Box)({
  flex: 1,
  textAlign: 'center',
  '& .dayName': {
    color: '#637381',
    fontSize: '0.875rem'
  },
  '& .dayNumber': {
    color: '#212B36',
    fontSize: '0.875rem',
    marginTop: '4px'
  },
  '&.active .dayNumber': {
    color: '#2065D1'
  }
});

const AppointmentCard = styled(Box)(({ color = '#3366FF' }) => ({
  position: 'absolute',
  backgroundColor: color === '#00B8D9' ? 'rgba(0, 184, 217, 0.08)' : 'rgba(51, 102, 255, 0.08)',
  borderLeft: `3px solid ${color}`,
  borderRadius: '8px',
  padding: '8px 12px',
  width: '180px',
  '& .title': {
    color: '#212B36',
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: '4px'
  },
  '& .medicine': {
    color: '#637381',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2px'
  },
  '& .time': {
    color: '#637381',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center'
  }
}));

const weekDays = [
  { day: 'Sun', date: '14' },
  { day: 'Mon', date: '15' },
  { day: 'Tue', date: '16', active: true },
  { day: 'Wed', date: '17' },
  { day: 'Thu', date: '18' },
  { day: 'Fri', date: '19' },
  { day: 'Sat', date: '20' }
];

const timeSlots = Array.from({ length: 10 }, (_, i) => {
  const hour = i + 9;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [form, setForm] = useState({
    date: '',
    time: '',
    notes: '',
    patientId: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchAssignedPatients();
  }, []);

  const fetchAssignedPatients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const doctorId = user?.id;
      console.log('Current user from localStorage:', user);
      console.log('Doctor ID being used:', doctorId);
      
      if (!doctorId) {
        setError('Doctor ID not found. Please log in again.');
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/patients/assigned/${doctorId}`);
      console.log('API response for assigned patients:', response.data);
      setAssignedPatients(response.data);
    } catch (err) {
      console.error('Failed to fetch assigned patients:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const doctorId = user?.id;
      if (!doctorId) {
        setError('Doctor ID not found. Please log in again.');
        setLoading(false);
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/appointments?doctorId=${doctorId}`);
      // معالجة البيانات لتناسب العرض
      const mapped = response.data.map((apt) => {
        // استخراج اليوم من appointment_date
        const dateObj = new Date(apt.appointment_date);
        const weekDay = dateObj.toLocaleDateString('en-US', { weekday: 'short' }); // ex: 'Sun', 'Mon', ...
        return {
          ...apt,
          day: weekDay,
          time: apt.appointment_time?.slice(0,5),
          title: apt.patient_name || 'Appointment',
          medicine: apt.notes || '',
        };
      });
      setAppointments(mapped);
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const doctorId = user?.id;
      const token = user?.token;
      
      if (!form.patientId) {
        setErrorMsg('Please select a patient');
        return;
      }
      
      const payload = {
        doctor_id: doctorId,
        patient_id: form.patientId,
        appointment_date: form.date,
        appointment_time: form.time,
        notes: form.notes
      };
      await axios.post('http://localhost:5000/api/appointments', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccessMsg('Appointment added successfully!');
      setOpen(false);
      setForm({ date: '', time: '', notes: '', patientId: '' });
      fetchAppointments();
    } catch (err) {
      setErrorMsg('Failed to add appointment');
    }
  };

  const handleSnackbarClose = () => {
    setSuccessMsg('');
    setErrorMsg('');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        <IconButton sx={{ color: '#637381' }}>
          <ChevronLeft />
        </IconButton>
        <Typography sx={{ mx: 2, color: '#212B36', fontWeight: 500 }}>
          February
        </Typography>
        <IconButton sx={{ color: '#637381' }}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Add Appointment Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            ml: 2,
            borderRadius: '10px',
            color: '#fff',
            backgroundColor: '#40A2E3',
            '&:hover': {
              backgroundColor: '#3595d1',
            },
          }}
          onClick={handleOpen}
        >
          Add Appointment
        </Button>
      </Box>

      {/* Dialog لإضافة موعد جديد */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Appointment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Date"
            name="date"
            type="date"
            fullWidth
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Time"
            name="time"
            type="time"
            fullWidth
            value={form.time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Notes"
            name="notes"
            fullWidth
            value={form.notes}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="patient-label">Patient</InputLabel>
            <Select
              labelId="patient-label"
              id="patient"
              name="patientId"
              value={form.patientId}
              label="Patient"
              onChange={handleChange}
            >
              {assignedPatients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.full_name} ({patient.file_number})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar للنجاح أو الخطأ */}
      <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>
      <Snackbar open={!!errorMsg} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>

      {/* Calendar Grid */}
      <Box sx={{ display: 'flex' }}>
        {/* Time Column */}
        <TimeColumn>
          <Box sx={{ height: '60px' }}>
            <Typography variant="body2" sx={{ color: '#637381', textAlign: 'center' }}>
              Week
            </Typography>
          </Box>
          {timeSlots.map((time) => (
            <Box key={time} className="time">
              {time}
            </Box>
          ))}
        </TimeColumn>

        {/* Days Columns */}
        {weekDays.map((day) => (
          <DayColumn key={day.day} className={day.active ? 'active' : ''}>
            <Box sx={{ height: '60px', borderBottom: '1px solid #f0f0f0' }}>
              <Typography className="dayName">{day.day}</Typography>
              <Typography className="dayNumber">{day.date}</Typography>
            </Box>
            <Box sx={{ height: '480px', position: 'relative', borderRight: '1px solid #f0f0f0' }}>
              {appointments
                .filter((apt) => apt.day === day.day)
                .map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    sx={{
                      top: apt.top,
                      left: '8px',
                      right: '8px'
                    }}
                    color={apt.color}
                  >
                    <Typography className="title">{apt.title}</Typography>
                    <Typography className="medicine">{apt.medicine}</Typography>
                    <Typography className="time">
                      <AccessTimeIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
                      {apt.time}
                    </Typography>
                  </AppointmentCard>
                ))}
            </Box>
          </DayColumn>
        ))}
      </Box>
    </Box>
  );
};

export default Appointments; 