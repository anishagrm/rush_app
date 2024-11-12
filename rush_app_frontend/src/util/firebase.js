import firebase from 'firebase'
var firebaseConfig = {
    apiKey: "AIzaSyANTyi2408ZpjjB2daFSck-Hwc0XhrXYmg",
    authDomain: "rush-app-46833.firebaseapp.com",
    projectId: "rush-app-46833",
    storageBucket: "rush-app-46833.appspot.com",
    messagingSenderId: "440922381066",
    appId: "1:440922381066:web:981191f6e35b3ef9f638f3"
  };
  // Initialize Firebase
const firebaseAdmin = firebase.initializeApp(firebaseConfig);
export default firebaseAdmin;
