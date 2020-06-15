import React from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import TeacherBlackboard from '../svg/TeacherBlackboard';

const HomePage = () => (
  <Layout>
    <section className="pt-8 sm:pt-16 md:pt-32">
      <div className="container mx-auto px-8 sm:flex">
        <div className="h-56 w-64 mx-auto sm:hidden">
          <TeacherBlackboard scale={0.25}/>
        </div>
        <div className="text-center sm:text-left sm:w-1/2">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-none">
          Take Part in Our Supportive Community This Summer
          </h1>
          <p className="text-lg lg:text-xl mt-6 font-light">
          You are not alone. As summer begins and we transition from a season of reaction to one of reflection, we have more time and space to recognize how our lives and approach to teaching are forever changed.
          </p>
          <p className="text-lg lg:text-xl mt-6 font-light">
          Joining your peers on Workflow Edu means helping each other, and eventually students, find the right workflow for every situation.
          </p>
          <p className="mt-8 md:mt-12">
            <Button className="py-1 px-2 sm:py-3 sm:px-8">Get Started</Button>
          </p>
        </div>
        {/* Setting a height limit for these wrapper elements nullifies the effect of the svg height being huge */}
        <div className="hidden h-40 sm:block sm:w-1/2 sm:pl-8 sm:pt-20 lg:hidden">
          <TeacherBlackboard scale={0.35}/>
        </div>
        <div className="hidden h-40 lg:block lg:w-1/2 lg:pl-2">
          <TeacherBlackboard scale={0.55}/>
        </div>
      </div>
    </section>
    <section id="message" className="pt-20 lg:pt-32">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl lg:text-5xl font-semibold">We will get through this together.</h2>
        <p className="mt-4">As we process all that is happening to us as individuals this summer, as educators we are tasked with rethinking how changes to our instructional environments will impact our students. Some of this is tactical. Much more is emotional.</p>
        <p className="mt-4">It’s OK not to feel OK about everything. In fact, recognizing our social and emotional state is a precondition to learning, growth and project completion. This is especially true for our students.</p>
        <p className="mt-4">We invite you to participate in a facilitated conversation where you share with our community how you are approaching the project of rethinking your fall 2020 classroom.</p>
        <p className="mt-4">Throughout, you will be encouraged to share how your feelings are impacting your focus and ability to master that project. As the WorkFlowEdu team facilitates these conversations, we will incorporate what we all learn together into a task-management application that focuses on both feelings and functions.</p>
      </div>
    </section>
    <section id="mission" className="pt-20 lg:pt-32">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl lg:text-5xl font-semibold">Our Mission</h2>
        <h3 className="text-lg lg:text-xl font-normal text-gray-700">
          Workflow Edu is a repository of resources related to planning your hour, day, or year. The guidance from any given Workflow might draw from theories around executive functioning, social and emotional learning, or just personal intuition. The goal in using these Workflows is to <span className="text-gray-600 italic">feel good and function well</span>.
        </h3>
        <div className="flex flex-col md:flex-row md:-mx-3 mt-12">
          <div className="flex-1 px-3">
            <Card className="mb-8">
              <p className="font-semibold text-xl">Enabling Exploration, Experimentation</p>
              <p className="mt-4">
                Given the huge variety of approaches taken to work most effectively, the likelihood is low that you'll find a Workflow that resonates with you on day one. Our tools for remixing a Workflow, plus sharing and search, allow for the huge variety of approaches to be expressed by one person and discovered by another.
              </p>
            </Card>
          </div>
          <div className="flex-1 px-3">
            <Card className="mb-8">
              <p className="font-semibold text-xl">Community Contributions</p>
              <p className="mt-4">
                Every member of the Workflow Edu community is a potential contributor. That unique workflow you use to find motivation on those days where it feels like nothing is coming easy - it could be the next big one shared from person to person!
              </p>
            </Card>
          </div>
          <div className="flex-1 px-3">
            <Card className="mb-8">
              <p className="font-semibold text-xl">Only "Opt-On" Content</p>
              <p className="mt-4">
                Nothing is more important than ensuring nothing that could have a negative effect gets put in front of students. That's why each Workflow must be explicitly admitted onto the platform by the community, a purposefully higher standard than those used on YouTube and other platforms. 
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default HomePage;