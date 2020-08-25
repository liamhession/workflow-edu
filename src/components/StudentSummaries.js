import React from 'react';
import PropTypes from 'prop-types'
import {
  get,
  isNil,
  omit,
} from 'lodash';

// Styling of table rows and columns based on this TailwindCSS snippet:
//    https://tailwindcomponents.com/component/responsive-table

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

    const allStudentSummariesResponse = await fetch('/.netlify/functions/get-student-summaries', {
      method: 'POST',
      body: JSON.stringify({ teacherId }),
    });
    const allStudentSummaries = await allStudentSummariesResponse.json();

    // All students gotten back from API:
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
    return rawSummaries.filter(summary => get(summary, ['mostRecentLog', 'teacherStatus']) === 'unseen');
  };
  const getSeenStudentSummaries = (rawSummaries) => {
    return rawSummaries.filter(summary => get(summary, ['mostRecentLog', 'teacherStatus']) !== 'unseen');
  };

  // Format the data for each student summary, converting some fields, so they can each be input to
  //    the StudentSummaryRow component, which will get styled using TailwindCSS
  const formatStudentSummariesAsRows = (rawSummaries) => {
    // Mapping of scores to colors allows us to shade the most recent logs
    const colorForScore = {
      1: '#159be8',
      2: '#9c38ff',
      3: '#ffde58',
      4: '#cae364',
      5: '#60c038',
    };
    
    const convertedSummaries = rawSummaries.map(summary => ({
      ...omit(summary, 'mostRecentLog'),
      hasLog: !isNil(summary.mostRecentLog),
      ...get(summary, 'mostRecentLog', {}),
      moodColor: colorForScore[get(summary, ['mostRecentLog', 'moodScore'])],
    }));

    const summaryRowComponents = convertedSummaries.map(summary => (
      <StudentSummaryRow {...summary}></StudentSummaryRow>
    ));
    return summaryRowComponents;
  };

  // Sub-component just defined here for now
  const StudentSummaryRow = ({
    name,
    isActivated,
    activationCode,
    hasLog,
    moodScore,
    moodColor,
    selectedReasons,
    customMessage,
    wantsToDiscuss,
  }) => {
    // When not yet activated, show simple message listing the student's name and their code
    if (!isActivated) {
      return (
        <tr className="inactive bg-white md:hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap md:flex-no-wrap mb-10 md:mb-0">
          <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
            <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Name</span>
            {name}
          </td>
          <td colSpan="6" className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
            <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Note</span>
            Student's account is not yet activated. If you haven't already, give them this code: {activationCode}
          </td>
        </tr>
      );
    }

    // When student has not yet shared any logs, display a generic listing, just their name
    if (!hasLog) {
      return (
        <tr className="no-logs-yet bg-white md:hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap md:flex-no-wrap mb-10 md:mb-0">
          <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
            <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Name</span>
            {name}
          </td>
          <td colSpan="6" className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
            <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Note</span>
            Student has not yet logged any entries from their extension. Once they have, it will show here!
          </td>
        </tr>
      );
    }

    return (
      <tr className="bg-white md:hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap md:flex-no-wrap mb-10 md:mb-0">
        <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Name</span>
          {name}
        </td>
        <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Wellbeing Score</span>
          <span className="rounded py-1 px-3 text-xs font-bold" style={{ backgroundColor: moodColor }}>{moodScore}</span>
        </td>
        <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Mood Influence(s)</span>
          {selectedReasons.join(', ')}
        </td>
        <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Submitted Message</span>
          {customMessage}
        </td>
        <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Would Like to Talk</span>
          { wantsToDiscuss ? 'YES' : 'NO' }
        </td>
        <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Status</span>
          This is where status can be updated
        </td>
        <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Teacher Notes</span>
          This is where notes can be made
        </td>
      </tr>
    );
  };

  const TableStudentSummaries = ({
    studentSummaryRows,
    isLoading,
  }) => (
    <table className="border-collapse w-full">
      <thead>
          <tr>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden md:table-cell">Student</th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden md:table-cell">Wellbeing Score</th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden md:table-cell">Mood Influence(s)</th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden md:table-cell">Submitted Message</th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden md:table-cell">Would Like to Talk</th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden md:table-cell">Status</th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden md:table-cell">Teacher Notes</th>
          </tr>
      </thead>
      <tbody>
        { isLoading
          ? (<tr className="bg-white md:hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap md:flex-no-wrap mb-10 md:mb-0">
              <td colSpan="7" className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">Loading...</td>
            </tr>)
          : (
            studentSummaryRows.length == 0 // not loading, but no students in their charge
            ? (<tr className="bg-white md:hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap md:flex-no-wrap mb-10 md:mb-0">
                <td colSpan="7" className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">No students in your roster yet, add them above.</td>
              </tr>)
            : (studentSummaryRows)
          )
        }
      </tbody>
    </table>
  );

  // Put the student summaries in the order we prefer them (inactive students last, etc),
  //    and also convert them to the row format used by react-bootstrap/Table
  const unseenStudentSummaries = getUnseenStudentSummaries(studentSummaries);
  const seenStudentSummaries = getSeenStudentSummaries(studentSummaries);
  const studentSummariesInOrder = [...unseenStudentSummaries, ...seenStudentSummaries];
  const studentSummariesAsRows = formatStudentSummariesAsRows(studentSummariesInOrder);

  return (
    <div className='student-summaries-container'>
      <h3>Most Recent Student Submissions</h3>
      <TableStudentSummaries
        studentSummaryRows={studentSummariesAsRows}
        isLoading={isLoadingStudentSummaries}
      ></TableStudentSummaries>
      {/* TODO Decide if it makes sense that all past logs will be marked as seen when top one is? Or have a 'mark all as seen' button? */}
    </div>
  );
};

StudentSummaries.propTypes = {
  teacherId: PropTypes.string,
};

export default StudentSummaries;
