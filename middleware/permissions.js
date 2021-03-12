const jwt = require("jsonwebtoken");

const permissions = (users = []) => (req, res, next) => {
  const token = req.headers.token;

  console.log(token);
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    console.log(err, decoded);
    if (err) {
      res.status(401).json({ msg: "Not Authenticated" });
    } else if (users.length === 0 || users.includes(decoded)) {
      next();
    } else {
      res.status(401).json({ msg: "Not Authenticated" });
    }
  });
};

module.exports = { permissions };