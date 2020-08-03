module.exports = function asyncMiddleware(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      res.status(error.response.status);
      return res.send(error.message);
    }
  };
};
