import React, { useState } from 'react';
import { Box, Typography, Paper, Switch, Button, TextField, FormControlLabel, Divider, MenuItem, Select } from '@mui/material';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ar');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');

  const handleDarkModeChange = (e) => setDarkMode(e.target.checked);
  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  const handleSavePassword = () => {
    // هنا تضع منطق تغيير كلمة المرور الحقيقي
    setSuccess('تم تغيير كلمة المرور بنجاح!');
    setPassword('');
    setNewPassword('');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} align="center">الإعدادات</Typography>
        <Divider sx={{ mb: 3 }} />
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>الوضع الليلي</Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleDarkModeChange} color="primary" />}
            label={darkMode ? 'مفعل' : 'غير مفعل'}
          />
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>اللغة</Typography>
          <Select
            value={language}
            onChange={handleLanguageChange}
            fullWidth
          >
            <MenuItem value="ar">العربية</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>تغيير كلمة المرور</Typography>
          <TextField
            label="كلمة المرور الحالية"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="كلمة المرور الجديدة"
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            fullWidth
            margin="dense"
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, borderRadius: 2 }}
            onClick={handleSavePassword}
            disabled={!password || !newPassword}
          >
            حفظ كلمة المرور
          </Button>
          {success && <Typography color="success.main" mt={2}>{success}</Typography>}
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings; 