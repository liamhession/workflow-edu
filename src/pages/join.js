import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ClickableCard from '../components/ClickableCard';
import Card from '../components/Card';
import Icon from '../components/Icon';
// import Layout from '../components/layout/Layout';

const getQuestionComponent = (number) => {
  if (number === 1) return <QuestionOne />;
  else if (number === 2) return <QuestionTwo />;
};

const QuestionTwo = () => {
  return (
    <section id="question-two" className="pt-8 lg:pb-20 lg:pt-18">
      <div className="container mx-auto text-center">
        <h2 className="text-xl lg:text-2xl font-semibold">When are you most inspired? What's the most surefire spark for your inspiration?</h2>
        <div className="flex flex-col sm:flex-row sm:-mx-3 mt-12">
          <div className="flex-1 px-3">
            <Card className="mb-8 bg-gray-100 px-8 py-8">
              <div className="font-semibold text-xl text-center mx-auto">
                <textarea
                  style={{ width: '100%', height: '200px' }}
                  placeholder="Give as much detail as you like here..."
                ></textarea>
                <br />
                <button type="submit">Submit</button>
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
    <section id="question-one" className="pt-8 lg:pb-20 lg:pt-18">
      <div className="container mx-auto text-center">
        <h2 className="text-xl lg:text-2xl font-semibold">When you feel like you're being completely flooded with work, which of these activities do you turn to, to regain composure? You can also select ones you would consider trying sometime.</h2>
        <div className="flex flex-col sm:flex-row sm:-mx-3 mt-12">
          <div className="flex-1 px-3">
            <ClickableCard className="mb-8">
              <div className="font-semibold text-xl text-center mx-auto">
                <div className="inline-block align-middle m-2"><Icon kind="walk" size="30" /></div>
                <div className="inline-block align-middle">Going for a walk</div>
              </div>
              <p className="mt-4">
                Sometimes just taking a stroll around the block can get you back to baseline.
              </p>
            </ClickableCard>
          </div>
          <div className="flex-1 px-3">
            <ClickableCard className="mb-8">
              <div className="font-semibold text-xl text-center mx-auto">
                <div className="inline-block align-middle m-2"><Icon kind="conversation" size="30" /></div>
                <div className="inline-block align-middle">Venting to another person</div>
              </div>
              <p className="mt-4">
                Sometimes laying out your frustrations and difficulties to someone you trust is enough to make it all feel more manageable.
              </p>
            </ClickableCard>
          </div>
          <div className="flex-1 px-3">
            <ClickableCard className="mb-8">
              <div className="font-semibold text-xl text-center mx-auto">
                <div className="inline-block align-middle m-2"><Icon kind="yin-yang" size="30" /></div>
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
  const [questionNumber, setQuestionNumber] = useState(1);
    // <Layout mainStyle={{
    //   backgroundColor: '#F7F7ED',
    //   backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2305ba42' fill-opacity='0.19'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"`,
    // }}>

  return (
    <div>
      <section id="header" className="pt-20">
        <div className="container mx-auto px-8">
          <h1 className="text-green-600 text-4xl lg:text-5xl xl:text-6xl font-bold leading-none">
            We're excited to welcome you aboard!
            <br />
            We'll be working together on building out your perfect Workflows in no time.
          </h1>
          <div className="info pt-2 text-gray-700 text-sm font-bold">Teachers: for now, you're seeing the Student onboarding flow, but just answer honestly from your own experience. This will help us develop our student product, thanks!</div>
        </div>
      </section>
      <section id="question-header" className="pt-10">
        <h2 className="text-center text-3xl lg:text-4xl xl:text-5xl font-bold">Question {questionNumber}</h2>
        <div className="flex justify-between px-16">
          <div className={`w-8 cursor-pointer ${questionNumber > 1 ? 'visible' : 'invisible'}`}
            onClick={() => setQuestionNumber(questionNumber-1)}
          >{'<prev'}</div>
          <div className="w-8 cursor-pointer"
            onClick={() => setQuestionNumber(questionNumber+1)}
          >{'next>'}</div>
        </div>
      </section>
      {getQuestionComponent(questionNumber)}
    </div>
  );
    // </Layout>
};

// JoinPage.propTypes = {
// };

export default JoinPage;