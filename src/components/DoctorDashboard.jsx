import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import MedicationIcon from '@mui/icons-material/Medication';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';

const stats = [
  { value: 10, label: 'Patients', icon: PeopleIcon, color: '#3db4f2', nav: '/patients' },
  { value: 8, label: 'Active Medication', icon: MedicationIcon, color: '#3db4f2', nav: '/doctor-appointments' },
  { value: 2, label: 'Upcoming Reminders', icon: NotificationsIcon, color: '#3db4f2' },
  { value: 3, label: 'Missed Medications', icon: WarningIcon, color: '#3db4f2' },
];

const StatCard = ({ value, label, Icon, color, nav, navigate }) => (
  <Card
    elevation={2}
    sx={{
      width: '600px',
      height: '200px',
      borderRadius: 6,
      display: 'flex',
      backgroundColor: '#f2f2f2',
      overflow: 'hidden',
      cursor: nav ? 'pointer' : 'default',
      transition: 'transform 0.15s',
      '&:hover': { transform: nav ? 'scale(1.03)' : 'none' }
    }}
    onClick={nav ? () => navigate(nav) : undefined}
  >
    <Box
      sx={{
        backgroundColor: color,
        width: '60%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        p: 3.5,
        color: 'white',
      }}
    >
      <Typography variant="h2" fontWeight="bold" sx={{ fontSize: '2.8rem' }}>
        {value}
      </Typography>
      <Typography variant="h5">
        {label}
      </Typography>
    </Box>
    <Box
      sx={{
        backgroundColor: '#2f3e5e',
        width: '40%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        position: 'relative',
      }}
    >
      <Icon sx={{ fontSize: 60 }} />
      {nav && (
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <IconButton
            size="large"
            sx={{ color: 'white' }}
            onClick={e => { e.stopPropagation(); navigate(nav); }}
          >
            <ChevronRightIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      )}
    </Box>
  </Card>
);

export default function DoctorDashboard() {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
  const isMedium = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const size = isLarge ? 'large' : isMedium ? 'medium' : 'small';
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 5, backgroundColor: 'white', borderRadius: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={5} sx={{ fontSize: '1.8rem', textAlign: 'center' }}>
        Welcome back, Dr. [Name] 👋
      </Typography>

      <Grid 
        container 
        spacing={5}
        justifyContent="center"
        alignItems="center"
      >
        {stats.map((stat, index) => (
          <Grid 
            item 
            xs={12} 
            sm={12} 
            lg={6} 
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <StatCard
              value={stat.value}
              label={stat.label}
              Icon={stat.icon}
              color={stat.color}
              nav={stat.nav}
              navigate={navigate}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
