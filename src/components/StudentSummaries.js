import React from 'react';
import { Link } from '@reach/router';
import PropTypes from 'prop-types'
import {
  get,
  isNil,
  omit,
} from 'lodash';

// Styling of table rows and columns based on this TailwindCSS snippet:
//    https://tailwindcomponents.com/component/responsive-table

// Pull in dictionary mapping log statuses to their written-out versions for display
import statuses from '../constants/logStatuses';

// The list of columns displayed, which we can use to make empty rows span the full table
const columns = ['Student', 'Most Recent Log', 'Wellbeing Score', 'Mood Influence(s)', 'Submitted Message', 'Status', 'Teacher Notes'];

const StudentSummaries = ({
  teacherId,
}) => {
  // STUDENT SUMMARY GRID ------------------
  const [isLoadingStudentSummaries, setIsLoadingStudentSummaries] = React.useState(true);
  const [studentSummaries, setStudentSummaries] = React.useState([]);

  // Once teacherId is available, request the student summaries of this teacher's students 
  const getStudentSummaries = async () => {
    if (isNil(teacherId)) return;
    console.log('start of the getStudentSummaries request');

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

  // The first most essential way to split up the students' logs, is based on teacher status
  //    unseen > flagged > seen > responded to
  const statusRanking = ['unseen', 'flagged', 'seen', 'responded'];
  const orderStudentSummaries = (rawSummaries) => {
    // Iterate through the rankings, adding the summaries with their status to the final array, in turn
    let orderedSummaries = [];
    for (let index = 0; index < statusRanking.length; index++) {
      const currentStatus = statusRanking[index];
      const summariesWithStatus = rawSummaries.filter((summary) =>
        get(summary, ['mostRecentLog', 'teacherStatus']) === currentStatus);
      orderedSummaries.push(...summariesWithStatus);
    }
    // Then add the ones with no status (representing students not yet activated, or having logged a response)
    const newStudentsSummaries = rawSummaries.filter((summary) => 
      isNil(get(summary, ['mostRecentLog', 'teacherStatus'])));
    orderedSummaries.push(...newStudentsSummaries);

    return orderedSummaries;
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

    const summaryRowComponents = convertedSummaries.map((summary, index) => (
      <StudentSummaryRow key={index} {...summary}></StudentSummaryRow>
    ));
    return summaryRowComponents;
  };

  // Sub-component just defined here for now
  const StatusDropdown = ({
    currentStatus,
    logId,
  }) => {
    const [isUpdating, setIsUpdating] = React.useState(false);

    const changeStatus = (clickEvent) => {
      // Will be reset to false when the page re-renders from the re-request of 'getStudentSummaries'
      setIsUpdating(true);
      const newStatus = clickEvent.target.value;

      // Send this new status for this log to the backend, then re-request all data
      fetch('/.netlify/functions/update-mood-log-status-or-notes', {
        method: 'POST',
        body: JSON.stringify({
          logId,
          status: newStatus,
        }),
      })
      // Re-request student summaries only after the update is complete, so it will be reflected in updated summaries
      .then(getStudentSummaries);
    };

    if (isUpdating) {
      return <div>Updating...</div>;
    }

    // In default, not-loading case, show a select with statuses as options
    return (
      <select
        value={currentStatus}
        onChange={changeStatus}
        className="cursor-pointer focus:outline-none bg-transparent"
        name={`status-for-log-${logId}`}
      >
        {Object.keys(statuses).map((status, index) => (
          <option value={status} key={index}>{statuses[status]}</option>
        ))}
      </select>
    );
  };

  // Sub-component just defined here for now
  const NoteTextArea = ({
    currentNote = "",  // undefined currentNote ≈ "" for purposes of detecting change to note
    logId,
  }) => {
    const [noteContents, setNoteContents] = React.useState(currentNote);
    const [buttonText, setButtonText] = React.useState('Save Note');

    const saveNote = (hasNoteChanged) => {
      if (!hasNoteChanged) return;

      setButtonText('Saving...');
      // Only need to make request to db updating noteContents if it has actually changed. Then re-request everything
      fetch('/.netlify/functions/update-mood-log-status-or-notes', {
        method: 'POST',
        body: JSON.stringify({
          logId,
          note: noteContents,
        }),
      })
      // Re-request student summaries only after the update is complete, so it will be reflected in updated summaries
      .then(getStudentSummaries);
    };

    const hasNoteChanged = noteContents !== currentNote;
    // Grey button when note contents unchanged, active button color if note contents changed from what they are in db,
    //    plus, only shows as clickable when the note has been changed
    const buttonClasses =  hasNoteChanged ? 'w-full bg-blue-400 cursor-pointer' : 'w-full bg-gray-300 cursor-default';

    return (
      <div>
        <textarea
          value={noteContents}
          onChange={(event) => setNoteContents(event.target.value)}
          className="w-full p-2"
          name={`note-for-log-${logId}`}
        >
        </textarea>
        <button type="submit" className={buttonClasses} onClick={() => saveNote(hasNoteChanged)}>{buttonText}</button>
      </div>
    );
  };

  // For styling the optional little dot in the corner of a given summary's Teacher Status cell:
  const classesForStatus = {
    unseen: 'absolute top-0 right-0 mt-1 mr-1 w-3 h-3 rounded-full bg-red-500',
    seen: 'hidden',
    flagged: 'absolute top-0 right-0 mt-1 mr-1 w-3 h-3 rounded-full bg-orange-500',
    responded: 'hidden',
  };

  // Sub-component just defined here for now
  const StudentSummaryRow = ({
    studentId,
    name,
    isActivated,
    activationCode,
    hasLog,
    logId,
    dateTime,
    moodScore,
    moodColor,
    selectedReasons,
    customMessage,
    teacherStatus,
    teacherNote,
  }) => {
    // When not yet activated, show simple message listing the student's name and their code
    if (!isActivated) {
      return (
        <tr className="inactive bg-white md:hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap md:flex-no-wrap mb-10 md:mb-0">
          <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
            <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Name</span>
            {name}
          </td>
          <td colSpan={columns.length - 1} className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
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
          <td colSpan={columns.length - 1} className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
            <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Note</span>
            Student has not yet logged any entries from their extension. Once they have, it will show here!
          </td>
        </tr>
      );
    }

    // Potentially get a 'notification'-style indicator of a red or orange dot for the corner of the Status cell
    const notificationDivClasses = classesForStatus[teacherStatus];

    return (
      <tr className="bg-white md:hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap md:flex-no-wrap mb-10 md:mb-0">
        <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Name</span>
          <Link to={`/educator/student?studentId=${studentId}`}>{name}</Link>
        </td>
        <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Most Recent Log</span>
          {dateTime}
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
        <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Status</span>
          <div className={notificationDivClasses}></div>
          <StatusDropdown currentStatus={teacherStatus} logId={logId} />
        </td>
        <td className="w-full md:w-auto p-0 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Teacher Notes</span>
          <NoteTextArea currentNote={teacherNote} logId={logId} />
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
            { columns.map((columnName, index) => (
                <th key={index} className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden md:table-cell">{columnName}</th>
              ))
            }
          </tr>
      </thead>
      <tbody>
        { isLoading
          ? (<tr className="bg-white md:hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap md:flex-no-wrap mb-10 md:mb-0">
              <td colSpan={columns.length} className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">Loading...</td>
            </tr>)
          : (
            studentSummaryRows.length === 0 // not loading, but no students in their charge
            ? (<tr className="bg-white md:hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap md:flex-no-wrap mb-10 md:mb-0">
                <td colSpan={columns.length} className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">No students in your roster yet, add them above.</td>
              </tr>)
            : (studentSummaryRows)
          )
        }
      </tbody>
    </table>
  );

  // Put the student summaries in the order we prefer them (inactive students last, etc),
  //    and also convert them to the row format used by react-bootstrap/Table
  // const unseenStudentSummaries = getUnseenStudentSummaries(studentSummaries);
  // const seenStudentSummaries = getSeenStudentSummaries(studentSummaries);
  const studentSummariesInOrder = orderStudentSummaries([...studentSummaries]); // [...unseenStudentSummaries, ...seenStudentSummaries];
  const studentSummariesAsRows = formatStudentSummariesAsRows(studentSummariesInOrder);

  return (
    <div className='student-summaries-container p-3'>
      <h2 className='mb-1'>Most Recent Student Submissions</h2>
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
