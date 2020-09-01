// Displays the 5 mood smiley options students have, so teachers can remind themselves what 1-5 associate to
import React from 'react';

import Button from './Button';
import mood1 from '../images/1.png';
import mood2 from '../images/2.png';
import mood3 from '../images/3.png';
import mood4 from '../images/4.png';
import mood5 from '../images/5.png';

const WellbeingKey = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <div className="wellbeing-key-container md:w-1/3 max-w-xs mx-auto">
      <div className="text-xl">Wellbeing Key<Button className="ml-2 text-lg" onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? 'Hide' : 'Show'}</Button></div>
      <div className={'flex flex-row'+(isExpanded ? '' : ' hidden')}>
        <div className="flex flex-col w-1/5">
          <img src={mood1} />
          <div className="text-lg font-semibold">1</div>
        </div>
        <div className="flex flex-col w-1/5">
          <img src={mood2} />
          <div className="text-lg font-semibold">2</div>
        </div>
        <div className="flex flex-col w-1/5">
          <img src={mood3} />
          <div className="text-lg font-semibold">3</div>
        </div>
        <div className="flex flex-col w-1/5">
          <img src={mood4} />
          <div className="text-lg font-semibold">4</div>
        </div>
        <div className="flex flex-col w-1/5">
          <img src={mood5} />
          <div className="text-lg font-semibold">5</div>
        </div>
      </div>
    </div>
  );
};

export default WellbeingKey;
