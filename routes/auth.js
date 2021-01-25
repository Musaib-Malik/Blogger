// Import NPM modules
const express = require("express");
const passport = require("passport");
const ensureAuth = require("../utils/ensureAuth");
const router = express.Router();

// @desc    Auth With Google
// @route   GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc    Logout user
// @route   GET /auth/logout
router.get("/logout", (req, res) => {
  req.logOut();
  req.session.destroy(() => res.redirect("/"));
});

// Export router
module.exports = router;
