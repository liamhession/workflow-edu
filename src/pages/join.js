import React, { useState, useEffect } from 'react';
import { useNavigate } from '@reach/router';
import PropTypes from 'prop-types';
import { getLocalItem, setLocalItem, removeLocalItem } from '../utils/localStorage';
import { Signup } from '../components/StandaloneSignup';
import ClickableCard from '../components/ClickableCard';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Layout from '../components/layout/Layout';

const NUMBER_OF_QUESTIONS = 4;
const getQuestionComponent = (number) => {
  if (number === 1) return <QuestionOne />;
  else if (number === 2) return <QuestionTwo />;
  else if (number === 3) return <QuestionThree />;
  else if (number === NUMBER_OF_QUESTIONS) return <SubmitPanel />;
};

const SubmitPanel = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const submitResponses = (user) => {
    const responses = getLocalItem('onboardingResponses');

    // This being the callback for onSubmit, we are passed the user details 
    responses.user = user;

    // Add a time of submission field so we can sort by that
    responses.timeSubmitted = Date.now();

    fetch('/.netlify/functions/write-firestore', {
      body: JSON.stringify(responses),
      method: 'POST',
    });

    setSubmitted(true);

    navigate('/profile');
  };

  return (
    <section id="submit-responses" className="px-6 pt-8 lg:pb-20 lg:pt-18">
      <div className="container mx-auto text-center">
        <div className="flex flex-col">
          <Card className="mb-8 bg-gray-100 px-8 py-8">
            { submitted
            ?
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold">Thanks! Check your inbox for a confirmation email. Then we'll be able to start designing some Workflows!</h2>
            </div>
            :
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold">Thanks for sharing with us. Complete your user registration below, to join our community and associate your responses with your user account.</h2>
              <Signup onSignup={submitResponses} />
            </div>
            }
          </Card>
        </div>
      </div>
    </section>
  );
};

const QuestionThree = () => {
  return (
    <section id="question-three" className="px-6 pt-8 lg:pb-20 lg:pt-18">
      <div className="container mx-auto text-center">
        <h2 className="text-xl lg:text-2xl font-semibold">Phrase(s) to best describe your current communication preferences:</h2>
        <div className="flex flex-col sm:flex-row sm:-mx-3 mt-10">
          <div className="flex-1 px-3">
            <ClickableCard className="mb-8" responseKey="communication-detailed-emails">
              <div className="font-semibold text-xl text-center mx-auto">
                <div className="inline-block align-middle">Send me a detailed email!</div>
              </div>
            </ClickableCard>
          </div>
          <div className="flex-1 px-3">
            <ClickableCard className="mb-8" responseKey="communication-video-messages">
              <div className="font-semibold text-xl text-center mx-auto">
                <div className="inline-block align-middle">Video messages appreciated!</div>
              </div>
            </ClickableCard>
          </div>
          <div className="flex-1 px-3">
            <ClickableCard className="mb-8" responseKey="communication-texts">
              <div className="font-semibold text-xl text-center mx-auto">
                <div className="inline-block align-middle">Ping me in short form! Texts rock!</div>
              </div>
            </ClickableCard>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:-mx-3 mt-2">
          <div className="flex-1 px-3">
            <ClickableCard className="mb-8" responseKey="communication-slack">
              <div className="font-semibold text-xl text-center mx-auto">
                <div className="inline-block align-middle">You'll find me interacting on the message boards</div>
              </div>
            </ClickableCard>
          </div>
          <div className="flex-1 px-3">
            <ClickableCard className="mb-8" responseKey="communication-none">
              <div className="font-semibold text-xl text-center mx-auto">
                <div className="inline-block align-middle">Tight schedule currently. Check back soon!</div>
              </div>
            </ClickableCard>
          </div>
        </div>
      </div>
    </section>
  );
};

