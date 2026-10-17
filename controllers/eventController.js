const db = require("../db.js");

const createEvent = (req, res) => {
  const { title, description, date, location } = req.body;
  const userId = req.user.id;

  db.query(
    "INSERT INTO events (title, description, date, location, organizer_id) VALUES(?,?,?,?,?)",
    [title, description, date, location, userId],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Error creating event" });
      }

      res.status(201).json({
        message: "Event created successfully",
        eventId: result.insertId,
      });
    },
  );
};

const getAllEvents = (req, res) => {
  db.query("SELECT * FROM events", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error fetching events" });
    }
    res.status(200).json({ events: results });
  });
};

const idValidator = (id) => {
  const idToNumber = Number(id);
  if (!Number.isInteger(idToNumber) || idToNumber <= 0) {
    return null;
  }
  return idToNumber;
};

const getEventById = (req, res) => {
  const result = idValidator(req.params.id);
  if (result === null) {
    return res.status(400).json({ message: "Invalid event ID" });
  }
  db.query(
    "SELECT * FROM events   WHERE id = ?",
    [result],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error fetching event" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json({ event: results[0] });
    },
  );
};

const updateEvent = (req, res) => {
  const result = idValidator(req.params.id);
  if (result === null) {
    return res.status(400).json({ message: "Invalid event ID." });
  }
  const organizerId = req.user.id;

  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.date ||
    !req.body.location
  ) {
    return res.status(400).json({
      message:
        "All fields (title, description, date and location) are required for updating the event.",
    });
  }
  db.query(
    "SELECT * FROM events WHERE id = ? AND organizer_id = ?",
    [result, organizerId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error fetching event" });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Event not found or you are not the organizer." });
      }
      db.query(
        "UPDATE events SET title = ?, description = ?, date = ?, location =? WHERE id = ? AND organizer_id = ?",
        [
          req.body.title,
          req.body.description,
          req.body.date,
          req.body.location,
          result,
          organizerId,
        ],
        (error) => {
          if (error) {
            return res.status(500).json({ error: "Error updating event." });
          }
          res.status(200).json({ message: "Event updated successfully." });
        },
      );
    },
  );
};

const deleteEvent = (req, res) => {
  const eventId = idValidator(req.params.id);
  if (eventId === null) {
    return res.status(400).json({ message: "Invalid event ID." });
  }

  const organizerId = req.user.id;

  db.query(
    "SELECT id FROM events WHERE id = ? AND organizer_id = ?",
    [eventId, organizerId],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Error deleting event." });
      }
      if (result.length === 0) {
        return res.status(404).json({
          message: "Event not found or you are not the organizer.",
        });
      }
      db.query(
        "SELECT id FROM registrations WHERE event_id = ?",
        [eventId],
        (error, registrationResults) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "Error checking registrations." });
          }
          if (registrationResults.length > 0) {
            return res.status(409).json({
              message: "Cannot delete event with existing registrations.",
            });
          }
          db.query(
            "DELETE FROM events WHERE id = ? AND organizer_id = ?",
            [eventId, organizerId],
            (error, deletedResult) => {
              if (error) {
                return res.status(500).json({ error: "Error deleting event." });
              }
              res.status(200).json({ message: "Event deleted successfully!" });
            },
          );
        },
      );
    },
  );
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  idValidator,
};
