// Type stuff commented out throughout these files. Could be re-created with React PropTypes
import React from 'react';
import { Login } from './components/login';
import { Logout } from './components/logout';
import { Signup } from './components/signup';
import { User, useIdentityContext } from 'react-netlify-identity';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';

// export type AuthProps = {
//   onLogin?: (user?: User) => void
//   onSignup?: (user?: User) => void
//   onLogout?: () => void
// };

function LoggedOutScreen({
  onLogin,
  onSignup,
  indexToShowFirst,
}) {  //: AuthProps) {
  return (
    <div>
      <Tabs defaultIndex={indexToShowFirst}>
        <TabList className="RNIW_header">
          <Tab className="RNIW_btn RNIW_btnHeader">Login</Tab>
          <Tab className="RNIW_btn RNIW_btnHeader">Sign Up</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Login onLogin={onLogin} />
          </TabPanel>
          <TabPanel>
            <Signup onSignup={onSignup} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

function LoggedInScreen({ onLogout }) {  //: AuthProps) {
  return <Logout onLogout={onLogout} />;
}

export function IdentityWidget(props) {   //: AuthProps) {
  const identity = useIdentityContext();
  const isLoggedIn = Boolean(identity && identity.user);
  return isLoggedIn ? <LoggedInScreen {...props} /> : <LoggedOutScreen {...props} />;
}
