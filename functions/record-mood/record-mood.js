// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://workflow-edu.firebaseio.com'
  });
}

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.firestore();

exports.handler = async (event) => {
  try {
    // Take the object passed in as POST body
    console.log(event);
    const submittedMoodObject = JSON.parse(event.body);
    console.log(submittedMoodObject);

    await db.collection('moodLogs').add(submittedMoodObject);

    return {
      statusCode: 200,
      body: JSON.stringify({ submittedMoodObject }),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
