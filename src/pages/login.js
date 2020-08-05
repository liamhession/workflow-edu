import React from 'react';
import { useNavigate } from '@reach/router';
import Layout from '../components/layout/Layout';
import { Widget } from '../components/IdentityWidget/app';

const Login = () => {
  const navigate = useNavigate();

  // Define redirect-to-profile page function, to be run on successful login or signup
  const navigateToProfile = () => navigate('/educator/profile');

  return (
    <Layout>
      <div id="loginSignupContainer" className="w-4/5 sm:w-3/5 mx-auto mt-3">
        <Widget onLogin={navigateToProfile} onSignup={navigateToProfile} />
      </div>
    </Layout>
  )
};

export default Login;