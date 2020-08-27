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
    const submittedStatusOrNotes = JSON.parse(event.body);
    const {
      status,
      note,
      logId,
    } = submittedStatusOrNotes;

    // Create object specifying the new values for either status or note, if they were passed in
    let updatedFields = {};
    if (!!status) {
      updatedFields['teacherStatus'] = status;
    }
    if (!!note) {
      updatedFields['teacherNote'] = note;
    }

    // Convert the logId, passed as a string, into an actual ref
    const log = db.collection('moodLogs').doc(logId)

    // Update the fields that had new values passed in for them
    await log.update(updatedFields);

    return {
      statusCode: 200,
      body: 'Mood log status/note successfully updated.',
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
