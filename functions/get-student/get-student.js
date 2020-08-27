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
    // Take the student id, and teacher id, passed in in POST body
    const requestObject = JSON.parse(event.body);
    const {
      teacherId,
      studentId,
    } = requestObject;

    // Get a reference to the  student whose id was requested
    const studentRef = db.collection('students').doc(studentId);

    // Check that the teacher who was making this request is the main teacher for the requested student
    const student = await studentRef.get();
    const {
      name,
      activationCode,
      isActivated,
      mainTeacher,
    } = student.data();
    const studentsTeacherId = mainTeacher.id;

    // Create a return object that says whether this is the right teacher for that student,
    //    and includes the students' details if so
    const validTeacherForStudent = studentsTeacherId === teacherId;
    let responseObject = { isValid: validTeacherForStudent };
    if (validTeacherForStudent) {
      responseObject.student = {
        name,
        activationCode,
        isActivated,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(responseObject),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
