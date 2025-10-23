const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', ['name']).sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', ['name']);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    return res.json(post);
  } catch (err) {
    console.error(err);
    // If bad ObjectId, return 400 (optional) or 500
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { title, subtitle, content, image } = req.body;

    // basic validation (optional)
    if (!title || !content) {
      return res.status(400).json({ msg: 'Title and content are required' });
    }

    const post = new Post({ title, subtitle, content, image, user: req.user.id });
    await post.save();
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

    const { title, subtitle, content, image } = req.body;
    post.title = title ?? post.title;
    post.subtitle = subtitle ?? post.subtitle;
    post.content = content ?? post.content;
    post.image = image ?? post.image;
    post.updatedAt = Date.now();

    await post.save();
    return res.json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

    // use deleteOne() on the document (remove() was removed in newer Mongoose)
    await post.deleteOne();
    return res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
