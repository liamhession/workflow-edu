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

// Create a new teacher entry with the passed in info, and respond with the new teacher's id
exports.handler = async (event) => {
  try {
    const teacherDetails = JSON.parse(event.body);

    const newTeacher = await db.collection('teachers').add(teacherDetails);

    const teacherId = newTeacher.id;

    return {
      statusCode: 200,
      body: JSON.stringify({ teacherId }),
    }
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
