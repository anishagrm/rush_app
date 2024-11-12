const { db } = require("../util/firebaseAdmin");
const config = require("../util/config");


exports.addSurvey = (req, res) => {

  const newSurvey = {
    rusheeGTID: req.body.rusheeGTID,
    survey: req.body.survey,
    createdAt: new Date().toISOString(), 
    // storing the name of the brother
    brotherID: req.user.gtid,
    brotherName: req.user.name,
    night:req.body.survey.night,
  };

  db.doc(`/rushees/${newSurvey.rusheeGTID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ gtid: "rushee is not in the system" });
      }
      return true;
    })
    .then(() => {
      return db.doc(`/rushees/${newSurvey.rusheeGTID}/surveys/${newSurvey.brotherID+newSurvey.survey.night}`).set(newSurvey);
    })
    .then((doc) => {
      return res.json({ message: `survey ${newSurvey.brotherID+newSurvey.survey.night} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "error adding survey for rushee" });
      console.error(err);
    });
};

exports.getSpecificSurvey = (req, res) => {
  db.doc(`/rushees/${req.query.rusheeGTID}`)
  .get()
  .then((doc) => {
    if (!doc.exists) {
      return res.status(400).json({ gtid: "rushee is not in the system" });
    }
    return true;
  })
  .then(() => {
    return db.doc(`/rushees/${req.query.rusheeGTID}/surveys/${req.user.gtid+req.query.night}`).get()
  })
  .then((doc) => {
    if (!doc.exists) {
      return res.json("");
    }
    return res.json(doc.data())
  })
  .catch((err) => {
    res.status(500).json({ error: "error getting survey for rushee" });
    console.error(err);
  });



}
exports.editSurvey = (req, res) => {

  const newSurvey = {
    rusheeGTID: req.body.rusheeGTID,
    survey: req.body.survey,
    night: req.body.survey.night,
  };

  // brother credentials 
  let brotherID = req.user.gtid;
  db.doc(`/rushees/${newSurvey.rusheeGTID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ gtid: "rushee is not in the system" });
      }
      return true;
    })
    .then(() => {
      // get the specified survey id
      return db.doc(`/rushees/${newSurvey.rusheeGTID}/surveys/${brotherID+newSurvey.survey.night}`)
    })
    .then((doc) => {
      return doc.update({ survey: newSurvey.survey, updatedLast: new Date().toISOString()});
    })
    .then(() => {
      return res.json({ message: `survey ${brotherID+newSurvey.survey.night} updated successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "error editing survey" });
      console.error(err);
    });
};