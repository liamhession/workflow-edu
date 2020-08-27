import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';
// TODO ^ should this not import from react-netlify-identity-widget?
import {
  get,
  isNil,
  isEmpty,
} from 'lodash';

import Button from '../../components/Button';
import Layout from '../../components/layout/Layout';
import WellbeingKey from '../../components/WellbeingKey';
import StudentSummaries from '../../components/StudentSummaries';

const DashboardPage = () => {
  // Initialization ---------------
  // React says this must get called within the component, not within a callback, like the useEffect below
  const identityContext = useIdentityContext();
  // Get the user's teacherId, to be used for requesting their students' info
  const [teacherId, setTeacherId] = React.useState();
  React.useEffect(() => {
    setTeacherId(get(identityContext, ['user', 'user_metadata', 'teacherId']));
  }, []); // with an empty dependencies array, this will only get run once


  // Then, more state below, for everything that shows up on the dashboard page
  // STUDENTS LIST/ADDING NEW ONES
  // Allow for showing/hiding of the list of students and interfaces for adding new ones
  const [areNamesVisible, setAreNamesVisible] = React.useState(false);
  const toggleNameVisibility = () => setAreNamesVisible(!areNamesVisible);

  const [isLoadingStudents, setIsLoadingStudents] = React.useState(true);
  const [students, setStudents] = React.useState([]);
  // Keep track of how many students have been submitted, to update the list in UI
  const [studentsSubmitted, setStudentsSubmitted] = React.useState(0);

  // Async functions to talk to the backend, each to be embedded in a useEffect
  //    call which watches for changes to their "requestX" state variable
  const getStudents = async () => {
    if (isNil(teacherId)) return;
    console.log(teacherId);
    console.log('request to get-students');

    const studentsResponse = await fetch('/.netlify/functions/get-students', {
      method: 'POST',
      body: JSON.stringify({ teacherId }),
    });
    const studentsObject = await studentsResponse.json();
    const { students } = studentsObject;
    setStudents(students);
    setIsLoadingStudents(false);
  };

  // Add a student to the database, and they should show up in the next getStudents call
  const createNewStudent = async (name) => {
    console.log('request to create-new-student done here! name=', name);
    const createNewStudentBody = { 
      name,
      teacherId,
      notificationTime,
      timezoneName,
    };
    await fetch('/.netlify/functions/create-new-student', {
      method: 'POST',
      body: JSON.stringify(createNewStudentBody),
    });
  };

  const createManyNewStudents = async (names) => {
    for (let nameIndex = 0; nameIndex < names.length; nameIndex++) {
      await createNewStudent(names[nameIndex]);
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
  const submitASingleStudent = async () => {
    if (isNil(newStudentName) || newStudentName === '') {
      console.log('invalid name, not submitting');
      return;
    }

    // Remove the newStudentName text from input
    setNewStudentName('');
    // The Loading... indicator will show until the re-request of students list
    //    has been triggered and finishes
    setIsLoadingStudents(true);

    await createNewStudent(newStudentName);

    // Mark that new student has been submitted, triggering re-request of students list
    setStudentsSubmitted(studentsSubmitted+1);
  };

  // For generating many new student entries at one time, using comma-separated list
  const [newStudentNamesList, setNewStudentNamesList] = React.useState();

  // Allow for displaying of all the names entered in comma-separated form
  const [parsedStudentNamesList, setParsedStudentNamesList] = React.useState([]);

  // Submit multiple student names, then trigger a refreshing of the students list
  const submitMultipleStudents = async () => {
    if(isEmpty(parsedStudentNamesList)) return;

    // Reset this form, returning to an empty parsed list, empty-string input
    setNewStudentNamesList('');
    setParsedStudentNamesList([]);
    // The Loading... indicator will show until the re-request of students list
    //    has been triggered and finishes
    setIsLoadingStudents(true);

    // Make multiple back-to-back requests submitting students' names, to get codes
    await createManyNewStudents(parsedStudentNamesList);


    // Mark that new student has been submitted, triggering re-request of students list
    setStudentsSubmitted(studentsSubmitted+parsedStudentNamesList.length);
  };

  // TIME OF NOTIFICATION ------------------
  const [notificationTime, setNotificationTime] = React.useState('09:00');
  const [timezoneName, setTimezoneName] = React.useState('America/New_York');

  const submitNotificationTime = async () => {
    if (isNil(notificationTime) || isNil(timezoneName)) return;

    const notificationTimeBody = {
      teacherId,
      notificationTime,
      timezoneName,
    };
    console.log('would be submitting to new endpoint with this info:');
    console.log(notificationTimeBody);
    // await fetch('/.netlify/functions/set-notification-time-for-teachers-students', {
    //   method: 'POST',
    //   body: JSON.stringify(notificationTimeBody),
    // });
  };

  return (
    <Layout isProfilePage={true}>
      <div className='dashboard-container text-center'>
        <h1>Your Dashboard</h1>
        <div className="student-management-header">Student Management <Button onClick={toggleNameVisibility}>{areNamesVisible ? 'Hide' : 'Expand'}</Button></div>
        <div className={'student-management'+(areNamesVisible?'':' hidden')}>
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
            <hr className="my-1" />
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
        </div>
        <hr className="my-1" />
        <div className="timezone-details">
          <h3>What time do you want your students reminded?</h3>
          <select
            className="border"
            name="time-of-notification"
            value={notificationTime}
            onChange={(e) => setNotificationTime(e.target.value)}
          >
            <option value="08:00">8:00</option>
            <option value="08:30">8:30</option>
            <option value="09:00">9:00</option>
            <option value="09:30">9:30</option>
            <option value="10:00">10:00</option>
            <option value="10:30">10:30</option>
          </select>
          <select
            className="border"
            name="timezone-name"
            value={timezoneName}
            onChange={(e) => setTimezoneName(e.target.value)}
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            {/* TODO: ask them their actual city, because if they're in Phoenix they won't observe Daylight savings */}
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
          <Button 
            onClick={submitNotificationTime}
          >Submit</Button>
        </div>
        <hr className="my-1" />
        <WellbeingKey />
        <hr className="my-1" />
        <StudentSummaries teacherId={teacherId} />
      </div>
    </Layout>
  );
};

export default DashboardPage;