import React, { useState } from 'react';
import IdentityModal, { useIdentityContext } from 'react-netlify-identity-widget';
import 'react-netlify-identity-widget/styles.css';

const Layout = ({ mainStyle, children }) => {
  const identity = useIdentityContext(); // see https://github.com/sw-yx/react-netlify-identity for api of this identity object
  const [dialogShown, setDialogShown] = useState(false);
  const name =
    (identity && identity.user && identity.user.user_metadata && identity.user.user_metadata.name) || "NoName";

  console.log(JSON.stringify(identity));
  const isLoggedIn = identity && identity.isLoggedIn;
  return (
    <>
      <nav style={{ background: "green" }}>
        {" "}
        Login Status:
        <button className="btn" onClick={() => setDialogShown(true)}>
          {isLoggedIn ? `Hello ${name}, Log out here!` : "LOG IN"}
        </button>
      </nav>
      <main style={mainStyle}>{children}</main>
      <IdentityModal
        showDialog={dialogShown}
        onCloseDialog={() => setDialogShown(false)}
      />
    </>
  );
};

export default Layout;