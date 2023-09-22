const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const Nano = require('nano');
const nano = Nano('http://admin:admin@localhost:5984');
const mydatabase = nano.db.use('mydatabase');

// Secret key for JWT encoding
const secret = "YourSecretKey";
const saltRounds = 10;

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the user into the CouchDB database
    await mydatabase.insert({ username, password: hashedPassword }, username);
    
    // Generate JWT token
    const token = jwt.encode({ username }, secret);
    
    res.status(200).json({ message: 'User added successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch the user from CouchDB
    const user = await mydatabase.get(username);

    // Validate credentials using bcrypt
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = jwt.encode({ username }, secret);
      res.status(200).json({ message: 'User authenticated successfully', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
