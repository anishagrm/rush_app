const { db, firebaseAdmin } = require("../util/firebaseAdmin");
const config = require("../util/config");

deleteImage = (imageName) => {
  const bucket = firebaseAdmin.storage().bucket();
  const path = `${imageName}`;
  return bucket
    .file(path)
    .delete()
    .then(() => {
      return;
    })
    .catch((error) => {
      return;
    });
};

exports.addBrotherPhoto = (req, response) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const busboy = new BusBoy({ headers: req.headers });
  let imageFileName;
  let imageToBeUploaded = {};
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/png" && mimetype !== "image/jpeg") {
      return response.status(400).json({ error: "Wrong file type submited" });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${req.user.gtid}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });
  deleteImage(imageFileName);
  busboy.on("finish", () => {
    firebaseAdmin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.gtid}`).update({
          imageUrl,
        });
      })
      .then(() => {
        return response.json({ message: "Image uploaded successfully" });
      })
      .catch((error) => {
        console.error(error);
        return response.status(500).json({ error: error.code });
      });
  });
  busboy.end(req.rawBody);
};

exports.getBrother = (req, res) => {
  db.doc(`/users/${req.user.gtid}`)
    .get()
    .then(() => {
      return db.doc(`/users/${req.user.gtid}`).get();
    })
    .then((doc) => {
      return res.json(doc.data());
    })
    .catch((err) => {
      res.status(500).json({ error: "error getting brother" });
      console.error(err);
    });
};

exports.queryBrothers = (req, res) => {
  db.collection("/users")
    .where("userID", "==", req.query.uid)
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length === 0) {
        return res.status(400).json({ uid: "brother is not in the system" });
      } else {
        return res.json(snapshot.docs[0].data());
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "error getting brother" });
      console.error(err);
    });
};
