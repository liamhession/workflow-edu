import React, { useState } from 'react';
import useInterval from '../utils/useInterval';
import Layout from '../components/layout/Layout';
import Button from '../components/Button';
import Trees from '../svg/Trees';

// Commentary on it?
const MoonrisePage = () => {
  // Description of this workflow presented to the creating teacher
  const headlineDescription = 'Moonrise Breather - Breathing exercise meant to cultivate calm';
  const detailedDescription1 = 'Useful just before or just after a stressful assignment. Suggest a number of minutes for your student to spend breathing, but they can override with their own choice.';
  const detailedDescription2 = 'They can choose to focus their attention on the imagery of the moon slowly rising, or not.';

  // Page number lets us show different pages' content on the screen
  const [page, setPage] = useState(1);

  // Workflow settings to be updated by creating teacher. Cover things like Headers within the workflow, and question prompts.
  const headerLabel = 'Name for workflow';
  const [header, setHeader] = useState('Moonrise Breather');

  const suggestedTimeLabel = 'Suggested number of minutes:';
  const [suggestedTime, setSuggestedTime] = useState(3);

  const explanationP1Label = 'Explanation of Workflow, paragraph 1:';
  const [explanationP1, setExplanationP1] = useState('It can be very calming to simply sit still for a few minutes, breathing steadily. For this exercise, you should sit as still as possible, feeling your breath rise and fall, for the number of minutes your teacher selected, or for a different amount you choose.');

  const explanationP2Label = 'Explanation of Workflow, paragraph 2:';
  const [explanationP2, setExplanationP2] = useState('During this period of time, you may choose to "stare into space", close your eyes, or focus your gaze on the imagery on the next screen. The most important thing is to just be still, and breathe steadily.');

  const conclusionMessageLabel = 'Message to display when timer is finished:';
  const [conclusionMessage, setConclusionMessage] = useState('Well done! Hopefully you\'re feeling calmer after that');
  const [showConclusionMessage, setShowConclusionMessage] = useState(false);

  // When the breathing exercise is started, a countdown to the set minutes value begins
  const [minutesOfBreathing, setMinutesOfBreathing] = useState(suggestedTime);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  useInterval(() => {
    setShowConclusionMessage(true);
  }, isCountdownRunning ? minutesOfBreathing*60*1000 : null); 

  // The movement of the moon depends on ever-updating margin values
  const [moonTopOffset, setMoonTopOffset] = useState(128);
  const [moonLeftOffset, setMoonLeftOffset] = useState(80);

  // Functions that will begin updating the moon's position on some interval, once running
  useInterval(() => {
    setMoonTopOffset(moonTopOffset - 1);
  }, isCountdownRunning ? 5100 : null);
  useInterval(() => {
    setMoonLeftOffset(moonLeftOffset + 1);
  }, isCountdownRunning ? 2850 : null);

  return (
    <Layout>
      <section id="header" className="bg-yellow-200 py-6 md:py-12">
        <div className="container mx-auto px-8">
          <h1 className="text-green-600 text-xl lg:text-2xl xl:text-3xl font-bold leading-none">
            {headlineDescription}
          </h1>
          <p className="text-green-600 text-md lg:text-lg leading-none">
            {detailedDescription1}
          </p>
          <p className="text-green-600 text-md lg:text-lg leading-none">
            {detailedDescription2}
          </p>
        </div>
      </section>
      <section id="workflow-settings" className="bg-yellow-200 pb-4 md:pb-8">
        <h3 className="text-lg lg:text-xl text-center mb-4">Workflow settings</h3>
        <div className="container flex flex-row mx-auto w-3/4">
          <div className="flex-col w-1/2 px-2">
            <label className="block">
              <div className="workflow-settings-label pr-2">{headerLabel}</div>
              <input type="text" className="w-full" value={header} onChange={(event) => setHeader(event.target.value)} />
            </label>
            <label className="block">
              <div className="workflow-settings-label pr-2">{suggestedTimeLabel}</div>
              <input type="number" min="1" max="10" className="w-full" value={suggestedTime} onChange={(event) => setSuggestedTime(event.target.value)} />
            </label>
            <label className="block">
              <div className="workflow-settings-label pr-2">{conclusionMessageLabel}</div>
              <input type="text" className="w-full" value={conclusionMessage} onChange={(event) => setConclusionMessage(event.target.value)} />
            </label>
          </div>
          <div className="flex-col w-1/2 px-2">
            <label>
              <span className="workflow-settings-label block pr-2">{explanationP1Label}</span>
              <textarea
                className="w-full h-32 align-top"
                value={explanationP1}
                onChange={(event) => setExplanationP1(event.target.value)}
              />
            </label>
            <label>
              <span className="workflow-settings-label block pr-2">{explanationP2Label}</span>
              <textarea
                className="w-full h-32 align-top"
                value={explanationP2}
                onChange={(event) => setExplanationP2(event.target.value)}
              />
            </label>
          </div>
        </div>
      </section>
      <section id="app-simulation" className="py-8 md:py-16">
        { page === 1 &&
          <div className="container mx-auto px-2 py-4 overflow-scroll" style={{
            width: '304px',
            height: '609px',
            backgroundColor: '#D7DCE7',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='%237d93ac' fill-opacity='0.35'%3E%3Cpolygon fill-rule='evenodd' points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E")`,
          }}>
            <p className="text-center text-lg font-bold">{header}</p>
            <p className="text-lg leading-snug mt-3">{explanationP1}</p>
            <p className="text-lg leading-snug mt-3">{explanationP2}</p>
            <div className="text-lg mt-3">How many minutes would you like to do this exercise for?</div>
            <input type="number" min="1" max="10" value={minutesOfBreathing} onChange={(event) => setMinutesOfBreathing(event.target.value)} />
            <div className="button-container w-full text-center mt-1">
              <Button className="bg-indigo-600 mt-16"
                onClick={() => {
                  setPage(2);
                  setIsCountdownRunning(true);
                }}
              >Begin</Button>
            </div>
          </div>
        }
        { page === 2 &&
          <div className="relative container bg-gray-800 mx-auto overflow-hidden" style={{
            width: '304px',
            height: '609px',
          }}>
            <div className="relative z-10"><Trees height={609} width={914} /></div>
            <div className="absolute top-0 bg-gray-100 rounded-full w-16 h-16 z-0"
              style={{ marginTop: moonTopOffset, marginLeft: moonLeftOffset }}
            ></div>
            { showConclusionMessage &&
            <div className="absolute h-64 bottom-0 z-20 text-2xl text-purple-200">{conclusionMessage}</div>
            }
          </div>
        }
      </section>
    </Layout>
  );
};

export default MoonrisePage;