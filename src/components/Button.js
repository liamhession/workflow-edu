import React from 'react';

const Button = ({ children, className = '', onClick }) => {
  return (
    <button
      type="button"
      className={`
        ${className}
        px-1
        bg-primary
        hover:bg-primary-darker
        rounded
        text-white
    `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
