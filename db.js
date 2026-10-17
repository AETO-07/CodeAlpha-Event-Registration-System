require("dotenv").config();
const database = require("mysql2");

const connection = database.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.query("SELECT 1", (error) => {
  if (error) {
    console.log(error);
    return;
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = connection;
