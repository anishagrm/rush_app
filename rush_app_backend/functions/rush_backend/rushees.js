const { db, admin } = require("../util/firebaseAdmin");
const config = require("../util/config");

exports.getSpecificRushee = (req, res) => {

  db.doc(`/rushees/${req.query.rusheeGTID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ gtid: "rushee is not in the system" });
      }
      rusheeInfo = doc.data()
      return true;
    })
    .then(() => {
      return db.collection(`/rushees/${req.query.rusheeGTID}/surveys`).get()
    })
    .then((data) => {
      let surveys = [];
      data.forEach((doc) => {
        surveys.push(doc.data());
      });
      rusheeInfo["surveys"] = surveys;
      return surveys;
      //return [];
    })
    .then((surveys) => {
      rusheeInfo["surveys"] = surveys;
      return res.json(rusheeInfo);
    })
    .catch((err) => {
      res.status(500).json({ error: "error getting specific rushee" });
      console.error(err);
    });
};

exports.getRushees = (req, res) => {
  db.collection("/rushees")
    .get()
    .then((data) => {
      let rushees = [];
      data.forEach((doc) => {
        let rushee = doc.data();
        rushees.push(rushee);
      });
      return res.json(rushees);
    })
    .catch((err) => console.error(err));
};

exports.updateCloud = (req, res) => {
  db.doc(`/rushees/${req.body.gtid}`)
    .update({cloud: req.body.cloud})
    .then(() => {
      return res.json({ message: "rushee updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
}

