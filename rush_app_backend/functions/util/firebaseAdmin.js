// this file sets up the admin access to the firebase database

const firebaseAdmin = require("firebase-admin");

firebaseAdmin.initializeApp();

const db = firebaseAdmin.firestore();

module.exports = { firebaseAdmin, db };
