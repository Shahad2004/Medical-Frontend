import { useLocation, Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  Dashboard as OverviewIcon,
  People as PatientsIcon,
  CalendarToday as AppointmentsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import { People as PeopleIcon } from '@mui/icons-material';
import { Event as EventIcon } from '@mui/icons-material';
import { Schedule as ScheduleIcon } from '@mui/icons-material';

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get user from localStorage to determine role
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPatient = user.role === 'patient';

  const doctorMenuItems = [
    {
      text: 'Overview',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      text: 'Patients',
      icon: <PeopleIcon />,
      path: '/patients'
    },
    {
      text: 'Appointments',
      icon: <EventIcon />,
      path: '/appointments'
    },
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: '/settings' 
    },
  ];

  const patientMenuItems = [
    {
      text: 'Schedule',
      icon: <ScheduleIcon />,
      path: '/PatientDashboard'
    }
  ];

  const menuItems = isPatient ? patientMenuItems : doctorMenuItems;

  return (
    <List>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={isMobile ? item.text : ''} placement="right">
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  backgroundColor: isActive ? '#e6f0ff' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#f0f4ff',
                  },
                  borderRadius: '8px',
                  mx: 1,
                  my: 0.5,
                  justifyContent: isMobile ? 'center' : 'flex-start',
                  px: isMobile ? 1.5 : 2,
                  minHeight: 48
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#2b6cb0' : '#4a5568',
                    minWidth: 0,
                    mr: isMobile ? 'auto' : 2,
                    justifyContent: 'center'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isMobile && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      color: isActive ? '#2b6cb0' : '#4a5568',
                      fontWeight: isActive ? 'bold' : 'normal',
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  );
};

export default Sidebar;