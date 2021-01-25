// Import mongoose
const mongoose = require("mongoose");

// Define user schema
const UserSchema = new mongoose.Schema({
  googleID: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "user",
  },
});

// Create User Model
const User = mongoose.model("User", UserSchema);

// Export Model
module.exports = User;
