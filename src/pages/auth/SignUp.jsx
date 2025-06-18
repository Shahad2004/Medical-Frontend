import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, Alert } from '@mui/material';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [role, setRole] = useState('doctor');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== rePassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', { email, password, role });
      const user = res.data.user;
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/PatientDashboard');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Sign up failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8, p: 4, background: '#fff', borderRadius: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>Sign Up</Typography>
      <form onSubmit={handleSignUp}>
        <Typography>Email</Typography>
        <TextField
          fullWidth
          margin="normal"
          placeholder="Enter Your Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Typography mt={2}>Enter Your Password</Typography>
        <TextField
          fullWidth
          margin="normal"
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Typography mt={2}>Re-write Your Password</Typography>
        <TextField
          fullWidth
          margin="normal"
          type="password"
          placeholder="Enter Your Password"
          value={rePassword}
          onChange={e => setRePassword(e.target.value)}
        />
        <Box display="flex" alignItems="center" mt={2} mb={2}>
          <FormControlLabel
            control={<Checkbox checked={role === 'patient'} onChange={() => setRole('patient')} />}
            label="Patient"
          />
          <FormControlLabel
            control={<Checkbox checked={role === 'doctor'} onChange={() => setRole('doctor')} />}
            label="Doctor"
          />
          <Box flexGrow={1} />
          <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Forgot Password?</Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button type="submit" fullWidth variant="contained" sx={{ background: '#2979ff', borderRadius: 3, py: 1.2, fontWeight: 'bold' }}>
          Sign Up
        </Button>
      </form>
      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Already have an account? <span style={{ color: '#2979ff', cursor: 'pointer' }} onClick={() => navigate('/login')}>Log In</span>
        </Typography>
      </Box>
    </Box>
  );
} 