import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';
// TODO ^ should this not import from react-netlify-identity-widget?
import { get } from 'lodash';

import Layout from '../../components/layout/Layout';
import WellbeingKey from '../../components/WellbeingKey';
import StudentManagement from '../../components/StudentManagement';
import StudentSummaries from '../../components/StudentSummaries';
import { IdentityWidget } from '../../components/IdentityWidget/app';

const DashboardPage = () => {
  // Initialization ---------------
  // React says this must get called within the component, not within a callback, like the useEffect below
  const identityContext = useIdentityContext();
  // Get the user's teacherId, to be used for requesting their students' info
  const [teacherId, setTeacherId] = React.useState();
  React.useEffect(() => {
    setTeacherId(get(identityContext, ['user', 'user_metadata', 'teacherId']));
  }, []); // with an empty dependencies array, this will only get run once

  return (
    <Layout isProfilePage={true}>
      <div className='dashboard-container text-center mt-3'>
        <h1 className='text-3xl'>Teacher Dashboard</h1>
        <StudentManagement
          teacherId={teacherId}
        />
        <hr className="my-2" />
        <WellbeingKey />
        <hr className="my-2" />
        <StudentSummaries teacherId={teacherId} />
        <hr className="my-2" />
        <div className="logout-container mx-auto my-3 w-3/5 md:w-2/5">
          <IdentityWidget />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;