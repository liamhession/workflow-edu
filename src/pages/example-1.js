import React, { useState } from 'react';
import Layout from '../components/layout/Layout';

const Example1Page = () => {

  const [nameOfClass, setNameOfClass] = useState('Class Name');
  const [initialPrompt, setInitialPrompt] = useState('While that homework is fresh in your mind, take a minute or two to write down some notes about what we are currently working on in this class. These notes will be shared with you just before class tomorrow to help orient yourself just before class starts.');

  // Two of the workflow settings allow the teacher to set the two prompts asked of a student getting this workflow
  const [prompt1, setPrompt1] = useState('What did you just work on?');
  const [prompt2, setPrompt2] = useState('What do you want to ask the teacher in class?');

  return (
    <Layout>
      <section id="header" className="bg-yellow-200 py-6 md:py-12">
        <div className="container mx-auto px-8">
          <h1 className="text-green-600 text-xl lg:text-2xl xl:text-3xl font-bold leading-none">
            Post-homework recap - For student to review before class
          </h1>
          <p className="text-green-600 text-md lg:text-lg leading-none">
            This workflow is assigned for when they have completed their homework for your class. It asks them to spend 1 minute noting down what they've worked on, and what they should expect to talk about during class.
          </p>
          <p className="text-green-600 text-md lg:text-lg leading-none">
            They will be reminded to review these notes just before class starts, so that they are well-oriented before the start-of-period bell rings.
          </p>
          <div className="info pt-2 text-gray-700 text-sm font-bold">(Based off suggestions from Natalia Wachli)</div>
        </div>
      </section>
      <section id="workflow-settings" className="bg-yellow-200 pb-4 md:pb-8">
        <h3 className="text-lg lg:text-xl text-center mb-4">Workflow settings</h3>
        <div className="container flex flex-row mx-auto w-3/4">
          <div className="flex-col w-1/2 px-2">
            <label id="class-name" className="block">
              <div className="workflow-settings-label pr-2">Name of class:</div>
              <input type="text" className="w-full" value={nameOfClass} onChange={(event) => setNameOfClass(event.target.value)} />
            </label>
            <label id="prompt-1" className="block">
              <div className="workflow-settings-label pr-2">First prompt for student:</div>
              <input type="text" className="w-full" value={prompt1} onChange={(event) => setPrompt1(event.target.value)} />
            </label>
            <label id="prompt-2" className="block">
              <div className="workflow-settings-label pr-2">Second prompt for student:</div>
              <input type="text" className="w-full" value={prompt2} onChange={(event) => setPrompt2(event.target.value)} />
            </label>
          </div>
          <div className="flex-col w-1/2 px-2">
            <label id="initial-prompt">
              <span className="workflow-settings-label block pr-2">Explanation of Workflow:</span>
              <textarea
                className="w-full h-32 align-top"
                value={initialPrompt}
                onChange={(event) => setInitialPrompt(event.target.value)}
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
          <p className="text-center text-lg font-bold">{nameOfClass}</p>
          <p className="text-lg leading-snug">{initialPrompt}</p>
          <div className="w-full">
            <label id="student-prompt-1" className="mx-2">
              <div className="student-prompts-label pr-2">{prompt1}</div>
              <textarea className="w-full h-24 align-top" />
            </label>
          </div>
          <div className="w-full">
            <label id="student-prompt-2" className="mx-2">
              <div className="student-prompts-label pr-2">{prompt2}</div>
              <textarea className="w-full h-24 align-top" />
            </label>
          </div>
          <div className="button-container w-full text-center mt-1">
            <button type="submit" className="px-2 py-1 rounded bg-gray-400">Submit</button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Example1Page;