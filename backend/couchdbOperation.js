const db = require('./db');  // Import the database connection

module.exports = {
  // Create (Signup)
  async signupUser(user) {
    try {
      const response = await db.insert(user);
      return response.ok;  // returns true if document insertion was successful
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // Read (Signin)
  async findUser(username) {
    try {
      const user = await db.get(username);
      return user;
    } catch (err) {
      return null;  // User not found
    }
  },

  // Update (Profile Update)
  async updateUser(username, updatedData) {
    try {
      const user = await this.findUser(username);
      const updatedUser = { ...user, ...updatedData, _rev: user._rev };
      await db.insert(updatedUser);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // Delete (Account Deletion)
  async deleteUser(username) {
    try {
      const user = await this.findUser(username);
      await db.destroy(user._id, user._rev);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
};
