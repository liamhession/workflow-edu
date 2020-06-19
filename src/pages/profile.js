import React from 'react';
import Layout from '../components/layout/Layout';

const ProfilePage = () => {
  const [isOverlayOn, setIsOverlayOn] = React.useState(true);

  return (
    <Layout isProfilePage={true}>
      <div id="bring-back-overlay" className={(isOverlayOn ? "hidden" : "fixed top-0 pt-12 sm:pt-16")+" pb-1 z-20 bg-gray-300 w-full text-center cursor-pointer underline"} onClick={() => setIsOverlayOn(true)}>Show new user message again</div>
      <section id="thanks-and-invitation" className={(isOverlayOn ? "" : "opacity-0 ")+"absolute top-0 min-h-screen z-10 pt-20 sm:pt-32 md:pt-40 text-lg px-8 bg-white bg-opacity-50"}>
        <div className="text-2xl">We are excited to have you join our early group of users!</div>
        <div className="mt-6">We'd consider us to be more like collaborators. 
        We hope you'll join us in our Slack community to give feedback on the project.
        Your suggestions will be instrumental in shaping the functionality and feel of Workflow Edu</div>
        <div className="mt-6 pl-8 underline"><a href="https://join.slack.com/t/workflowedu/shared_invite/zt-fb69d6ys-6tXaR9tmJJ4vk~IMxrqhvQ">Join the discussion on Slack!</a></div>
        <div className="mt-16 text-xl">
          <p className="mb-4 font-bold">First up in our design collaboration will be crafting this Profile screen.</p>
          <p className="mb-4 pl-4">• What kinds of information do you think are relevant to your identity as an educator?</p>
          <p className="mb-4 pl-4">• How do you think we should it lay out on this page?</p>
          <p className="mb-4 pl-4">• Think the color scheme needs to change?</p>
          <p className="mb-4">Chime in on the Slack #product-ideas channel, and feel free to tag our developer Liam for a quicker response!</p>
          <p className="mt-16 mb-4 text-center underline cursor-pointer" onClick={() => setIsOverlayOn(false)}>Hide this message, show me the mockup!</p>
        </div>
      </section>
      <section id="mock-profile" className={(isOverlayOn ? "fixed opacity-25" : "absolute opacity-100")+" top-0 h-full w-full z-0 pt-20 sm:pt-24"}>
        <div className="all-elements flex flex-col max-w-3xl mx-auto px-8 sm:px-16 md:px-20">
          <div className="top-elements flex flex-row">
            <div className="flex flex-col">
              <div className="w-24 h-24 bg-blue-500"></div>
              <div className="text-lg">User Name</div>
            </div>
            <div className="flex flex-col ml-8">
              <div className="w-full">Freshman-year U.S. History teacher at Glenwood High School</div>
              <div className="w-full"><span className="font-bold mr-2">Interested in</span><span className="underline">daily scheduling</span>, <span className="underline">pomodoro time-management</span>, <span className="underline">Stoicism</span></div>
            </div>
          </div>
          <div className="middle-elements flex flex-col w-full mt-20">
            <div className="font-bold text-xl text-center">Your Created Workflows</div>
            <div className="border-4 border-green-700 rounded-lg h-56">
              <div className="flex-col border-2 border-red-400 border-dashed rounded h-24 w-24 m-4">
                <div className="text-4xl w-full text-center text-red-500 -mb-3">+</div>
                <div className="text-md w-full text-center text-red-500">create new</div>
              </div>
            </div>
          </div>
          <div className="bottom-elements flex flex-col w-full mt-16">
            <div className="font-bold text-xl text-center">Your Collected Workflows</div>
            <div className="flex flex-row border-4 border-green-700 rounded-lg h-56">
              <div className="border-2 border-yellow-400 bg-yellow-200 rounded h-24 w-24 m-4">
                <div className="text-sm w-full text-center rounded py-1 px-2 bg-red-400">new</div>
                <div className="text-md w-full text-center">Morning planner</div>
              </div>
              <div className="border-2 border-blue-400 bg-blue-200 rounded h-24 w-24 m-4">
                <div className="text-md w-full text-center mt-2">Mid-day breathing break</div>
              </div>
              <div className="border-2 border-orange-400 bg-orange-200 rounded h-24 w-24 m-4">
                <div className="text-md w-full text-center mt-2">Motivation timer</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProfilePage;