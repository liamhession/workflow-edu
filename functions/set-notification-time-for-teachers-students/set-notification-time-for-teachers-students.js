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

// Set the notificationTime and timezoneName values for the teacher whose id was passed in,
//    as well as all of their students 
exports.handler = async (event) => {
  try {
    const {
      teacherId,
      notificationTime,
      timezoneName,
    } = JSON.parse(event.body);

    // Update commands take a body that represents fields that should be updated and their updated values
    const updateBody = {
      notificationTime,
      timezoneName,
    };

    const teacherRef = db.collection('teachers').doc(teacherId);

    // Update the teacher's notification time details
    await teacherRef.update(updateBody);

    // Update all the students for whom this teacher is the main teacher, in a batch
    await db.collection('students')
      .where('mainTeacher', '==', teacherRef)
      .get()
      .then(async (studentsResponse) => {
        let batch = db.batch();
        studentsResponse.docs.forEach((doc) => {
            const docRef = db.collection('students').doc(doc.id)
            batch.update(docRef, updateBody)
        });
        await batch.commit();
      })

    return {
      statusCode: 200,
      body: 'Success updating notification time for teacher and their students',
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
