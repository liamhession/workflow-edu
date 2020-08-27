import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';
// TODO ^ should this not import from react-netlify-identity-widget?
import {
  get,
  isNil,
  isEmpty,
} from 'lodash';

import Layout from '../../components/layout/Layout';
import WellbeingKey from '../../components/WellbeingKey';
import StudentLogs from '../../components/StudentLogs';


const StudentPage = ({ queryParams = {} }) => {
  // Initialization ---------------
  // Get the student in question's id from query params
  const { studentId } = queryParams;
  // Default student name is '...' while loading it from DB
  const [student, setStudent] = React.useState({ name: '...' });

  // Request student's details from their id, called below after getting teacherId
  const requestStudent = async (studentId, teacherId) => {
    const studentResponse = await fetch('/.netlify/functions/get-student', {
      method: 'POST',
      body: JSON.stringify({
        studentId,
        teacherId,
      })
    });
    const studentObject = await studentResponse.json();
    console.log('studentObject');
    console.log(studentObject);
    const {
      isValid,
      student,
    } = studentObject;

    if (!isValid) {
      window.alert('You don\'t have access to this student\'s account! If you think you are seeing this message in error, contact the Workflow Edu team.');
      return;
    }

    setStudent(student);
  };

  // React says this must get called within the component, not within a callback, like the useEffect below
  const identityContext = useIdentityContext();
  // Get the user's teacherId, to be used for requesting their students' info
  const [teacherId, setTeacherId] = React.useState();

  React.useEffect(() => {
    const teacherIdFromIdentity = get(identityContext, ['user', 'user_metadata', 'teacherId']);
    setTeacherId(teacherIdFromIdentity);
    requestStudent(studentId, teacherIdFromIdentity);
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