import { Redirect } from '@reach/router';
import { useAuthState } from 'components/AuthContext';
import React from 'react';

const PublicRoute = ({ component: Component, ...props }) => {
  const { isAuthenticated } = useAuthState();
  console.log({ isAuthenticated });

  return (
    isAuthenticated ? <Redirect to="/dashboard" noThrow /> : <Component {...props} />
  );


};

export default PublicRoute;