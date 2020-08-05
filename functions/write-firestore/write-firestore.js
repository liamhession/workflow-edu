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

exports.handler = async (event, context) => {
  try {
    // Take the object passed in as POST body
    const submittedResponse = JSON.parse(event.body);

    const createdResponse = await db.collection('onboardingResponses').add(submittedResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({ createdResponse }),
    }
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
