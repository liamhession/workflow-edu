import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ kind, color = '#000', height, width, size = 32 }) => {
  const renderSVG = kind => {
    switch (kind) {
    default:
      return null;

    case 'conversation':
      return (
        <svg width={width || size} height={height || size} viewBox="0 0 20 20">
          <path d="M17 11v3l-3-3H8a2 2 0 0 1-2-2V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1zm-3 2v2a2 2 0 0 1-2 2H6l-3 3v-3H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h2v3a4 4 0 0 0 4 4h6z"/> 
        </svg>
      );  
    case 'walk':
      return (
        <svg width={width || size} height={height || size} viewBox="0 0 20 20">
          <path d="M11 7l1.44 2.16c.31.47 1.01.84 1.57.84H17V8h-3l-1.44-2.16a5.94 5.94 0 00-1.4-1.4l-1.32-.88a1.72 1.72 0 00-1.7-.04L4 6v5h2V7l2-1-3 14h2l2.35-7.65L11 14v6h2v-8l-2.7-2.7L11 7zm1-3a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      );  
    case 'yin-yang':
      return (
        <svg width={width || size} height={height || size} viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 20a10 10 0 110-20 10 10 0 010 20zm0-18a8 8 0 100 16 4 4 0 110-8 4 4 0 100-8zm0 13a1 1 0 100-2 1 1 0 000 2zm0-8a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      );
    
    case 'google-g-logo':
      return (
        <svg
          width={width || size}
          height={height || size}
        >
          <g fill='#000' fillRule='evenodd'>
            <path d='M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z' fill='#EA4335'></path>
            <path d='M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z' fill='#4285F4'></path>
            <path d='M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z' fill='#FBBC05'></path>
            <path d='M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z' fill='#34A853'></path>
            <path fill='none' d='M0 0h18v18H0z'></path>
          </g>
        </svg>
      );
    }
  };

  return (
    <span className='global-icon'>
      {renderSVG(kind)}
    </span>
  );
};

Icon.propTypes = {
  kind: PropTypes.string.isRequired,
  color: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  size: PropTypes.number,
};

export default Icon;