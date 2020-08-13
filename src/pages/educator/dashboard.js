import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import {
  get,
  isNil,
  isEmpty,
} from 'lodash';

import Button from '../../components/Button';
import Layout from '../../components/layout/Layout';

const DashboardPage = () => {
  // Initialization ---------------
  // React says this must get called within the component, not within a callback, like the useEffect below
  const identityContext = useIdentityContext();
  // Get the user's teacherId, to be used for requesting their students' info
  const [teacherId, setTeacherId] = React.useState();
  React.useEffect(() => {
    console.log('OOOONCE');
    setTeacherId(get(identityContext, ['user', 'user_metadata', 'teacherId']));
  }, []); // with an empty dependencies array, this will only get run once


  // Then, more state below, for everything that shows up on the dashboard page
  const [isLoadingStudents, setIsLoadingStudents] = React.useState(true);
  const [students, setStudents] = React.useState([]);
  // Keep track of how many students have been submitted, to update the list in UI
  const [studentsSubmitted, setStudentsSubmitted] = React.useState(0);

  // Async functions to talk to the backend, each to be embedded in a useEffect
  //    call which watches for changes to their "requestX" state variable
  const getStudents = async () => {
    if (isNil(teacherId)) return;
    console.log('request to get-students');

    // const studentsResponse = await fetch('/.netlify/functions/get-students', {
    //   method: 'POST',
    //   body: JSON.stringify({ teacherId }),
    // });
    // const studentsObject = await studentsResponse.json();
    const studentsObject = { students: [
      { name: 'Test1', activationCode: 'EBCDA' },
      { name: 'Test2', activationCode: 'ABCDE' },
    ] };
    const { students } = studentsObject;
    setStudents(students);
    setIsLoadingStudents(false);
  };

  // Add a student to the database, and they should show up in the next getStudents call
  const createNewStudentAndGetCode = async (name) => {
    // const createNewStudentBody = { 
    //   name,
    //   teacherId,
    // };
    // await fetch('/.netlify/functions/create-new-student', {
    //   method: 'POST',
    //   body: JSON.stringify(createNewStudentBody),
    // });
    console.log('request to create-new-student done here! name=', name);
  };

  const createManyNewStudentsAndGetCodes = async (names) => {
    for (let nameIndex = 0; nameIndex < names.length; nameIndex++) {
      await createNewStudentAndGetCode(names[nameIndex]);
    }
  };

  // Run getStudents request whenever 'studentsSubmitted' gets updated (incremented),
  //    and when teacherId gets set initially
  React.useEffect(() => {
    getStudents();
  }, [teacherId, studentsSubmitted]);

  // For generating code that will be associated with an un-activated new student
  const [newStudentName, setNewStudentName] = React.useState();

  // Submit student name and trigger a request of students list, to show them
  const submitASingleStudent = () => {
    console.log('in submitASingleStudent');
    if (isNil(newStudentName) || newStudentName === '') {
      console.log('invalid name, not submitting');
      return;
    }

    // The Loading... indicator will show until the re-request of students list
    //    has been triggered and finishes
    setIsLoadingStudents(true);

    createNewStudentAndGetCode(newStudentName);

    // Remove the newStudentName text from input
    setNewStudentName('');

    // Mark that new student has been submitted, triggering re-request of students list
    setStudentsSubmitted(studentsSubmitted+1);
  };

  // For generating many new student entries at one time, using comma-separated list
  const [newStudentNamesList, setNewStudentNamesList] = React.useState();

  // Allow for displaying of all the names entered in comma-separated form
  const [parsedStudentNamesList, setParsedStudentNamesList] = React.useState([]);

  // Submit multiple student names, then trigger a refreshing of the students list
  const submitMultipleStudents = () => {
    if(isEmpty(parsedStudentNamesList)) return;

    // The Loading... indicator will show until the re-request of students list
    //    has been triggered and finishes
    setIsLoadingStudents(true);

    // Make multiple back-to-back requests submitting students' names, to get codes
    createManyNewStudentsAndGetCodes(parsedStudentNamesList);

    // Reset this form, returning to an empty parsed list, empty-string input
    setNewStudentNamesList('');
    setParsedStudentNamesList([]);

    // Mark that new student has been submitted, triggering re-request of students list
    setStudentsSubmitted(studentsSubmitted+parsedStudentNamesList.length);
  };

  const [isLoadingMoods, setIsLoadingMoods] = React.useState(true);
  const [moodLogs, setMoodLogs] = React.useState([]);
  const [requestReload, setRequestReload] = React.useState(0);

  const getMoods = async () => {
    setIsLoadingMoods(true);
    // const allMoodsResponse = await fetch('/.netlify/functions/get-moods');
    // const allMoodsObject = await allMoodsResponse.json();
    console.log('This would be a request to get-mood-logs');
    const allMoodsObject = { allMoodLogs: [
      { name: 'Billy', moodValue: 4 },
      { name: 'Sally', moodValue: 5 },
    ]};
    const { allMoodLogs } = allMoodsObject;
    setMoodLogs(allMoodLogs);
    setIsLoadingMoods(false);
  };

  // Request the mood logs of all students, for display
  // TO UPDATE: Get warnings w these useEffect hooks, look here to determine best way to handle: https://medium.com/better-programming/understanding-the-useeffect-dependency-array-2913da504c44
  React.useEffect(() => {
    getMoods();
  }, [requestReload]);

  return (
    <Layout isProfilePage={true}>
      <div className='dashboard-container text-center'>
        <h1>Your Dashboard</h1>
        <div className="student-list">
          <h3>All Students</h3>
          { isLoadingStudents && <span>Loading...</span>}
          { students.map((student, index) => (
            <div key={index}>{student.name} - {student.activationCode}</div>
          ))}
        </div>
        <div className="new-student">
          <h3>Add a new student</h3>
          <div>
            <span>Name:</span><input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}></input>
          </div>
          <div>
            <Button onClick={submitASingleStudent}>Create New Student</Button>
          </div>
          <hr />
          <h3>Add multiple students at once</h3>
          <div>
            <div>Enter a comma-separated list of student names below, click "Parse" then submit them.</div>
            <input
              type="textarea"
              placeholder="Lori, Jori, Joe"
              value={newStudentNamesList}
              onChange={(e) => setNewStudentNamesList(e.target.value)}></input>
          </div>
          <div>
            <Button 
              onClick={() => {
                if (isNil(newStudentNamesList)) return;
                const namesSplitByComma = newStudentNamesList.split(/,\s*/);
                const noBlankNames = namesSplitByComma.filter((name) => !isNil(name) && name !== '');
                setParsedStudentNamesList(noBlankNames);
              }
            }>Parse</Button>
          </div>
          <div className="parsed-names-list">
            {parsedStudentNamesList.map((name, index) => <div key={index}>{name}</div>)}
            {parsedStudentNamesList.length > 0 &&
            <Button 
              onClick={submitMultipleStudents}
            >Submit</Button>
            }
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

export default DashboardPage;