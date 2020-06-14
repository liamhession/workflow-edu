import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { getLocalItem, setLocalItem } from '../utils/localStorage';

const ClickableCard = ({
  children,
  className,
  responseKey,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  // Update the contents of localStorage's list of their preferred items to include/not include this
  const onCardClick = () => {
    const nowClicked = !isClicked;
    setIsClicked(nowClicked);

    const onboardingResponses = getLocalItem('onboardingResponses');
    if (nowClicked) {
      onboardingResponses[responseKey] = true;
    } else {
      delete onboardingResponses[responseKey];
    }
    setLocalItem('onboardingResponses', onboardingResponses);
  };

  return (
    <div
      className={`cursor-pointer p-8 rounded-lg border border-solid border-gray-200 ${className} ${isClicked?'bg-blue-300':'bg-gray-100'}`}
      style={{
        boxShadow: '0 10px 28px rgba(0,0,0,.21)',
      }}
      onClick={onCardClick}
    >
      {children}
    </div>
  );
};

ClickableCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  responseKey: PropTypes.string,
};

export default ClickableCard;
