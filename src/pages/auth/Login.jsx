import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, Alert } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      let user = res.data.user;
      if (res.data.token) {
        user = { ...user, token: res.data.token };
      }
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/PatientDashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8, p: 4, background: '#fff', borderRadius: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>Welcome Back!</Typography>
      <form onSubmit={handleLogin}>
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
        <Box display="flex" alignItems="center" mt={2} mb={2}>
          <Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} />
          <Typography>Remember Me</Typography>
          <Box flexGrow={1} />
          <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Forgot Password?</Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button type="submit" fullWidth variant="contained" sx={{ background: '#2979ff', borderRadius: 3, py: 1.2, fontWeight: 'bold' }}>
          Log In
        </Button>
      </form>
      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          New here? <span style={{ color: '#2979ff', cursor: 'pointer' }} onClick={() => navigate('/signup')}>Create an account to get started.</span>
        </Typography>
      </Box>
    </Box>
  );
} 