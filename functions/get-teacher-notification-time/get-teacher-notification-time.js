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

// Find a teacher record matching their ID, then grab the teacher's notification time and timezone
exports.handler = async (event) => {
  try {
    const { teacherId } = JSON.parse(event.body);

    const teacher = await db.collection('teachers').doc(teacherId).get();

    const {
      notificationTime,
      timezoneName,
    } = teacher.data();

    return {
      statusCode: 200,
      body: JSON.stringify({
        notificationTime,
        timezoneName,
      }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
