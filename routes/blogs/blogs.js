// Import NPM modules
const express = require("express");
const router = express.Router();

// Import local modules
const Blog = require("../../db/models/Blog");
const User = require("../../db/models/User");
const { ensureAuth } = require("../../utils/ensureAuth");
const {
  truncate,
  stripTags,
  editIcon,
  formatDate,
  select,
} = require("../../utils/others");

// @desc    Show all blogs
// @route   GET /blogs
router.get("/", ensureAuth, async (req, res) => {
  try {
    // Get all blogs
    const blogs = await Blog.find({ status: "public" }).populate("owner");

    // Render blogs
    res.render("blogs/all", {
      blogs,
      truncate,
      stripTags,
      editIcon,
      formatDate,
      user: req.user,
    });
  } catch (err) {
    res.render("errors/500");
  }
});

// @desc    Add blog page
// @route   GET /blogs/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("blogs/add");
});

// @desc    Process add blog
// @route   POST /blogs
router.post("/", ensureAuth, async (req, res) => {
  // owner of blog
  req.owner = req.user._id;

  // Create new blog
  const newBlog = new Blog({
    ...req.body,
    owner: req.user._id,
  });

  try {
    // Save blog
    await newBlog.save();
    res.redirect("/dashboard");
  } catch (err) {
    res.render("errors/500");
  }
});

// @desc    Delete one blog
// @route   DELETE /blogs/delete/:id
router.delete("/delete/:id", ensureAuth, async (req, res) => {
  try {
    // Find blog and delete
    await Blog.findByIdAndDelete(req.params.id);

    // Redirect
    res.redirect("/dashboard");
  } catch (err) {
    res.render("errors/404");
  }
});

// @desc    Display edit page
// @route   GET /blogs/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    // Find blog
    const blog = await Blog.findOne({ _id: req.params.id });

    // Display edit page
    res.render("blogs/edit.ejs", { blog, select });
  } catch (err) {
    res.render("errors/404");
  }
});

// @desc    Update blog
// @route   PUT /blogs/edit/:id
router.put("/edit/:id", ensureAuth, async (req, res) => {
  try {
    // Find blog and update
    await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Redirect
    res.redirect("/dashboard");
  } catch (err) {
    res.render("errors/404");
  }
});

// @desc    Single blog
// @route   GET /blogs/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    // Find blog
    const blog = await Blog.findById(req.params.id).populate("owner");

    // Render read more
    res.render("blogs/read-more", {
      blog,
      truncate,
      stripTags,
      editIcon,
      formatDate,
      user: req.user,
    });
  } catch (err) {
    res.render("errors/404");
  }
});

// @desc    Show blogs from single user
// route    GET /blogs/user/:id
router.get("/user/:id", ensureAuth, async (req, res) => {
  try {
    // Get all blogs from one user
    const blogs = await Blog.find({
      owner: req.params.id,
      status: "public",
    }).populate("owner");

    // Render all blogs
    res.render("blogs/user-blogs.ejs", {
      blogs,
      truncate,
      stripTags,
      editIcon,
      formatDate,
      user: req.user,
    });
  } catch (err) {
    res.render("errors/404");
  }
});

// Export router
module.exports = router;
