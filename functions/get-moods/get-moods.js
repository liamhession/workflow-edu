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

exports.handler = async () => {
  try {
    let moodLogs = [];
    const snapshot = await db.collection('moodLogs').get();
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      moodLogs.push(doc.data());
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ allMoodLogs: moodLogs }),
      headers: {
        "Content-Type": "application/json"
      },
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
