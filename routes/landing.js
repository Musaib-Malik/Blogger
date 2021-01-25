// Import NPM modules
const express = require("express");
const router = express.Router();

// Import local modules
const { ensureGuest } = require("../utils/ensureAuth");

// @desc    landing page
// @route   GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("landing");
});

// Export router
module.exports = router;
