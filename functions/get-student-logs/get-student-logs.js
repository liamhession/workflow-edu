// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const admin = require('firebase-admin');
const moment = require('moment-timezone');

const { JSON_FIREBASE_CREDENTIALS } = process.env;
const firebaseCredentials = JSON.parse(JSON_FIREBASE_CREDENTIALS);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
    databaseURL: 'https://workflow-edu.firebaseio.com'
  });
}

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.firestore();

// Find a student record matching their ID, make sure it's the right teacher,
//    then get all their logs, including nicely formatted datetimes for each 
exports.handler = async (event) => {
  try {
    const {
      studentId,
      teacherId,
    } = JSON.parse(event.body);

    // Get a reference to the  student whose id was requested
    const studentRef = db.collection('students').doc(studentId);

    // Check that the teacher who was making this request is the main teacher for the requested student
    const student = await studentRef.get();
    const {
      mainTeacher,
      timezoneName,
    } = student.data();
    const studentsTeacherId = mainTeacher.id;

    // Create a return object that says whether this is the right teacher for that student,
    //    and return right away with it if they're not the valid teacher
    const validTeacherForStudent = studentsTeacherId === teacherId;
    let responseObject = { isValid: validTeacherForStudent };
    if (!validTeacherForStudent) {
      return {
        statusCode: 200,
        body: JSON.stringify(responseObject),
      };
    }

    // If we get here, they're the valid teacher, we'll grab the rest of the info needed
    let studentLogs = [];
    const studentLogsSnapshot = await db.collection('moodLogs').where('student', '==', studentRef).orderBy('timestamp', 'desc').get();

    for (let index = 0; index < studentLogsSnapshot.size; index++) {
      const studentLogDoc = studentLogsSnapshot.docs[index];
      const logId = studentLogDoc.id;
      const {
        timestamp,
        moodScore,
        selectedReasons,
        customMessage,
        wantsToDiscuss,
        teacherStatus,
        teacherNote,
      } = studentLogDoc.data();

      // Convert the timestamp into a readable date-time string
      const dateTime = moment(timestamp).tz(timezoneName).format('M/D/YY h:mm A');

      // Add this full student log entry to return array
      studentLogs.push({
        logId,
        dateTime,
        moodScore,
        selectedReasons,
        customMessage,
        wantsToDiscuss,
        teacherStatus,
        teacherNote,
      });
    }

    // Add these logs to the response object
    responseObject.studentLogs = studentLogs;

    return {
      statusCode: 200,
      body: JSON.stringify(responseObject),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
