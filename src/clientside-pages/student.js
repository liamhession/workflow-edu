import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';
// TODO ^ should this not import from react-netlify-identity-widget?
import {
  get,
  isNil,
  isEmpty,
} from 'lodash';

import Layout from '../components/layout/Layout';
import WellbeingKey from '../components/WellbeingKey';


const StudentPage = ({ queryParams = {} }) => {
  // Initialization ---------------
  // Get the student in question's id from query params
  const { studentId } = queryParams;

  // React says this must get called within the component, not within a callback, like the useEffect below
  const identityContext = useIdentityContext();
  // Get the user's teacherId, to be used for requesting their students' info
  const [teacherId, setTeacherId] = React.useState();
  React.useEffect(() => {
    setTeacherId(get(identityContext, ['user', 'user_metadata', 'teacherId']));
  }, []); // with an empty dependencies array, this will only get run once

  // Request student's details from their id, and a specified page of results, for when there are many
  const requestStudentAndPageOfLogs = async (studentId, page) => {
    const studentLogsResponse = await fetch('/.netlify/functions/get-student', {
      method: 'POST',
      body: JSON.stringify({
        studentId,
        teacherId,
      })
    });
    const studentAndPageOfLogs = studentLogsResponse.json();
    const {
      student,
      logs: logsToShow,
    } = studentAndPageOfLogs;

    setStudent(student);
  };
  const [student, setStudent] = React.useState();
  React.useEffect(() => {
    requestStudentAndPageOfLogs(studentId, 0);
  }, []); // with an empty dependencies array, this will only get run once

  return (
    <Layout isProfilePage={true}>
      <div className='dashboard-container text-center'>
        <h1>Dashboard for {student.name}</h1>
        <WellbeingKey />
        <hr className="my-1" />
        <StudentLogs studentId={studentId} teacherId={teacherId} />
      </div>
    </Layout>
  );
};

export default StudentPage;