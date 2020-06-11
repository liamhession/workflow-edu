// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://workflow-edu.firebaseio.com'
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.firestore();

exports.handler = async (event, context) => {
  try {
    const newOnboardingResponse = db.collection('onboardingResponses').doc();

    const createdResponse = newOnboardingResponse.set({
      userId: 'cdkd-4124-dkal',
      userEmail: 'fake@me.com',
      favoriteMethods: ['walk', 'meditation'],      
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ createdResponse }),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
