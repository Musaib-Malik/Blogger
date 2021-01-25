// Import NPM modules
const express = require("express");
const router = express.Router();

// Import local modules
const { ensureAuth } = require("../utils/ensureAuth");
const { formatDate } = require("../utils/others");
const Blog = require("../db/models/Blog");

// @desc    dashboard page
// @route   GET /dashboard
router.get("/", ensureAuth, async (req, res) => {
  try {
    // Get user blogs
    const blogs = await Blog.find({ owner: req.user._id }).lean();

    res.render("dashboard", {
      name: req.user.displayName,
      blogs,
      formatDate,
    });
  } catch (err) {
    res.render("errors/500");
  }
});

// Export router
module.exports = router;
