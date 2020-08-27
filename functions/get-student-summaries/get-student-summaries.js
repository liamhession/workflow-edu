// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const admin = require('firebase-admin');

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

// Find all the students whose teacher is the one passed in as teacherId, then get their most recent logs
exports.handler = async (event) => {
  try {
    const { teacherId } = JSON.parse(event.body);
    const teacherRef = db.collection('teachers').doc(teacherId);

    // As we're processing the students, we will have all their info including id in students array
    const students = [];
    const studentsSnapshot = await db.collection('students').where('mainTeacher', '==', teacherRef).get();
    studentsSnapshot.forEach((doc) => {
      // Take student-level important fields, including id for upcoming moodLog requests
      const {
        name,
        activationCode,
        isActivated,
      } = doc.data();
      students.push({
        name,
        activationCode,
        isActivated,
        id: doc.id,
      });
    });

    // Will add basic student info, plus details of most recent log (if exists) to studentSummaries return array
    const studentSummaries = [];
    for (let studentIndex = 0; studentIndex < students.length; studentIndex++) {
      const {
        id,
        name,
        isActivated,
        activationCode,
        timezoneName,
      } = students[studentIndex];

      // Not-yet-activated students don't need to have attempted log requests done
      if (!isActivated) {
        studentSummaries.push({
          name,
          isActivated,
          activationCode,
          timezoneName,
        });
      }

      // Activated students will have their most recent log searched for, using their id
      else {
        const studentRef = db.collection('students').doc(id);
        const mostRecentLogSnapshot = await db.collection('moodLogs').where('student', '==', studentRef).orderBy('timestamp', 'desc').limit(1).get();

        // Default is an undefined mostRecentLog
        let mostRecentLog;
        if (mostRecentLogSnapshot.size > 0) {
          const {
            timestamp,
            moodScore,
            selectedReasons,
            customMessage,
            wantsToDiscuss,
            teacherStatus,
            teacherNote,
          } = mostRecentLogSnapshot.docs[0].data();
          const logId = mostRecentLogSnapshot.docs[0].id;
          mostRecentLog = {
            logId,
            timestamp,
            moodScore,
            selectedReasons,
            customMessage,
            wantsToDiscuss,
            teacherStatus,
            teacherNote,
          };
        }
        studentSummaries.push({
          name,
          isActivated,
          activationCode,
          timezoneName,
          mostRecentLog,
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(studentSummaries),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
