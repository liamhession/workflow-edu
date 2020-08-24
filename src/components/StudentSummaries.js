import React from 'react';
import PropTypes from 'prop-types'
import {
  get,
  isNil,
  omit,
} from 'lodash';

const StudentSummaries = ({
  teacherId,
}) => {
  // STUDENT SUMMARY GRID ------------------
  const [isLoadingStudentSummaries, setIsLoadingStudentSummaries] = React.useState(true);
  const [studentSummaries, setStudentSummaries] = React.useState([]);

  // Once teacherId is available, request the student summaries of this teacher's students 
  const getStudentSummaries = async () => {
    setIsLoadingStudentSummaries(true);

    if (isNil(teacherId)) return;

    console.log('This would be a request to get-student-summaries');
    const allStudentSummariesResponse = await fetch('/.netlify/functions/get-student-summaries', {
      method: 'POST',
      body: JSON.stringify({ teacherId }),
    });
    const allStudentSummaries = await allStudentSummariesResponse.json();

    // All students gotten back from API:
    console.log(allStudentSummaries);

    setStudentSummaries(allStudentSummaries);
    setIsLoadingStudentSummaries(false);
  };

  // Request the mood logs of all students, for display, once teacherId is ready
  React.useEffect(() => {
    getStudentSummaries();
  }, [teacherId]);

  // Utilities to take the raw response from server of all student summaries, and order them,
  //    plus put stand-in values for any times where a desired field is undefined

  // The first most essential way to split up the students' logs, is to highlight the ones
  //    that the teacher has not yet "seen", as measured by them not yet marking as "seen"
  const getUnseenStudentSummaries = (rawSummaries) => {
    const studentsWithUnseenLogs = rawSummaries.filter(summary => get(summary, ['mostRecentLog', 'teacherStatus']) === 'unseen');
    const formattedStudentsWithUnseenLogs = formatStudentSummaries(studentsWithUnseenLogs);
    return formattedStudentsWithUnseenLogs;
  };
  const getSeenStudentSummaries = (rawSummaries) => {
    const studentsWithSeenLogs = rawSummaries.filter(summary => get(summary, ['mostRecentLog', 'teacherStatus']) !== 'unseen');
    const formattedStudentsWithSeenLogs = formatStudentSummaries(studentsWithSeenLogs);
    return formattedStudentsWithSeenLogs;
  };

  // Format the data for each student summary, converting some fields, to be ready for display
  const formatStudentSummaries = (rawSummaries) => {
    console.log('rawSummaries:');
    console.log(rawSummaries);
    // Mapping of scores to colors allows us to shade the most recent logs
    const colorForScore = {
      1: '#159be8',
      2: '#9c38ff',
      3: '#ffde58',
      4: '#cae364',
      5: '#60c038',
    };
    return rawSummaries.map(summary => ({
      ...omit(summary, 'mostRecentLog'),
      hasLog: !isNil(summary.mostRecentLog),
      ...get(summary, 'mostRecentLog', {}),
      moodColor: colorForScore[get(summary, ['mostRecentLog', 'moodScore'])],
    }));
  };

  // Sub-component just defined here for now
  const StudentSummary = ({
    name,
    isActivated,
    activationCode,
    hasLog,
    moodScore,
    moodColor,
    selectedReasons,
    customMessage,
  }) => {
    // When not yet activated, show simple message listing the student's name and their code
    if (!isActivated) {
      return (
        <div className='inactive student-summary'>
          <strong>{name}</strong> has not yet activated their account, give them this code: {activationCode}
        </div>
      );
    }

    // When student has not yet shared any logs, display a generic listing, just their name
    if (!hasLog) {
      return (
        <div className='student-summary'>
          <strong>{name}</strong> has not yet logged any entries from their extension. Once they have, it will show here!
        </div>
      );
    }

    // If we get to this case, we expect an activated student, who has logged an mood entry
    return (
      <div className='student-summary mb-2'>
        <span className='p-1'><strong>{name}</strong></span>
        <span className='p-1' style={{ backgroundColor: moodColor }}>{moodScore}</span>
        <span className='p-1'>Selected reasons: {selectedReasons.join(', ')}</span>
        <span className='p-1'>"{customMessage}"</span>
        {/* Allow for teacher to mark this as seen, and add notes */}
      </div>
    );
  };

  return (
    <div className='student-summaries-container'>
      <h3>Here all all the students' mood logs:</h3>
      { isLoadingStudentSummaries && <span>Loading...</span>}
      <div className='divider font-bold'>Students with new responses</div>
      { getUnseenStudentSummaries(studentSummaries).map((student, index) => (
        <StudentSummary
          key={index}
          {...student}
        />
      ))}
      <div className='divider font-bold'>Students whose responses you've seen</div>
      { getSeenStudentSummaries(studentSummaries).map((student, index) => (
        <StudentSummary
          key={index}
          {...student}
        />
      ))}
      {/* TODO Decide if it makes sense that all past logs will be marked as seen when top one is? Or have a 'mark all as seen' button? */}
    </div>
  );
};

StudentSummaries.propTypes = {
  teacherId: PropTypes.string,
};

export default StudentSummaries;
