const db = require("../db.js");
const validateId = require("../controllers/eventController.js");

const registerForEvent = (req, res) => {
  const eventId = validateId.idValidator(req.params.id);

  if (eventId === null) {
    return res.status(400).json({ message: "Invalid event ID." });
  }

  const userId = req.user.id;

  db.query(
    "SELECT * FROM events WHERE id = ?",
    [eventId],
    (error, eventResults) => {
      if (error) {
        return res.status(500).json({ message: "Error checking event." });
      }

      if (eventResults.length === 0) {
        return res.status(404).json({ message: "Event not found." });
      }

      db.query(
        "INSERT INTO registrations (event_id, user_id) VALUES (?, ?)",
        [eventId, userId],
        (error) => {
          if (error) {
            if (error.code === "ER_DUP_ENTRY") {
              return res.status(409).json({
                message: "You are already registered for this event.",
              });
            }
            return res
              .status(500)
              .json({ message: "Error creating registration." });
          }

          res
            .status(201)
            .json({ message: "Successfully registered for the event." });
        },
      );
    },
  );
};

const getMyRegistration = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT registrations.id AS registration_id, events.id AS event_id, events.title, events.description, events.date, events.location, registrations.registered_time FROM registrations INNER JOIN events ON registrations.event_id = events.id WHERE registrations.user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error fetching registrations:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json({ registrations: results });
    },
  );
};

const cancelRegistration = (req, res) => {
  const registrationId = validateId.idValidator(req.params.id);

  if (registrationId === null) {
    return res.status(400).json({ message: "Invalid registration ID." });
  }

  const userId = req.user.id;

  db.query(
    "DELETE FROM registrations WHERE id = ? AND user_id = ?",
    [registrationId, userId],
    (error, deletedResult) => {
      if (error) {
        console.error("Error deleting registration:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (deletedResult.affectedRows === 0) {
        return res.status(404).json({
          message: "Registration not found or you are not the owner.",
        });
      }
      res.status(200).json({ message: "Registration deleted successfully." });
    },
  );
};

module.exports = {
  registerForEvent,
  getMyRegistration,
  cancelRegistration,
};
