const organizerMiddleware = (req, res, next) => {
  const user = req.user;

  if (user.role !== "organizer") {
    return res
      .status(403)
      .json({
        message: "Access denied. Only organizers can create or delete events.",
      });
  }
  next();
};

module.exports = organizerMiddleware;
