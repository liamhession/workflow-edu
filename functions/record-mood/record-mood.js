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

exports.handler = async (event) => {
  try {
    // Parse the object passed in as POST body
    const submittedMood = JSON.parse(event.body);
    const { studentId } = submittedMood;

    // Convert the studentId, passed as a string, into an actual ref
    const student = db.collection('students').doc(studentId)
    // We don't want the studentId in final object though
    delete submittedMood.studentId

    const newMoodLog = {
      student,
      teacherStatus: 'unseen',
      ...submittedMood,
    };

    await db.collection('moodLogs').add(newMoodLog);

    return {
      statusCode: 200,
      body: JSON.stringify(newMoodLog),
    }
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
