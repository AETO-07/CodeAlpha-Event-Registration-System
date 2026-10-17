const db = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (name === undefined || email === undefined || password === undefined) {
    res.send("Incomplete Credentials");
    return;
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      if (error) {
        res.status(500).json({
          message: "Server Error",
        });
        return;
      } else if (result.length > 0) {
        res.send("email is in use already.");
        return;
      } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        db.query(
          "INSERT INTO users(name, email, password, role ) VALUES(?,?,?,?)",
          [name, email, hashedPassword, "user"],
          (error) => {
            if (error) {
              res.status(500).json({
                message:
                  "Server Error. Could not complete registration, try again.",
              });
            } else {
              res.status(201).json({
                message: "Registration Successful!",
              });
            }
          },
        );
      }
    },
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (email === undefined || password === undefined) {
    return res.status(400).json({
      message: "Incomplete Credentials",
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      if (error) {
        res.status(500).json({
          message: "Server Error.",
        });
        return;
      } else if (result.length === 0) {
        res.status(404).json({
          message: "User not found.",
        });
        return;
      } else {
        const hashedPassword = result[0]["password"];
        const check = await bcrypt.compare(password, hashedPassword);

        if (!check) {
          return res.status(401).json({
            message: "Incorrect password or email, try again.",
          });
        }

        const payload = {
          id: result[0].id,
          role: result[0].role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        res.status(200).json({
          message: "Login Successful.",
          token: token,
        });
      }
    },
  );
};
module.exports = { register, login };
