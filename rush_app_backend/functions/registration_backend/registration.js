const { db, firebaseAdmin } = require("../util/firebaseAdmin");
const config = require("../util/config");
exports.addRushee = (req, res) => {
  const newRushee = {
    name: req.body.name,
    gtid: req.body.gtid,
    major: req.body.major,
    email: req.body.email,
    referredBy: req.body.referredBy,
    year: req.body.year,
    pronouns: req.body.pronouns,
    discovery: req.body.discovery,
    phoneNumber: req.body.phoneNumber,
    housing: req.body.housing,
    totalYes: 0,
    totalSurveys: 0,
    nights: [],
    professionalism: "N/A",
    leadership: "N/A",
    brotherhood: "N/A",
    growth: "N/A",
    cloud: "mid",
    image: "https://firebasestorage.googleapis.com/v0/b/rush-app-46833.appspot.com/o/No-Photo-Available.jpg?alt=media",
    createdAt: new Date().toISOString()
  };

  
  db.doc(`/rushees/${newRushee.gtid}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ gtid: "rushee already exists with the same gtid" });
      }
      return true;
    })
    .then(() => {
      db.collection("rushees")
      .get()
      .then((rushees) => {
        let number = 0;
        let promises = [];
        rushees.forEach((rushee) => {
          promises.push(
            new Promise((resolve, reject) => {
              if (rushee.data().number > number) {
                number = rushee.data().number;
              }
              resolve();
            })
          )
        });

        return Promise.all(promises).then(() => {
          newRushee.number = number + 1;
          return db.doc(`/rushees/${newRushee.gtid}`).set(newRushee);
        });
        
      })
      .catch((err) => {
        res.status(500).json({ error: "error adding rushee" });
        console.error(err);
      });
      return true;
    })
    .then(() => {
      return res.json({ message: `document ${newRushee.gtid} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "error adding rushee" });
      console.error(err);
    });
};

exports.uploadRusheePhoto = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let newImageFileName;
  let imageToBeUploaded = {};
  let body = {};

  // Retrieve text fields
  busboy.on("field", (fieldname, val) => {
    body[fieldname] = val;
  });

  // Retrieve file fields
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    let imageExtension = filename.split(".").pop();
    let tempImageFileName = `${Math.round(
      Math.random() * Math.pow(10, 9)
    ).toString()}.${imageExtension}`; // save as a random file name to ensure no memory conflicts
    const filepath = path.join(os.tmpdir(), tempImageFileName);
    imageToBeUploaded = { filepath, mimetype, imageExtension };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    newImageFileName = `${body.gtid}.${imageToBeUploaded.imageExtension}`;
    // store rushee photo in the firebase storage bucket
    firebaseAdmin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        destination: newImageFileName,
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        // TODO: Find a better way of fomratting that string
        const url = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${newImageFileName}?alt=media`;
        return db.doc(`/rushees/${body.gtid}`).update({ image: url });
      })
      .then(() => {
        return res.json({
          message: `image uploaded successfully`,
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "error adding rushee photo" });
      });
  });

  busboy.end(req.rawBody);
};