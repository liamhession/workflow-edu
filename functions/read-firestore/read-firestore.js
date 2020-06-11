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
    let allResponses = [];
    const snapshot = await db.collection('onboardingResponses').get()
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      allResponses.push(doc.data());
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ onboardingResponses: allResponses }),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
