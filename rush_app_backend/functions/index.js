const { initializeApp } = require('firebase/app');
const functions = require("firebase-functions");
const app = require("express")();

const auth = require("./util/auth");

const cors = require('cors');
app.use(cors());

const { addRushee, uploadRusheePhoto } = require("./registration_backend/registration")
const { addPIS, addPISOutline, getPISOutline, addBrotherPISReview } = require("./rush_backend/pis");
const { getSpecificRushee, getRushees, updateCloud } = require("./rush_backend/rushees");
const { addSurvey, editSurvey,getSpecificSurvey } = require("./rush_backend/surveys");
const { getBidcommNotes, addBidcommNotes } = require("./rush_backend/bidcomm");
const { signup, login } = require("./security_backend/security");
const { updateAll, getConstants, updateConstants, exportDatabase } = require("./admin_backend/admin");
const { addBrotherPhoto , getBrother, queryBrothers } = require("./rush_backend/brothers");
const { updateAttendance , getAttendance } = require("./rush_backend/attendance");
//
app.post("/signup", signup);

app.post("/login", login);
//

app.post("/rushees", addRushee);

app.get("/rushees", getRushees);

app.post("/rusheeImage", uploadRusheePhoto);

app.post("/cloud", auth, updateCloud);

app.post("/survey", auth, addSurvey);

app.put("/survey", auth, editSurvey);

app.get("/survey", auth, getSpecificSurvey);

app.get("/constants", auth, getConstants);

app.post("/constants", auth, updateConstants);

app.post("/pis", auth, addPIS);

app.post("/pisReview", auth, addBrotherPISReview);

app.get("/pisOutline", auth, getPISOutline);

app.post("/pisOutline", auth, addPISOutline);

app.get("/rusheeDetail", auth, getSpecificRushee);

app.get("/bidcomm", auth, getBidcommNotes);

app.post("/bidcomm", auth, addBidcommNotes);

app.post("/brothers/image", auth, addBrotherPhoto);

app.get("/brothers/", auth, getBrother);

app.get("/brothers/query", auth, queryBrothers);

app.get("/export", auth, exportDatabase);

// admin endpoints

app.get("/updateAll", updateAll);

app.put("/attendance", updateAttendance);

app.get("/attendance", getAttendance);




exports.api = functions.region('us-central1').https.onRequest(app); // Converts all endpoints to https://baseurl.com/api/endpoint
