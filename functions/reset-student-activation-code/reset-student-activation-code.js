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

// Generate a new code in our format, redoing if it's one of the codes in use currently
const VALID_CHARS = [...'ABCDE'];
const generateValidUnusedCode = async () => {
  let studentCodesInUse = [];
  const snapshot = await db.collection('students').where('isActivated', '==', false).get();
  snapshot.forEach((doc) => {
    studentCodesInUse.push(doc.data().activationCode);
  });

  let newStudentCode;
  do {
    const valid5LetterCode = [...Array(5)].map(() => VALID_CHARS[parseInt(Math.random()*VALID_CHARS.length)]).join('')
    newStudentCode = valid5LetterCode;
  }
  while (studentCodesInUse.includes(newStudentCode));
  return newStudentCode;
};

// Get a new code, update the student to have that code as its activation code
//    Then to be sure the code is unique, check for anyone else having that code, changing if necessary
//    (This is to cover race conditions in the unlikely case two students are given same code at same time)
exports.handler = async (event) => {
  try {
    // Take the student name, and teacher id, passed in in POST body
    const { studentId } = JSON.parse(event.body);

    // Get a ref to the student's document for updating 
    const studentRef = db.collection('students').doc(studentId);

    // Get valid new code, and update student to have that code
    let newActivationCode = await generateValidUnusedCode(true);
    await studentRef.update({
      activationCode: newActivationCode,
      isActivated: false,
    });

    // After inserting with that code, check one last time that it didn't get simultaneously added elsewhere
    //    TODO potentially: make this simpler with a lock (note, there's no way to enforce uniqueness on a field via firebase) 
    let noUniquenessProblemsFound = false;
    while (!noUniquenessProblemsFound) {
      const snapshotOfStudentsWithThisCode =
        await db.collection('students').where('isActivated', '==', false).where('activationCode', '==', newActivationCode).get();

      // The new student we just created has the same code as at least one other student
      if (snapshotOfStudentsWithThisCode.size > 1) {
        console.log('there was another un-activated student in the db with that code!');
        newActivationCode = await generateValidUnusedCode();
        console.log('new student code to user for them:', newActivationCode);
        studentRef.update({ activationCode: newActivationCode });
      }
      
      // Number of un-activated students having the new code is 0 or 1 
      //  (shows up as 0 sometimes even though we just updated new student to have it, works fine)
      else {
        noUniquenessProblemsFound = true;
      }
    }

    return {
      statusCode: 200,
      body: 'Successfully updated student\'s activationCode',
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
