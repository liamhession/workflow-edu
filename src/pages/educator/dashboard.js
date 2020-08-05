import React from 'react';
import isNil from 'lodash';

import Button from '../../components/Button';
import Layout from '../../components/layout/Layout';

const DashboardPage = () => {
  const [isLoadingMoods, setIsLoadingMoods] = React.useState(true);
  const [moodLogs, setMoodLogs] = React.useState([]);
  const [requestReload, setRequestReload] = React.useState(0);

  // For generating code that will be associated with an un-activated new student
  const [newStudentName, setNewStudentName] = React.useState();
  const [submittedNewStudentName, setSubmittedNewStudentName] = React.useState();

  const [students, setStudents] = React.useState([]);

  // Async functions to talk to the backend, each to be embedded in a useEffect
  //    call which watches for changes to their "requestX" state variable
  const getMoods = async () => {
    setIsLoadingMoods(true);
    const allMoodsResponse = await fetch('/.netlify/functions/get-moods');
    const allMoodsObject = await allMoodsResponse.json();
    const { allMoodLogs } = allMoodsObject;
    setMoodLogs(allMoodLogs);
    setIsLoadingMoods(false);
  };

  // TODO next: send the student's name as entered by teacher into the create-new-student fn
  //    And update the interface to make it clear you're entering the student, and are given code
  const createNewStudentAndGetCode = async () => {
    const createNewStudentBody = { name: submittedNewStudentName };
    const newStudentResponse = await fetch('/.netlify/functions/create-new-student', {
      method: 'POST',
      body: JSON.stringify(createNewStudentBody),
    });
    const newStudentObject = await newStudentResponse.json();
    const { activationCode } = newStudentObject;

    // Add this new student to the list of students
    let currentStudents = [...students];
    currentStudents.push({ name: submittedNewStudentName, activationCode });
    setStudents(currentStudents);
  };

  // Request the mood logs of all students, for display
  // TO UPDATE: Get warnings w these useEffect hooks, look here to determine best way to handle: https://medium.com/better-programming/understanding-the-useeffect-dependency-array-2913da504c44
  React.useEffect(() => {
    getMoods();
  }, [requestReload]);

  // Submit student name and get back code that they'll be able to enter to activate their account
  React.useEffect(() => {
    if (isNil(submittedNewStudentName)) { 
      console.log(submittedNewStudentName);
      return;
    }

    createNewStudentAndGetCode();
  }, [submittedNewStudentName]);

  return (
    <Layout isProfilePage={true}>
      <div className='dashboard-container text-center'>
        <h1>Your Dashboard</h1>
        <div className="student-list">
          <h3>All Students</h3>
          { students.map((student, index) => (
            <div key={index}>{student.name} - {student.activationCode}</div>
          ))}
        </div>
        <div className="new-student">
          <h3>Add a new student</h3>
          <div>
            <span>Name:</span><input type="text" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)}></input>
          </div>
          <div>
            <Button onClick={() => setSubmittedNewStudentName(newStudentName)}>Create New Student</Button>
          </div>
        </div>
        <hr className="my-1" />
        <h3>Here all all the students' mood logs:</h3>
        { isLoadingMoods && <span>Loading...</span>}
        { !isLoadingMoods && <Button onClick={() => setRequestReload(requestReload+1)}>Reload</Button>}
        { moodLogs.map((log, index) => (
          <div key={index}>{log.name} - {log.moodValue}</div>
        ))} 
      </div>
    </Layout>
  );
};

export default DashboardPage