// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const admin = require('firebase-admin');
const moment = require('moment-timezone');

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

// Find a student record matching their ID, then based on the student's "time for check-in" setting,
//    determine what UNIX timestamp is the correct next-notification-time for them
exports.handler = async (event) => {
  try {
    const { studentId } = JSON.parse(event.body);

    const student = await db.collection('students').doc(studentId).get();

    const {
      notificationTime,
      timezoneName,
    } = student.data();

    // Create a moment object in the future that represents their notification time, in their timezone
    const nextNotification = moment(notificationTime, "HH:mm").tz(timezoneName);
    // Check if this notification would have already happened, and add a day to it if so
    if (nextNotification.isBefore(moment())) {
      nextNotification.add(1, 'days');
    }

    // Convert the moment into a UNIX timestamp, as that is the format that the Chrome Extension wants
    const nextNotificationUnixTime = nextNotification.valueOf();

    return {
      statusCode: 200,
      body: JSON.stringify({ nextNotificationUnixTime }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() }
  }
}
