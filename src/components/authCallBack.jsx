// // src/pages/AuthCallback.jsx
// import { useEffect } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import { useNavigate } from 'react-router-dom';

// const AuthCallback = () => {
//   const { handleRedirectCallback, isLoading } = useAuth0();
//   const navigate = useNavigate();

//  useEffect(() => {
//   const handleAuthRedirect = async () => {
//     await handleRedirectCallback();
//     navigate('/'); // ✅ Let App.jsx handle role redirection
//   };
//   handleAuthRedirect();
// }, [handleRedirectCallback, navigate]);

//   return <div>{isLoading ? 'Processing login...' : 'Redirecting...'}</div>;
// };

// export default AuthCallback;
