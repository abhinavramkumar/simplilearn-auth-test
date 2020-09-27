import 'react-toastify/dist/ReactToastify.css';

import { Router } from '@reach/router';
import AuthContext, { useAuthDispatch } from 'components/AuthContext';
import PrivateRoute from 'components/PrivateRoute';
import PublicRoute from 'components/PublicRoute';
import React, { useEffect, useState } from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import Dashboard from 'screens/Dashboard';
import Login from 'screens/Login';
import PageNotFound from 'screens/PageNotFound';
import SignUp from 'screens/SignUp';

const checkAuthStatus = async () => {
  try {
    const response = await fetch("/api/auth/is-user-authenticated", {
      method: "get",
      headers: {
        "content-type": "application/json"
      }
    });
    const responseJson = await response.json();

    return responseJson;

  } catch (error) {
    return {
      status: "failure",
      message: "failed to fetch"
    };
  }
};

// Create 404 page
const App = () => {
  const dispatch = useAuthDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // call when app loads
    checkAuthStatus().then((response) => {
      setIsLoading(false);
      dispatch({
        isAuthenticated: response.isAuthenticated
      });
    });
  }, []);
  return (
    <>
      {isLoading ? (<p>Loading... </p>) : (<Router>
        <PublicRoute path="/signup" component={SignUp} />
        <PublicRoute path="/login" component={Login} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/" component={Dashboard} />
        <PageNotFound default />
      </Router>)}

      <ToastContainer autoClose={3500} hideProgressBar
        pauseOnHover={false}
        transition={Slide} />
    </>
  );
};

export default App;