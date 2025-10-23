const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// Get all posts
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('user', ['name']).sort({ createdAt: -1 });
  res.json(posts);
});

// Get single post
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('user', ['name']);
  if (!post) return res.status(404).json({ msg: 'Post not found' });
  res.json(post);
});

// Create post
router.post('/', auth, async (req, res) => {
  const { title, subtitle, content, image } = req.body;
  const post = new Post({ title, subtitle, content, image, user: req.user.id });
  await post.save();
  res.json(post);
});

// Update post
router.put('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ msg: 'Post not found' });
  if (post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

  const { title, subtitle, content, image } = req.body;
  post.title = title || post.title;
  post.subtitle = subtitle || post.subtitle;
  post.content = content || post.content;
  post.image = image || post.image;
  post.updatedAt = Date.now();
  await post.save();
  res.json(post);
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ msg: 'Post not found' });
  if (post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

  await post.remove();
  res.json({ msg: 'Post removed' });
});

module.exports = router;
