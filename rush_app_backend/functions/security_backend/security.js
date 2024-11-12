const { db } = require("../util/firebaseAdmin");

const firebaseConfig = require("../util/config");
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const { validateSignup, validateLogin } = require("../util/validation");
// TODO: Work on nested promises here
exports.signup = (req, res) => {
  const newUser = {
    name: req.body.name,
    gtid: req.body.gtid,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  // Signup validation
  const { valid, errors } = validateSignup(newUser);
  if (!valid) {
    return res.status(400).json(errors);
  }

  let token, userID;
  db.doc(`/users/${newUser.gtid}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ gtid: "user already exists with the same gtid" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
          .then((data) => {
            userID = data.user.uid;
            return data.user.getIdToken();
          })
          .then((_token) => {
            token = _token;
            const userCredentials = {
              gtid: newUser.gtid,
              email: newUser.email,
              name: newUser.name,
              createdAt: new Date().toISOString(),
              userID: userID,
            };
            return db.doc(`/users/${newUser.gtid}`).set(userCredentials);
          })
          .then(() => {
            return res.status(201).json({ token });
          });
      }
    })
    .catch((err) => {
      if (err.code === "auth/email-already-in-use") {
        res.status(400).json({ email: "Email is already in use" });
      } else {
        res.status(500).json({ error: err.code });
      }
    })

};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLogin(user);
  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ general: "Wrong Credentials" });
    });
};
