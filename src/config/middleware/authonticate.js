const jwt = require('jsonwebtoken');
const respondWithError= require('../../utils/respondingwitherror');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return respondWithError(res, 401, 'Token missing or invalid');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return respondWithError(res, 403, 'Token expired or invalid');
    }

    req.user = user;
    next();
  });
};