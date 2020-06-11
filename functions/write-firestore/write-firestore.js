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

    // Get user details if they're logged in
    const {identity, user} = context.clientContext;
    console.log('identity, user:');
    console.log(identity);
    console.log(user);

    const createdResponse = newOnboardingResponse.set(submittedResponse);
    const createdResponseWithUserDetails = {
      ...createdResponse,
      user,
      identity,
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ createdResponseWithUserDetails }),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
