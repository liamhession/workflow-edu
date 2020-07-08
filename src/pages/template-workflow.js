import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/Button';

// Commentary on it?
const TemplateWorkflowPage = () => {
  // Description of this workflow presented to the creating teacher
  const headlineDescription = 'Multi-word Name For It - Subtitle name for it with detail';
  const detailedDescription1 = 'Rationale or how it\'s used';
  const detailedDescription2 = 'Mechanics of how it appears or something else';
  // If any person, institution, or primary source material is to be credited
  const credit = '(Based off suggestions from X)';

  // Workflow settings to be updated by creating teacher. Cover things like Headers within the workflow, and question prompts.
  const thingName = 'e.g. Name of class:';
  const [thing, setThing] = useState('Default');

  const bigTextName = 'e.g. Explanation of Workflow:';
  const [bigText, setBigText] = useState('Lot of big text initially');

  const prompt1Name = 'First prompt for student:';
  const [prompt1, setPrompt1] = useState('What did you just work on?');

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
          <div className="info pt-2 text-gray-700 text-sm font-bold">
            {credit}
          </div>
        </div>
      </section>
      <section id="workflow-settings" className="bg-yellow-200 pb-4 md:pb-8">
        <h3 className="text-lg lg:text-xl text-center mb-4">Workflow settings</h3>
        <div className="container flex flex-row mx-auto w-3/4">
          <div className="flex-col w-1/2 px-2">
            <label className="block">
              <div className="workflow-settings-label pr-2">{thingName}</div>
              <input type="text" className="w-full" value={thing} onChange={(event) => setThing(event.target.value)} />
            </label>
            <label className="block">
              <div className="workflow-settings-label pr-2">{prompt1Name}</div>
              <input type="text" className="w-full" value={prompt1} onChange={(event) => setPrompt1(event.target.value)} />
            </label>
          </div>
          <div className="flex-col w-1/2 px-2">
            <label>
              <span className="workflow-settings-label block pr-2">{bigTextName}</span>
              <textarea
                className="w-full h-32 align-top"
                value={bigText}
                onChange={(event) => setBigText(event.target.value)}
              />
            </label>
          </div>
        </div>
      </section>
      <section id="app-simulation" className="py-8 md:py-16">
        <div className="container mx-auto bg-red-200 px-2 py-4 overflow-scroll" style={{
          width: '304px',
          height: '609px',
          backgroundColor: '#DFDBE5',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}>
          <p className="text-center text-lg font-bold">{thingName}</p>
          <p className="text-lg leading-snug">{bigText}</p>
          <div className="w-full">
            <label className="mx-2">
              <div className="student-prompts-label pr-2">{prompt1}</div>
              <textarea className="w-full h-24 align-top" />
            </label>
          </div>
          <div className="button-container w-full text-center mt-1">
            <Button>Submit</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TemplateWorkflowPage;