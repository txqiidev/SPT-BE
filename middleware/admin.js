module.exports = authenticate = (req, res, next) => {
  if (req.user.isAdmin === 0) return res.status(403).send("Access denied.");
  next();
};
