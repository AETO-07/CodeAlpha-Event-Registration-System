const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/:id/register",
  authMiddleware,
  registrationController.registerForEvent,
);

router.get("/", authMiddleware, registrationController.getMyRegistration);

router.delete(
  "/:id",
  authMiddleware,
  registrationController.cancelRegistration,
);

module.exports = router;
