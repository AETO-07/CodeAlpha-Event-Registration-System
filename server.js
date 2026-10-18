require("dotenv").config();
const express = require("express");
const db = require("./db.js");
const authRoutes = require("./routes/authRoutes.js");
const eventRoutes = require("./routes/eventRoutes.js");
const registrationRoutes = require("./routes/registrationRoutes.js");
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/events", registrationRoutes);
app.use("/api/registrations", registrationRoutes);

app.get("/", (req, res) => {
  res.send("App responding");
});

app.listen(process.env.PORT, () => {
  console.log(`App responding from port ${process.env.PORT}`);
});
