// Import mongoose
const mongoose = require("mongoose");

// Define blog schema
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },
  body: {
    type: String,
    required: true,
  },
  cretedAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Create blog model
const Blog = mongoose.model("Blog", BlogSchema);

// Export Model
module.exports = Blog;
