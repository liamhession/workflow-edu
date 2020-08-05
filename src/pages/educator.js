// Entrypoint for authenticated client-only routes within Workflow Edu
import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import Profile from './educator/profile';
import Dashboard from './educator/dashboard';
import Login from './login';
import { useIdentityContext } from 'react-netlify-identity-widget';
import { navigate } from 'gatsby';

function PrivateRoute (props) {
  const { isLoggedIn } = useIdentityContext();
  const { component: Component, location, ...rest } = props;

  useEffect(
    () => {
      console.log('isLoggedIn=', isLoggedIn);
      if (!isLoggedIn && location.pathname !== `/login`) {
        // If the user is not logged in, redirect to the login page.
        navigate(`/login`);
      }
    },
    [isLoggedIn, location]
  );
  return isLoggedIn ? <Component {...rest} /> : null;
}

const EducatorApp = () => {
  return (
    <Router basepath="/educator">
      <PrivateRoute path="/profile" component={Profile} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <Login path="/login" />
    </Router>
  );
};

export default EducatorApp;