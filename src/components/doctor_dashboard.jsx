import React from 'react';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import MedicationIcon from '@mui/icons-material/Medication';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';

const DoctorDashboard = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Welcome back, Dr. [Name]
      </Typography>
      
      <Grid container spacing={4}>
        {/* Patients Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            minHeight: 180,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                10
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Patients
              </Typography>
              <PeopleIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button variant="outlined" fullWidth>View</Button>
            </Box>
          </Card>
        </Grid>

        {/* Active Medication Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            minHeight: 180,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                8
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Active Medication
              </Typography>
              <MedicationIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button variant="outlined" fullWidth>View</Button>
            </Box>
          </Card>
        </Grid>

        {/* Upcoming Reminders Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            minHeight: 180,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                2
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upcoming Reminders
              </Typography>
              <NotificationsIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button variant="outlined" fullWidth>View</Button>
            </Box>
          </Card>
        </Grid>

        {/* Missed Medications Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            minHeight: 180,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                3
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Missed Medications
              </Typography>
              <WarningIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button variant="outlined" fullWidth>View</Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorDashboard;