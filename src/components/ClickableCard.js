import React, { useState } from 'react';
import PropTypes from 'prop-types'

const ClickableCard = ({
  children,
  className,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      className={`cursor-pointer p-8 rounded-lg border border-solid border-gray-200 ${className} ${isClicked?'bg-blue-300':'bg-gray-100'}`}
      style={{
        boxShadow: '0 10px 28px rgba(0,0,0,.21)',
      }}
      onClick={() => setIsClicked(!isClicked)}
    >
      {children}
    </div>
  );
};

ClickableCard.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};

export default ClickableCard;
