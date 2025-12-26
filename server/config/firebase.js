import admin from 'firebase-admin';

const initializeFirebase = () => {
  try {
    if (!admin.apps.length && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: "kwendash-dbf13",
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log("Firebase Admin initialized successfully");
    } else {
      console.log("Firebase credentials not found, Firebase auth disabled");
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error.message);
  }
};

export default initializeFirebase;
export { admin };

