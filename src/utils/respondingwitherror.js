module.exports = (res, status, message, error = null) => {
    res.status(status).json({ message, error });
  };