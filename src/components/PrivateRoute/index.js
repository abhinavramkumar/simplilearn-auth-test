import { Redirect } from '@reach/router';
import { useAuthState } from 'components/AuthContext';
import React from 'react';

const PrivateRoute = ({ component: Component, ...props }) => {
  const { isAuthenticated } = useAuthState();
  console.log({ isAuthenticated });

  return (
    isAuthenticated ? <Component {...props} /> : <Redirect to="/login" noThrow />
  );
};

export default PrivateRoute;