import React, { useState } from 'react';
import Header from './Header';
import IdentityModal, { useIdentityContext } from '../IdentityWidget';
import 'react-netlify-identity-widget/styles.css';

const Layout = ({ mainStyle, children }) => {
  const identity = useIdentityContext(); // see https://github.com/sw-yx/react-netlify-identity for api of this identity object
  const [dialogShown, setDialogShown] = useState(false);

  console.log(JSON.stringify(identity));
  const isLoggedIn = identity && identity.isLoggedIn;
  return (
    <div className='min-h-screen'>
      <Header isLoggedIn={isLoggedIn} />
      <main style={mainStyle}>{children}</main>
      <IdentityModal
        showDialog={dialogShown}
        onCloseDialog={() => setDialogShown(false)}

        // Can add these and they will go through
        onLogin={(user = {}) => console.log('hello ', user.user_metadata)}
        // onSignup={(user) => console.log('welcome ', user!.user_metadata)}
        // onLogout={() => console.log('bye ', name)}
      />
    </div>
  );
};

export default Layout;