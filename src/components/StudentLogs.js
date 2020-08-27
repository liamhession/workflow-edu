import React from 'react';
import PropTypes from 'prop-types';
import {
  get,
  isNil,
} from 'lodash';

// Styling of table rows and columns based on this TailwindCSS snippet:
//    https://tailwindcomponents.com/component/responsive-table

// Pull in dictionary mapping log statuses to their written-out versions for display
import statuses from '../constants/logStatuses';

// The list of columns displayed, which we can use to make empty rows span the full table
const columns = ['Date', 'Wellbeing Score', 'Mood Influence(s)', 'Submitted Message', 'Status', 'Teacher Notes'];

// TODO : Add pagination, they should page through 10 or so logs at a time to reduce clutter later on when many logs are there
const StudentLogs = ({
  studentId,
  teacherId,
}) => {
  // STUDENT SUMMARY GRID ------------------
  const [isLoadingStudentLogs, setIsLoadingStudentLogs] = React.useState(true);
  const [isValidTeacher, setIsValidTeacher] = React.useState(true);
  const [studentLogs, setStudentLogs] = React.useState([]);

  // Once teacherId is available, request the student summaries of this teacher's students 
  const getStudentLogs = async () => {
    if (isNil(teacherId) || isNil(studentId)) return;
    console.log('start of the getStudentLogs request');

    const allStudentLogsResponse = await fetch('/.netlify/functions/get-student-logs', {
      method: 'POST',
      body: JSON.stringify({
        studentId,
        teacherId,
      }),
    });
    const {
      isValid,
      studentLogs: allStudentLogs,
    } = await allStudentLogsResponse.json();

    // Update state with validity and all student logs gotten back from API:
    setIsValidTeacher(isValid);
    setStudentLogs(allStudentLogs);
    setIsLoadingStudentLogs(false);
  };

  // Request the mood logs of all students, for display, once teacherId is ready
  React.useEffect(() => {
    getStudentLogs();
  }, [teacherId]);

  // Utilities to take the raw response from server of all student summaries, and order them,
  //    plus put stand-in values for any times where a desired field is undefined

  // Format the data for each mood log, converting some fields, so they can each be input to
  //    the StudentLogRow component, which will get styled using TailwindCSS
  const formatStudentLogsAsRows = (rawLogs) => {
    // Mapping of scores to colors allows us to shade the logs' mood scores
    const colorForScore = {
      1: '#159be8',
      2: '#9c38ff',
      3: '#ffde58',
      4: '#cae364',
      5: '#60c038',
    };
    
    const convertedLogs = rawLogs.map(log => ({
      ...log,
      moodColor: colorForScore[get(log, ['moodScore'])],
    }));

    const logRowComponents = convertedLogs.map((log, index) => (
      <StudentLogRow key={index} {...log}></StudentLogRow>
    ));
    return logRowComponents;
  };

  // Sub-component just defined here for now
  const StatusDropdown = ({
    currentStatus,
    logId,
  }) => {
    const [isUpdating, setIsUpdating] = React.useState(false);

    const changeStatus = (clickEvent) => {
      // Will be reset to false when the page re-renders from the re-request of 'getStudentLogs'
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
      .then(getStudentLogs);
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
      .then(getStudentLogs);
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

  // Sub-component just defined here for now
  const StudentLogRow = ({
    logId,
    dateTime,
    moodScore,
    moodColor,
    selectedReasons,
    customMessage,
    teacherStatus,
    teacherNote,
  }) => {
    return (
      <tr className="bg-white md:hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap md:flex-no-wrap mb-10 md:mb-0">
        <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Date</span>
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
        <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Status</span>
          <StatusDropdown currentStatus={teacherStatus} logId={logId} />
        </td>
        <td className="w-full md:w-auto p-0 text-gray-800 text-center border border-b block md:table-cell relative md:static">
          <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">Teacher Notes</span>
          <NoteTextArea currentNote={teacherNote} logId={logId} />
        </td>
      </tr>
    );
  };

  const TableStudentLogs = ({
    studentLogs,
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
            studentLogs.length === 0 // not loading, but no students in their charge
            ? (<tr className="bg-white md:hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap md:flex-no-wrap mb-10 md:mb-0">
                <td colSpan={columns.length} className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">No logs for this student yet.</td>
              </tr>)
            : (studentLogs)
          )
        }
      </tbody>
    </table>
  );

  const studentLogsAsRows = formatStudentLogsAsRows(studentLogs);

  // If request to db comes back showing them as not the valid teacher for this student, show message
  if (!isValidTeacher) {
    return <div className="text-red-400">Our records do not show you as the teacher for this student.</div>;
  }

  return (
    <div className='student-logs-container p-3'>
      <TableStudentLogs
        studentLogs={studentLogsAsRows}
        isLoading={isLoadingStudentLogs}
      ></TableStudentLogs>
      {/* TODO Decide if it makes sense that all past logs will be marked as seen when top one is? Or have a 'mark all as seen' button? */}
    </div>
  );
};

StudentLogs.propTypes = {
  studentId: PropTypes.string,
  teacherId: PropTypes.string,
};

export default StudentLogs;
