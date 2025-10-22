const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/post');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', ['name', 'email']);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a post (protected)
router.post('/', auth, async (req, res) => {
  const { title, body } = req.body;

  try {
    const newPost = new Post({ title, body, author: req.user.id });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
//test