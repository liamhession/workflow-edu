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

exports.handler = async (event, context) => {
  try {
    const newOnboardingResponse = db.collection('onboardingResponses').doc();

    // Take the object passed in as POST body
    const submittedResponse = JSON.parse(event.body);
    console.log(submittedResponse);

    const createdResponse = newOnboardingResponse.set(submittedResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({ createdResponse }),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
