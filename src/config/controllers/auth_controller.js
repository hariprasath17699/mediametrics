const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db');
const respondWithError= require('../../utils/respondingwitherror');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register a user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return respondWithError(res, 400, 'All fields are required');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    connection.query(query, [username, email, hashedPassword], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return respondWithError(res, 400, 'Username or email already exists');
        }
        return respondWithError(res, 500, 'Database error', err);
      }

      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    respondWithError(res, 500, 'Error hashing password', error);
  }
};

// Login a user
exports.login = (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return respondWithError(res, 400, 'Email and password are required');
    }
  
    const query = `SELECT * FROM users WHERE email = ?`;
    connection.query(query, [email], async (err, results) => {
      if (err) {
        return respondWithError(res, 500, 'Database error', err);
      }
  
      if (results.length === 0) {
        return respondWithError(res, 401, 'Invalid email or password');
      }
  
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return respondWithError(res, 401, 'Invalid email or password');
      }
  
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ message: 'Login successful', token });
    });
  };