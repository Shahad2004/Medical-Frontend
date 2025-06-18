import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  MenuItem,
  Paper,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Favorite,
  LocalHospital,
  Medication,
  Bloodtype,
  AccessTime,
  Scale,
  Warning,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const PatientForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    file_number: `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    full_name: '',
    date_of_birth: '',
    gender: 'male',
    phone: '',
    email: '',
    address: '',
    blood_type: '',
    allergies: '',
    blood_pressure: '',
    body_temperature: '',
    heart_rate: '',
    weight: '',
    chronic_conditions: '',
    current_diagnoses: '',
    previous_diagnoses: '',
    medication: '',
    medication_doses: '',
    medication_notes: '',
    // doctor_id will be set dynamically from current user
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get current user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const doctorId = user?.id;
      
      if (!doctorId) {
        setError('User not found. Please log in again.');
        setLoading(false);
        return;
      }

      // Update formData with current doctor_id
      const updatedFormData = { ...formData, doctor_id: doctorId };
      
      const response = await axios.post(`${BASE_URL}/api/patients`, updatedFormData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/patients');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ px: "50px", py: 4, bgcolor: "#fff", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
        <Grid container spacing={4}>
          {/* Left Column - Patient Details */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 3,
                color: "#1976d2",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Person /> Patient Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#1976d2" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#1976d2" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: "#1976d2" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Blood Pressure"
                  name="blood_pressure"
                  value={formData.blood_pressure}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Favorite sx={{ color: "#d32f2f" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Body Temperature"
                  name="body_temperature"
                  value={formData.body_temperature}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTime sx={{ color: "#ed6c02" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ mb: 1 }}>Gender</Typography>
                <RadioGroup 
                  row 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio color="primary" />}
                    label="Male"
                    sx={{ mr: 2 }}
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio color="primary" />}
                    label="Female"
                  />
                </RadioGroup>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Heart Rate"
                  name="heart_rate"
                  value={formData.heart_rate}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Favorite sx={{ color: "#d32f2f" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Scale sx={{ color: "#388e3c" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column - Medical Records + Medication */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 3,
                color: "#1976d2",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LocalHospital /> Medical Records
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Blood Type"
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Bloodtype sx={{ color: "#d32f2f" }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  {bloodTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Warning sx={{ color: "#ed6c02" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Chronic Conditions"
                  name="chronic_conditions"
                  value={formData.chronic_conditions}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Current Diagnoses"
                  name="current_diagnoses"
                  value={formData.current_diagnoses}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Previous Diagnoses"
                  name="previous_diagnoses"
                  value={formData.previous_diagnoses}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mt: 4,
                mb: 3,
                color: "#1976d2",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Medication /> Medication History
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Medication"
                  name="medication"
                  value={formData.medication}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Medication sx={{ color: "#7b1fa2" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Doses" 
                  name="medication_doses"
                  value={formData.medication_doses}
                  onChange={handleChange}
                  fullWidth 
                  variant="outlined" 
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Notes" 
                  name="medication_notes"
                  value={formData.medication_notes}
                  onChange={handleChange}
                  fullWidth 
                  variant="outlined" 
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              bgcolor: "#1976d2",
              px: 5,
              py: 1.5,
              fontSize: 16,
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": { bgcolor: "#1565c0" },
            }}
          >
            {loading ? 'Saving...' : '+ Save'}
          </Button>
        </Box>
      </Paper>

      <Snackbar 
        open={success} 
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Patient added successfully!
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientForm;
