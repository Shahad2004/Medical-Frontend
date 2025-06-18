import { useState } from 'react';
import { Button, Select, MenuItem, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const Choose_role = () => {
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
    const [role, setRole] = useState('patient');

    const handleContinue = () => {
        loginWithRedirect({
            appState: { role }, 
            authorizationParams: {
                scope: 'openid profile email',
            },
        });
    };

    return (

        <div style={{ padding: '2rem' }}>
            <Typography variant="h5">Select your role:</Typography>
            <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{ width: '200px', marginTop: '1rem' }}
            >
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="patient">Patient</MenuItem>
            </Select>
            <Button variant="contained" onClick={handleContinue} sx={{ marginTop: '1rem' }}>
                Continue to Login
            </Button>
            {isAuthenticated && (
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => logout({ returnTo: window.location.origin })}
                    sx={{ marginBottom: '1rem' }}
                >
                    Logout
                </Button>
            )}

        </div>
    );
};

export default Choose_role;