const QuestionTwo = () => {
  const handleChange = (event) => {
    const latestInspirationText = event.target.value;

    const onboardingResponses = getLocalItem('onboardingResponses');
    onboardingResponses['whatInspiresMe'] = latestInspirationText;
    setLocalItem('onboardingResponses', onboardingResponses);
  };
  return (
    <section id="question-two" className="px-6 pt-8 lg:pb-20 lg:pt-18">
      <div className="container mx-auto text-center">
        <h2 className="text-xl lg:text-2xl font-semibold">When are you most inspired? What's the most surefire spark for your inspiration?</h2>
        <div className="flex flex-col sm:flex-row sm:-mx-3 mt-10">
          <div className="flex-1 px-3">
            <Card className="mb-8 bg-gray-100 px-4 py-4">
              <div className="font-semibold text-xl text-center mx-auto">
                <textarea
                  className="p-2 w-full h-48"
                  // style={{ width: '100%', height: '200px' }}
                  placeholder="Give as much detail as you like here..."
                  onChange={handleChange}
                ></textarea>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

const QuestionOne = () => {
  return (
    <section id="question-one" className="px-6 pt-8 lg:pb-20 lg:pt-18">
      <div className="container mx-auto text-center">
        <h2 className="text-xl lg:text-2xl font-semibold">When you feel like you're being completely flooded with work, which of these activities do you turn to, to regain composure? You can also select ones you would consider trying sometime.</h2>
        <div className="flex flex-col sm:flex-row sm:-mx-3 mt-10">
          <div className="flex-1 px-3">
            <ClickableCard className="mb-8" responseKey="walk">
              <div className="font-semibold text-xl text-center mx-auto">
                <div className="inline-block align-middle m-2"><Icon kind="walk" size={30} /></div>
                <div className="inline-block align-middle">Going for a walk</div>
              </div>
              <p className="mt-4">
                Sometimes just taking a stroll around the block can get you back to baseline.
              </p>
            </ClickableCard>
          </div>
          <div className="flex-1 px-3">
            <ClickableCard className="mb-8" responseKey="conversation">
              <div className="font-semibold text-xl text-center mx-auto">
                <div className="inline-block align-middle m-2"><Icon kind="conversation" size={30} /></div>
                <div className="inline-block align-middle">Venting to another person</div>
              </div>
              <p className="mt-4">
                Sometimes laying out your frustrations and difficulties to someone you trust is enough to make it all feel more manageable.
              </p>
            </ClickableCard>
          </div>
          <div className="flex-1 px-3">
            <ClickableCard className="mb-8" responseKey="meditation">
              <div className="font-semibold text-xl text-center mx-auto">
                <div className="inline-block align-middle m-2"><Icon kind="yin-yang" size={30} /></div>
                <div className="inline-block align-middle">Meditation</div>
              </div>
              <p className="mt-4">
                Also known as "having a nice sit". Even a session that didn't really clear your mind counts, because you tried!
              </p>
            </ClickableCard>
          </div>
        </div>
      </div>
    </section>
  );
};

const JoinPage = () => {
  // Clear localStorage of any onboardingResponses that exist from previous runs
  useEffect(() => {
    removeLocalItem('onboardingResponses');
  }, []); // only run it when these variables change, i.e. only on first load

  const [questionNumber, setQuestionNumber] = useState(1);

  return (
    <Layout mainStyle={{
      backgroundColor: '#F7F7ED',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2305ba42' fill-opacity='0.19'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"`,
    }}>
      <section id="header" className="pt-20">
        <div className="container mx-auto px-8">
          <h1 className="text-green-600 text-4xl lg:text-5xl xl:text-6xl font-bold leading-none">
            We're excited to welcome you aboard!
            <br />
            We'll be working together on building out your perfect Workflows in no time.
          </h1>
          <div className="info pt-2 text-gray-700 text-sm font-bold">Teachers: for now, you're seeing the Student onboarding flow, but just answer honestly from your own experience. This will help us develop our student product. Thanks!</div>
        </div>
      </section>
      <section id="question-header" className="pt-10">
        {questionNumber < NUMBER_OF_QUESTIONS && <h2 className="text-center text-3xl lg:text-4xl xl:text-5xl font-bold">Question {questionNumber}</h2>}
        <div className="flex justify-between px-16">
          <Button className={`py-1 px-2 sm:py-2 sm:px-4 ${questionNumber > 1 ? 'visible' : 'invisible'}`}
            onClick={() => setQuestionNumber(questionNumber-1)}
          >{'<prev'}</Button>
          <Button className={`py-1 px-2 sm:py-2 sm:px-4 ${questionNumber < NUMBER_OF_QUESTIONS  ? 'visible' : 'invisible'}`}
            onClick={() => setQuestionNumber(questionNumber+1)}
          >{'next>'}</Button>
        </div>
      </section>
      {getQuestionComponent(questionNumber)}
    </Layout>
  );
};

// JoinPage.propTypes = {
// };

export default JoinPage;