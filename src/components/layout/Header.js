import React from 'react';
import { Link } from '@reach/router';
import Button from '../Button';

const Header = ({
  isLoggedIn,
}) => (
  <header className="sticky top-0 z-50 bg-white shadow">
    <div className="container flex flex-row justify-between items-center mx-auto py-2 px-4">
      <div className="flex items-center">
        <div className="w-36 mr-3">
          <Link to="/">
            <span className="text-primary-darker text-lg sm:text-2xl">Workflow Edu</span>
          </Link>
        </div>
        <div className="hidden sm:block ml-8">
          <Link to="/#mission">
            <span className="text-primary text-md">Our Mission</span>
          </Link>
        </div>
      </div>
      <div>
        { isLoggedIn
        ?
          <Link to="/educator/dashboard">
            <Button className="text-sm py-1 px-2 sm:py-3 sm:px-8">Dashboard</Button>
          </Link>
        :
          <Link to="/login">
            <Button className="text-sm py-1 px-2 sm:py-3 sm:px-8">Sign Up</Button>
          </Link>
        }
      </div>
    </div>
  </header>
);

export default Header;
