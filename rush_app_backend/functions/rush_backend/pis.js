const { db } = require("../util/firebaseAdmin");
const config = require("../util/config");
exports.addPIS = (req, res) => {
  const responses = {
    graduation: req.body.graduation,
    optionalQuestions: req.body.optionalQuestions,
    optionalQuestionsResponse: req.body.optionalQuestionsResponse,
    questions: req.body.questions, 
    questionsResponse: req.body.questionsResponse,
    requiredDates: req.body.requiredDates,
    requiredDatesResponse: req.body.requiredDatesResponse
  };

  db.doc(`/rushees/${req.body.rusheeGTID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ gtid: "rushee is not in the system" });
      }
      return doc;
    })
    .then((doc) => {
        let data = doc.data();
        let newPIS;
        if ('PIS' in data) {
          if ("scribe" in data.PIS) {
            return res.status(400).json({ error: "rushee already has scribe responses" });
          }
          newPIS = data.PIS;
          newPIS.responses = responses;
          newPIS.rusheeGTID = req.body.rusheeGTID;
          newPIS.scribe = req.body.scribe;
        } else {
          newPIS = {
            responses: responses,
            createdAt: new Date().toISOString(),
            rusheeGTID: req.body.rusheeGTID,
            scribe: req.body.scribe
          }
        }
        return db.doc(`/rushees/${newPIS.rusheeGTID}`).update({ PIS: newPIS});
    })
    .then(() => {
      return res.json({ message: `pis for ${req.body.rusheeGTID} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "error adding PIS for rushee" });
      console.error(err);
    });
};

exports.addBrotherPISReview = (req, res) => {
  db.doc(`/rushees/${req.body.rusheeGTID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ gtid: "rushee is not in the system" });
      }
      return doc;
    })
    .then((doc) => {
        let data = doc.data();
        let newPIS;
        if ('PIS' in data) {
          if ("brothers" in data.PIS && !("scribe" in data.PIS)) {
            return res.status(400).json({ error: "rushee needs scribe responses" });
          }
          newPIS = data.PIS;
          hasBrotherFields = "brothers" in newPIS;
          newPIS.brothers = hasBrotherFields ? [req.body.brother, newPIS.brothers[0]] : [req.body.brother, ""];
          newPIS.brotherReviews = {
              reviews: hasBrotherFields ? [req.body.review, newPIS.brotherReviews.reviews[0]] : [req.body.review, ""],
              bids: hasBrotherFields ? [req.body.bid, newPIS.brotherReviews.bids[0]] : [req.body.bid, ""],
              present: hasBrotherFields ? [req.body.bidVote, newPIS.brotherReviews.present[0]] : [req.body.bidVote, ""]
          }
        } else {
          let brothers = [req.body.brother, ""]
          let brotherReviews = {
            reviews: [req.body.review, ""],
            bids: [req.body.bid, ""],
            present: [req.body.bidVote, ""],
          }
          newPIS = {
            brothers: brothers,
            createdAt: new Date().toISOString(),
            brotherReviews: brotherReviews
          }
        }
        return db.doc(`/rushees/${req.body.rusheeGTID}`).update({ PIS: newPIS });
    })
    .then(() => {
      return res.json({ message: `brother review for ${req.body.rusheeGTID} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "error adding PIS for rushee" });
      console.error(err);
    });
}

exports.getPISOutline =(req, res) => {
  db.doc(`/pisOutlines/${req.query.versionName}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ gtid: "pis outline version is not in the system" });
      }
      return res.json(doc.data());
    })
    .catch((err) => {
      res.status(500).json({ error: "error getting pis outline" });
      console.error(err);
    });

};
exports.addPISOutline = (req, res) => {
  const newPIS = {
    versionName: req.body.versionName,
    requiredDates: req.body.requiredDates,
    questions: req.body.questions,
    optionalQuestions: req.body.optionalQuestions,
    createdAt: new Date().toISOString(),
  };

  db.doc(`/pisOutlines/${newPIS.versionName}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ versionName: "PIS outline with that outline already exists" });
      }
      return true;
    })
    .then(() => {
      return db.doc(`/pisOutlines/${newPIS.versionName}`).set(newPIS);
    })
    .then(() => {
      return res.json({ message: `pis outline created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "error adding pis outline" });
      console.error(err);
    });
};