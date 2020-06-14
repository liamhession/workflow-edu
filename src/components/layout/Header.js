import React from 'react';
import { Link } from '@reach/router';
import Button from '../Button';

const Header = ({
  isLoggedIn,
  clickLogin,
}) => (
  <header className="sticky top-0 bg-white shadow">
    <div className="container flex flex-row justify-between items-center mx-auto py-2 px-4">
      <Link to="/">
        <div className="flex items-center">
          <div className="w-36 mr-3">
            <span className="text-primary-darker text-lg lg:text-2xl">Workflow Edu</span>
          </div>
          <div className="hidden lg:block ml-8">
            <Link to="/#mission">
              <span className="text-primary text-md">Our Mission</span>
            </Link>
          </div>
        </div>
      </Link>
      <div>
        { isLoggedIn
        ?
          <Link to="/profile">
            <Button className="text-sm py-1 px-2 sm:py-3 sm:px-8">Profile</Button>
          </Link>
        :
          <Button className="text-sm py-1 px-2 sm:py-3 sm:px-8" onClick={() => { console.log('clicked'); clickLogin(); }}>Sign Up</Button>
        }
      </div>
    </div>
  </header>
);

export default Header;
