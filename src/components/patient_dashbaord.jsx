import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const PatientDashboard = () => {
    const { user, isLoading, isAuthenticated } = useAuth0();
    const { logout } = useAuth0();

    if (isLoading) return <div>Loading...</div>;

    const role = user && user['https://dev-qlw0g85a5jy1lise.us.auth0.com/role'];

    return (
        <div>
            <h1>My App</h1>
            <button onClick={() => logout({ returnTo: window.location.origin })}>
                Logout
            </button>
            <h2>My Patient Dashboard</h2>
            {isAuthenticated && role === 'patient' ? (
                <p>Welcome, {user.name}</p>
            ) : (
                <p>Unauthorized</p>
            )}
        </div>
    );
};

export default PatientDashboard;
