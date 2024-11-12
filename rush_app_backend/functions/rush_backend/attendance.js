const { db } = require("../util/firebaseAdmin");

exports.updateAttendance = (req, res) => {
    db.doc(`/attendance/${req.body.night}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(400).json({ error: "Cannot find attendance doc" });
        }
        return doc;
      })

      .then((doc) => {
        let newAttendance = doc.data().attendance;
        //REMOVE IS NOT WORKING YET DO NOT USE
        if (!req.body.add && hasRusheeGTID(newAttendance, req.body.GTID)) {
            newAttendance = newAttendance.filter((rushee) => rushee.GTID !== req.body.GTID);
        } else if (req.body.add && !newAttendance.includes(req.body.rusheeGTID)) {
          let newRushee = {
            GTID: req.body.GTID,
            timeAdded: req.body.timeAdded,
          }
            newAttendance.splice(0, 0, newRushee);
        }
        console.log(newAttendance);
        db.doc(`/attendance/${req.body.night}`).update({ attendance: newAttendance });
        return newAttendance;
      })

      .then((newAttendance) => {
        return res.json({attendance: newAttendance});
      })
      
      .catch((err) => {
        res.status(500).json({ error: "error in adding rushee attendance" });
        console.error(err);
      });
  
  };

  hasRusheeGTID = (attendance, GTID) => {
    for (var rushee in attendance) {
      if (rushee.GTID === GTID) {
        return true;
      }
    }
    return false;
  }

  exports.getAttendance = (req, res) => {
    db.doc(`/attendance/${req.query.night}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(400).json({ error: "Cannot find attendance doc" });
        }
        return doc;
      })
      .then((doc) => {
        return res.json(doc.data());
      })
      .catch((err) => {
        res.status(500).json({ error: "error in adding rushee attendance" });
        console.error(err);
      });
  
  };