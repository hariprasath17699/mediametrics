const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    // Example login logic
    res.json({ message: 'Login successful' });
});

router.post('/signup', (req, res) => {
    // Example signup logic
    res.json({ message: 'Signup successful' });
});

module.exports = router;
