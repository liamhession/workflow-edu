import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/Button';

// "Let's put ourselves in the presence of the Lord, and be mindful of his great great love for us"

// From "DAY BY DAY WITH THE CATECHISM: MINUTE MEDITATIONS FOR EVERY DAY CONTAINING AN EXCERPT FROM THE CATECHISM,
//    A REFLECTION, AND A PRAYER" (https://cbp-assets.s3.amazonaws.com/pdfs/9781937913540.pdf)
// BEING in the image of God, the human
// individual possesses the dignity of a
// person, who is not just something, but
// someone.
const MemoryJogPage = () => {
  // Description of this workflow presented to the creating teacher
  const headlineDescription = 'Daily Catechism - A mini reflection on faith and the Church';
  const detailedDescription1 = 'This Workflow allows you to share a passage from the Catechism of the Catholic Church with your student(s).';
  const detailedDescription2 = 'Following the passage, you can offer your own reflections, and on the next page a prayer. Finally you can create a question that prompts reflection on the student\'s part.';
  // If any person, institution, or primary source material is to be credited
  const credit = '(Based off suggestions from Matt Halbach, and material from the book "Day By Day With The Catechism")';

  // Page number lets us show different pages' content on the screen
  const [page, setPage] = useState(1);

  // Workflow settings to be updated by creating teacher. In this case they cover the passage, reflection, prayer, and question prompt.
  const titleLabel = 'Title for the theme of this catechism';
  const [title, setTitle] = useState('On being a proper person');

  const catechismPassageLabel = 'Passage from the Catechism of the Catholic Church';
  const [catechismPassage, setCatechismPassage] = useState('BEING in the image of God, the human individual possesses the dignity of a person, who is not just something, but someone.');

  const reflectionLabel = 'A reflection on that passage';
  const [reflection, setReflection] = useState('The only beings in the known universe who share the title of “person” are humans, angels, and the three divine persons of the Holy Trinity, Father, Son, and Holy Spirit. We are in good company.');

  const prayerLabel = 'A prayer for student to intone';
  const [prayer, setPrayer] = useState('Triune God, Father, Son, and Holy Spirit, help us to fully live our personhood, which we share with you.');

  const prompt1Name = 'Post-prayer prompt for student:';
  const [prompt1, setPrompt1] = useState('What are some characteristics you share with the angels and Triune God, on account of your personhood?');

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
              <div className="workflow-settings-label pr-2">{titleLabel}</div>
              <input type="text" className="w-full" value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
            <label>
              <span className="workflow-settings-label block pr-2">{catechismPassageLabel}</span>
              <textarea
                className="w-full h-32 align-top"
                value={catechismPassage}
                onChange={(event) => setCatechismPassage(event.target.value)}
              />
            </label>
            <label>
              <span className="workflow-settings-label block pr-2">{reflectionLabel}</span>
              <textarea
                className="w-full h-32 align-top"
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
              />
            </label>
          </div>
          <div className="flex-col w-1/2 px-2">
            <label>
              <span className="workflow-settings-label block pr-2">{prayerLabel}</span>
              <textarea
                className="w-full h-32 align-top"
                value={prayer}
                onChange={(event) => setPrayer(event.target.value)}
              />
            </label>
            <label className="block">
              <div className="workflow-settings-label pr-2">{prompt1Name}</div>
              <input type="text" className="w-full" value={prompt1} onChange={(event) => setPrompt1(event.target.value)} />
            </label>
          </div>
        </div>
      </section>
      <section id="app-simulation" className="py-8 md:py-16">
        <div className="container mx-auto bg-red-200 px-2 py-4 overflow-scroll" style={{
          width: '304px',
          height: '609px',
          backgroundColor: '#DCE5DB',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='church-on-sunday' fill='%2396d99e' fill-opacity='0.4'%3E%3Cpath d='M77.17 0H80v2.83l-.1.1A39.9 39.9 0 0 1 74.64 20a39.9 39.9 0 0 1 5.24 17.06l.11.11v2.89c-.01 6.9-1.8 13.79-5.35 19.94A39.96 39.96 0 0 1 80 79.94V80h-2.83L66.84 69.66a39.83 39.83 0 0 1-24.1 10.25l.09.09h-5.66l.1-.1c-8.7-.58-17.22-4-24.1-10.23L2.82 80H0V79.94c.01-6.9 1.8-13.8 5.35-19.94A39.96 39.96 0 0 1 0 40.06V37.17l.1-.1A39.9 39.9 0 0 1 5.36 20 39.9 39.9 0 0 1 .1 2.94L0 2.83V0h2.83l-.1.1a39.83 39.83 0 0 1 24.1 10.24L37.18 0H40c0 6.92-1.78 13.83-5.35 20A39.96 39.96 0 0 1 40 40c0-6.92 1.78-13.83 5.35-20A39.96 39.96 0 0 1 40 0h2.83l10.33 10.34A39.83 39.83 0 0 1 77.26.09L77.17 0zm.77 77.94c-.3-5.52-1.8-11-4.49-16a40.18 40.18 0 0 1-5.17 6.34l9.66 9.66zm-12.52-9.7l-6.83-6.83-5.46 5.46-1.41 1.41-9.66 9.66c8.4-.45 16.69-3.68 23.36-9.7zm-23.07 6.58l7.99-7.98a40.05 40.05 0 0 1-3.79-4.9 37.88 37.88 0 0 0-4.2 12.88zM47.68 60a37.98 37.98 0 0 0 4.07 5.42L57.17 60l-5.42-5.42A38 38 0 0 0 47.68 60zm2.66-6.84a40.06 40.06 0 0 0-3.79 4.9 37.88 37.88 0 0 1-4.2-12.88l7.99 7.98zm1.38-1.44l1.41 1.41 5.46 5.46 6.83-6.84a37.85 37.85 0 0 0-23.36-9.7l9.66 9.67zM60 60l6.87 6.87A38.1 38.1 0 0 0 72.32 60a38.11 38.11 0 0 0-5.45-6.87L60 60zm-14.65 0a39.9 39.9 0 0 0-5.24 17.06l-.11.11-.1-.1A39.9 39.9 0 0 0 34.64 60a39.9 39.9 0 0 0 5.24-17.06l.11-.11.1.1A39.9 39.9 0 0 0 45.36 60zm9.23-48.25a37.85 37.85 0 0 1 23.36-9.7l-9.66 9.67-1.41 1.41-5.46 5.46-6.83-6.84zm13.67 13.67L62.83 20l5.42-5.42A38 38 0 0 1 72.32 20a37.98 37.98 0 0 1-4.07 5.42zm5.2-3.47a40.05 40.05 0 0 1-3.79 4.89l7.99 7.98c-.61-4.45-2.01-8.82-4.2-12.87zm-6.58 4.92l1.41 1.41 9.66 9.66a37.85 37.85 0 0 1-23.36-9.7l6.83-6.83 5.46 5.46zM53.13 13.13L60 20l-6.87 6.87A38.11 38.11 0 0 1 47.68 20a38.1 38.1 0 0 1 5.45-6.87zm-1.41-1.41l-9.66-9.66c.3 5.52 1.8 11 4.49 16a40.18 40.18 0 0 1 5.17-6.34zm-9.66 26.22c.3-5.52 1.8-11 4.49-16a40.18 40.18 0 0 0 5.17 6.34l-9.66 9.66zm26.22 13.78l9.66-9.66c-.3 5.52-1.8 11-4.49 16a40.18 40.18 0 0 0-5.17-6.34zm8.98-11.81L66.84 50.34a39.83 39.83 0 0 0-24.1-10.25l10.42-10.43a39.83 39.83 0 0 0 24.1 10.25zm-7.6-26.75a40.06 40.06 0 0 1 3.79 4.9 37.88 37.88 0 0 0 4.2-12.88l-7.99 7.98zm-31.72 28.9c-8.4.45-16.69 3.68-23.36 9.7l6.83 6.83 5.46-5.46 1.41-1.41 9.66-9.66zM22.83 60l5.42 5.42c1.54-1.7 2.9-3.52 4.07-5.42a38 38 0 0 0-4.07-5.42L22.83 60zm5.45 8.28l-1.41-1.41-5.46-5.46-6.83 6.84a37.85 37.85 0 0 0 23.36 9.7l-9.66-9.67zm9.37 6.54l-7.99-7.98a40.05 40.05 0 0 0 3.79-4.9 37.88 37.88 0 0 1 4.2 12.88zM20 60l-6.87-6.87A38.11 38.11 0 0 0 7.68 60a38.11 38.11 0 0 0 5.45 6.87L20 60zm17.26-19.9L26.84 29.65a39.83 39.83 0 0 1-24.1 10.25l10.42 10.43a39.83 39.83 0 0 1 24.1-10.25zm-35.2 1.96l9.66 9.66a40.18 40.18 0 0 0-5.17 6.33c-2.7-5-4.2-10.47-4.5-16zm4.49 19.89c-2.7 5-4.2 10.47-4.5 16l9.67-9.67a40.18 40.18 0 0 1-5.17-6.33zm31.1-16.77c-.61 4.45-2.01 8.82-4.2 12.87a40.06 40.06 0 0 0-3.79-4.89l7.99-7.98zm-4.2-23.23c2.7 5 4.2 10.47 4.5 16l-9.67-9.67c1.97-1.97 3.7-4.1 5.17-6.33zm-14.86-.54l6.83 6.84a37.85 37.85 0 0 1-23.36 9.7l9.66-9.67 1.41-1.41 5.46-5.46zm-8.25 5.43l-7.99 7.98c.61-4.45 2.01-8.82 4.2-12.87a40.04 40.04 0 0 0 3.79 4.89zm1.41-1.42A37.99 37.99 0 0 1 7.68 20a38 38 0 0 1 4.07-5.42L17.17 20l-5.42 5.42zm-5.2-7.37a40.04 40.04 0 0 1 3.79-4.89L2.35 5.18c.61 4.45 2.01 8.82 4.2 12.87zm6.58-4.92l-1.41-1.41-9.66-9.66a37.85 37.85 0 0 1 23.36 9.7l-6.83 6.83-5.46-5.46zm13.74 13.74L20 20l6.87-6.87A38.1 38.1 0 0 1 32.32 20a38.1 38.1 0 0 1-5.45 6.87zm6.58-8.82a40.18 40.18 0 0 0-5.17-6.33l9.66-9.66c-.3 5.52-1.8 11-4.49 16z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}>
          <p className="text-center text-lg font-extrabold">{title}</p>
          {page === 1 &&
            <div className="w-full">
              <p className="text-xl leading-snug mt-2 font-bold">“{catechismPassage}”</p>
              <p className="text-lg leading-snug mt-3 font-semibold"><span className="text-red-500 font-bold mr-1">Reflection.</span>{reflection}</p>
              <div className="button-container w-full text-center mt-16">
                <Button onClick={() => setPage(2)}>Start Prayer</Button>
              </div>
            </div>
          }
          {page === 2 &&
            <div className="w-full">
              <p className="text-3xl leading-snug mt-2 font-semibold italic"><span className="text-red-500 font-bold not-italic mr-2">Prayer.</span>{prayer}</p>
              <div className="button-container w-full text-center mt-16">
                <Button onClick={() => setPage(3)}>Answer Question</Button>
              </div>
            </div>
          }
          {page === 3 &&
            <div className="w-full">
              <label className="mx-2">
                <div className="student-prompts-label pr-2">{prompt1}</div>
                <textarea className="w-full h-24 align-top" />
              </label>
            </div>
          }
        </div>
      </section>
    </Layout>
  );
};

export default MemoryJogPage;