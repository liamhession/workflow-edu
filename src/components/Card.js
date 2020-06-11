import React from 'react';
import PropTypes from 'prop-types'

const Card = ({ 
  children,
  className,
}) => (
  <div
    className={`p-12 rounded-lg border border-solid border-gray-200 ${className}`}
    style={{
      boxShadow: '0 10px 28px rgba(0,0,0,.08)',
    }}
  >
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};

export default Card;
