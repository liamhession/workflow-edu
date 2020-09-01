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
    // Take the teacher id passed in in POST body
    const teacherIdObject = JSON.parse(event.body);
    const { teacherId } = teacherIdObject;

    // Get reference to the teacher this is the id for
    const teacherRef = db.collection('teachers').doc(teacherId);

    let students = [];
    const snapshot = await db.collection('students').where('mainTeacher', '==', teacherRef).get();
    snapshot.forEach((doc) => {
      // Only take the important fields, not the mainTeacher reference, which includes sensitive info
      const {
        name,
        activationCode,
        isActivated,
      } = doc.data();
      const id = doc.id;
      students.push({
        id,
        name,
        activationCode,
        isActivated,
      });
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ students }),
      headers: {
        "Content-Type": "application/json"
      },
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
