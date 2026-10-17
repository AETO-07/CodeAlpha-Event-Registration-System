require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddeware = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    res.status(401).json({
      message: "Login rejected.",
    });
    return;
  }

  const [scheme, token] = auth.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Login rejected",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.log(error.message);

      return res.status(401).json({
        message: "Failed Verification",
      });
    }
    req.user = decoded;

    next();
  });
};

module.exports = authMiddeware;
