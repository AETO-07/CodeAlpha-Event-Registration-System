const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController.js");
const authmiddleware = require("../middleware/authMiddleware.js");
const organizerMiddleware = require("../middleware/organizerMiddleware.js");

router.post(
  "/",
  authmiddleware,
  organizerMiddleware,
  eventController.createEvent,
);
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.put(
  "/:id",
  authmiddleware,
  organizerMiddleware,
  eventController.updateEvent,
);
router.delete(
  "/:id",
  authmiddleware,
  organizerMiddleware,
  eventController.deleteEvent,
);

module.exports = router;
