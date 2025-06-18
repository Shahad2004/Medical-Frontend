import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTheme } from '@mui/material/styles';

const PatientBanner = ({ 
  patientData, 
  onEdit, 
  onDelete, 
  showActions = true 
}) => {
  const theme = useTheme();

  if (!patientData) {
    return null;
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 4, 
        background: '#fff',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: '#f5f5f5',
              color: '#637381',
              fontSize: '2rem'
            }}
          >
            {patientData.full_name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              {patientData.full_name}
            </Typography>
            <Stack spacing={0.5}>
              <Typography color="text.secondary">
                {patientData.gender} · {new Date(patientData.date_of_birth).toLocaleDateString()}
              </Typography>
              <Typography color="text.secondary">
                {patientData.email}
              </Typography>
              <Typography color="text.secondary">
                {patientData.phone}
              </Typography>
            </Stack>
          </Box>
        </Box>
        {showActions && (
          <Stack direction="row" spacing={2}>
            {onEdit && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={onEdit}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                    color: 'white',
                    borderColor: theme.palette.primary.light
                  }
                }}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={onDelete}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: theme.palette.error.light,
                    color: 'white',
                    borderColor: theme.palette.error.light
                  }
                }}
              >
                Remove Patient
              </Button>
            )}
          </Stack>
        )}
      </Box>
    </Paper>
  );
};

export default PatientBanner; 