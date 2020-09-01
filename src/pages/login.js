import React from 'react';
import { useNavigate } from '@reach/router';
import queryString from 'query-string';
import Layout from '../components/layout/Layout';
import { IdentityWidget } from '../components/IdentityWidget/app';

const Login = ({ location }) => {
  const queryParams = location.search ? queryString.parse(location.search) : {};

  const navigate = useNavigate();

  // Define "redirect to dashboard" page function, to be run on successful login or signup
  const navigateToDashboard = () => navigate('/educator/dashboard');

  return (
    <Layout>
      <div id="loginSignupContainer" className="w-4/5 sm:w-3/5 mx-auto mt-3">
        <IdentityWidget
          onLogin={navigateToDashboard}
          onSignup={navigateToDashboard}
          indexToShowFirst={queryParams.signup ? 1 : 0}
        />
      </div>
    </Layout>
  )
};

export default Login;