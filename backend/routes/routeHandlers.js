const express = require('express');
const router = express.Router();
const couchdbOperations = require('../couchdbOperations'); // Adjust the path based on your directory structure

// Signup Route
router.post('/signup', async (req, res) => {
  const user = req.body;
  const isSignupSuccessful = await couchdbOperations.signupUser(user);
  res.status(isSignupSuccessful ? 200 : 500).json({ success: isSignupSuccessful });
});

// Signin Route
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = await couchdbOperations.findUser(username);
  if (user && user.password === password) {
    res.status(200).json({ message: "Authenticated" });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Update Profile Route
router.put('/update', async (req, res) => {
  const { username, updatedData } = req.body;
  const isUpdateSuccessful = await couchdbOperations.updateUser(username, updatedData);
  res.status(isUpdateSuccessful ? 200 : 500).json({ success: isUpdateSuccessful });
});

// Delete Account Route
router.delete('/delete', async (req, res) => {
  const { username } = req.body;
  const isDeleteSuccessful = await couchdbOperations.deleteUser(username);
  res.status(isDeleteSuccessful ? 200 : 500).json({ success: isDeleteSuccessful });
});

module.exports = router;
