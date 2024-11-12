const { firebaseAdmin, db } = require("./firebaseAdmin");

module.exports = (req, res, next) => {
  let _token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    _token = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }
  firebaseAdmin
    .auth()
    .verifyIdToken(_token)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection("users")
        .where("userID", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.gtid = data.docs[0].data().gtid;
      req.user.name = data.docs[0].data().name;
      return next();
    })
    .catch((err) => {
      console.error("Error verifying token");
      return res.status(403).json(err);
    });
};
