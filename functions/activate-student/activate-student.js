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

// Find a student record matching the passed-in code, and update it to be activated,
//    then return the student's details including document.id, for their extension to store
exports.handler = async (event) => {
  try {
    // Take the object passed in as POST body
    const { activationCode: rawActivationCode } = JSON.parse(event.body);

    // Set whatever is passed in to the fully-capitalized version of it, which is how they're stored
    const activationCode = rawActivationCode.toUpperCase();

    const studentEntryOrEntries = 
      await db.collection('students')
        .where('activationCode', '==', activationCode)
        .where('isActivated', '==', false)
        .get();

    // Need an error message if there are somehow multiple students with this code
    if (studentEntryOrEntries.size > 1) {
      return { statusCode: 500, body: 'There are multiple not-activated student entries with the same code!'}
    }
    // And one if the student entered in a code that does not correspond to anything in db
    if (studentEntryOrEntries.size === 0) {
      return { statusCode: 500, body: 'No students were found for that activation code.' };
    }

    // If all is normal, just one student, get their data, including their unique id 
    const studentEntry = studentEntryOrEntries.docs[0];
    // We only want some fields from the student
    const { name } = studentEntry.data();
    const studentId = studentEntry.id;
    const studentToReturn = {
      name,
      isActivated: true, // hard-coded update to the data we return
      id: studentId,
    };

    // Then update their info to show activation
    await db.collection('students').doc(studentId).update({ isActivated: true });

    return {
      statusCode: 200,
      body: JSON.stringify(studentToReturn),
    }
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
