import React from 'react';
import {
  isNil,
  isEmpty,
  sortBy,
} from 'lodash';

import Button from './Button';

const StudentManagement = ({
  teacherId,
}) => {
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
    const { students: studentsRaw } = studentsObject;

    // Order the students gotten from API so that the unactivated ones show first, and are alphabetical
    const unactivatedStudents = studentsRaw.filter((s) => s.isActivated === false);
    const sortedUnactivatedStudents = sortBy(unactivatedStudents, ['name']);
    const activatedStudents = studentsRaw.filter((s) => s.isActivated);
    const sortedActivatedStudents = sortBy(activatedStudents, ['name']);
    const students = [...sortedUnactivatedStudents, ...sortedActivatedStudents];

    setStudents(students);
    setIsLoadingStudents(false);

    // If there are no students yet, we want to show the Student Management section as expanded
    if (students.length === 0) {
      setAreNamesVisible(true);
    }
  };

  // Run getStudents request whenever 'studentsSubmitted' gets updated (incremented),
  //    and when teacherId gets set initially
  React.useEffect(() => {
    getStudents();
  }, [teacherId, studentsSubmitted]);

  // If there's ever a need to reset a student's activation code because they had to reinstall the extension
  const resetStudentActivationCode = (studentId) => {
    fetch('/.netlify/functions/reset-student-activation-code', {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    })
    .then(() => {
      setStudentsSubmitted(studentsSubmitted+1);
    });
  };

  // Add a student to the database, and they should show up in the next getStudents call
  const createNewStudent = async (name) => {
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
  const [notificationTime, setNotificationTime] = React.useState();
  const [timezoneName, setTimezoneName] = React.useState();
  const [timeUpdating, setTimeUpdating] = React.useState(false);

  // Create effect that will be run when teacherId is set, to get notification details.
  //    It's an async function that will be run within the effect call below
  const getNotificationDetailsForTeacher = async (teacherId) => {
    if (isNil(teacherId)) return;
    console.log(teacherId);
    console.log('request to get-teacher-notification-time');

    const notificationTimeResponse = await fetch('/.netlify/functions/get-teacher-notification-time', {
      method: 'POST',
      body: JSON.stringify({ teacherId }),
    });
    const { notificationTime, timezoneName } = await notificationTimeResponse.json();
    setNotificationTime(notificationTime);
    setTimezoneName(timezoneName);
  };

  React.useEffect(() => {
    getNotificationDetailsForTeacher(teacherId);
  }, [teacherId]);

  // Updat the notification time and timezone that show in the UI, then send to db to update teacher + associated students
  const submitNotificationTime = async () => {
    if (isNil(notificationTime) || isNil(timezoneName)) return;

    // Show it as loading
    setTimeUpdating(true);

    setNotificationTime(notificationTime);
    setTimezoneName(timezoneName);

    const notificationTimeBody = {
      teacherId,
      notificationTime,
      timezoneName,
    };
    await fetch('/.netlify/functions/set-notification-time-for-teachers-students', {
      method: 'POST',
      body: JSON.stringify(notificationTimeBody),
    });
    setTimeUpdating(false);
  };

  // Simple boolean that causes this student management container to be more prominent if teacher has no students yet
  const doesTeacherNeedToAddStudents = students.length === 0;

  return (
    <div className="student-management-container md:max-w-xl max-w-md mx-auto">
      <div className="student-management-header text-2xl">Student Management <Button className="text-lg" onClick={toggleNameVisibility}>{areNamesVisible ? 'Hide' : 'Show'}</Button></div>
      <div className={'student-management'+(areNamesVisible?'':' hidden')}>
        { doesTeacherNeedToAddStudents && 
          <div className="text-lg text-green-800">Time to add your students! You can add their names one at a time, or with the multiple student tool below.</div>
        }
        {/* Show student list alongside tools for adding new students when on large enough screen */}
        <div className="student-management-tools flex md:flex-row flex-col">
          <div className="student-list text-md md:w-1/2">
            <div className="text-xl underline">All Students</div>
            { isLoadingStudents && <span>Loading...</span>}
            { (!isLoadingStudents && doesTeacherNeedToAddStudents) && 
              <div className="text-lg">None yet...</div>
            }
            { students.map((student, index) => (
              <div key={index}>
                <span>{student.name} - {student.isActivated ? 'Activated' : student.activationCode}</span>
                { student.isActivated && <Button className="ml-1" onClick={() => resetStudentActivationCode(student.id)}>Reset Code</Button> }
              </div>
            ))}
          </div>
          <hr className="my-2 md:hidden" />
          <div className="add-students-tools md:w-1/2">
            <div className="new-student">
              <div className="text-xl underline">Add a new student</div>
              <div>
                <span className="mr-1">Name:</span>
                <input
                  className="w-32"
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}>
                </input>
                <Button className="ml-1" onClick={submitASingleStudent}>Create</Button>
              </div>
            </div>
            <hr className="my-2" />
            <div className="new-students">
              <div className="text-xl underline">Add multiple students at once</div>
              <div>Enter a comma-separated list of student names below, click "Parse", then submit them.</div>
              <input
                className="w-32"
                type="textarea"
                placeholder="Lori, Jori, Joe"
                value={newStudentNamesList}
                onChange={(e) => setNewStudentNamesList(e.target.value)}>
              </input>
              <Button
                className="ml-1"
                onClick={() => {
                  if (isNil(newStudentNamesList)) return;
                  const namesSplitByComma = newStudentNamesList.split(/,\s*/);
                  const noBlankNames = namesSplitByComma.filter((name) => !isNil(name) && name !== '');
                  setParsedStudentNamesList(noBlankNames);
                }
              }>Parse</Button>
              <div className={`parsed-names-list ${parsedStudentNamesList.length ? '' : 'hidden'}`}>
                {parsedStudentNamesList.map((name, index) => <div key={index}>{name}</div>)}
                <Button 
                  onClick={submitMultipleStudents}
                >Submit</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-2" />
      <div className="timezone-details text-lg">
        <div className="text-xl">What time do you want your students reminded?</div>
        <select
          className="border mr-1"
          name="time-of-notification"
          value={notificationTime}
          onChange={(e) => setNotificationTime(e.target.value)}
        >
          <option value="08:00">8:00 AM</option>
          <option value="08:30">8:30 AM</option>
          <option value="09:00">9:00 AM</option>
          <option value="09:30">9:30 AM</option>
          <option value="10:00">10:00 AM</option>
          <option value="10:30">10:30 AM</option>
        </select>
        <select
          className="border mr-1"
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
        >{ timeUpdating ? 'Updating...' : 'Submit' }</Button>
      </div>
    </div>
  );
};

export default StudentManagement;