const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const Nano = require('nano');
const nano = Nano('http://admin:admin@localhost:5984');
const mydatabase = nano.db.use('mydatabase');

// Secret key for JWT encoding
const secret = "YourSecretKey";

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Insert the user into the CouchDB database
    await mydatabase.insert({ username, password }, username);
    
    // Generate JWT token
    const token = jwt.encode({ username }, secret);
    
    res.status(200).json({ message: 'User added successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch the user from CouchDB
    const user = await mydatabase.get(username);

    // Validate credentials (Note: use a secure password hashing method in a real app)
    if (user.password === password) {
      const token = jwt.encode({ username }, secret);
      res.status(200).json({ message: 'User authenticated successfully', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
