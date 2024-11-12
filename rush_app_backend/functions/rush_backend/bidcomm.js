const { db } = require("../util/firebaseAdmin");
const config = require("../util/config");

const bidcommIDs = 
[                        
  "903674877", // Vaishnavi Vuyyuru
  "903753277", // Ekta Mistry
  "903789803", // Lucy Scott
  "903692185", // Karthik Iyer 
  "903784502", // Rida Merani
  "903729987", // Harsh Shah
  "903775123", // Ajai Singh
  "903588426", // Rahi Patel
  "903598039", // Akshita Sharma
  "903586405", // Mrinal Chanshetty
]
                                        
exports.addBidcommNotes = (req, res) => {

  const bidcommNotes = {
    rusheeGTID: req.body.rusheeGTID,
    text: req.body.text,
    createdAt: new Date().toISOString(),
    // storing the name of the brother
    brotherID: req.user.gtid, // brother uploading the PIS
  };

  if(!bidcommIDs.includes(req.user.gtid)) {
    return res.status(400).json({ gtid: "are you sure you're part of bidcomm??" });
  }

  db.doc(`/rushees/${bidcommNotes.rusheeGTID}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ gtid: "rushee is not in the system" });
      }
      return doc;
    })
    .then((doc) => {
        return db.doc(`/rushees/${bidcommNotes.rusheeGTID}`).update({ bidcomm: bidcommNotes});
    })
    .then(() => {
      return res.json({ message: `bidcomm notes for ${bidcommNotes.gtid} updated successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "error adding bid comm notes for rushee" });
      console.error(err);
    });
};

exports.getBidcommNotes = (req, res) => {

    db.doc(`/rushees/${req.query.rusheeGTID}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(400).json({ gtid: "rushee is not in the system" });
        }
        return doc;
      })
      .then((doc) => {
        let bidcommInfo = {}
        bidcommInfo["bidcomm"] = doc.data().bidcomm;
        bidcommInfo["auth"] = bidcommIDs.includes(req.user.gtid);
        return res.json(bidcommInfo);
      })
      .catch((err) => {
        res.status(500).json({ error: "error getting bid comm notes" });
        console.error(err);
      });
  
  };