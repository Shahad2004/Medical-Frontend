import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';


const domain = 'dev-qlw0g85a5jy1lise.us.auth0.com';
const clientId = 'EBcAL3O79EQRWTn8CuudQCk33JxvoXbY';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          scope: "openid profile email",
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
