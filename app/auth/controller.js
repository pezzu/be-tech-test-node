var jwt = require('jsonwebtoken');

const users = {
  admin: "admin",
  editor: "verysecretpassword",
  tester: "123,",
};

const authenticate = (req, res) => {
  const { user, password } = req.body;

  if (users[user] === password) {
    var token = jwt.sign({ user }, process.env.SECRET);
    res.cookie('token', token, {expire: 360000 + Date.now()});

    res.json({ status: "ok" });
  } else {
    // new AuthError(401, "invalid...")
    res.status(401).json({
      status: "Not Authenticated",
      msg: "Invalid user or passowrd",
    });
  }
};

module.exports = { authenticate };
