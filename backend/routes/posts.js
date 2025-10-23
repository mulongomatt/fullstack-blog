const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// multer memory storage for file buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB limit
});

// helper: upload buffer to cloudinary via stream
function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// helper: delete by public_id (if exists)
function deleteFromCloudinary(publicId) {
  if (!publicId) return Promise.resolve();
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}

// helper: tolerant user id extraction from req.user
function getTokenUserId(req) {
  if (!req.user) return null;
  if (req.user.id) return req.user.id;
  if (req.user._id) return req.user._id;
  if (req.user.user && (req.user.user.id || req.user.user._id)) return req.user.user.id || req.user.user._id;
  return typeof req.user === 'string' ? req.user : null;
}

/* GET all posts */
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('GET /posts error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* GET single post */
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'name');
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error('GET /posts/:id error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* CREATE post (with optional image upload) */
/* Accepts multipart/form-data with field names:
   - title, subtitle, content (text)
   - image (file, optional)
*/
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const userId = getTokenUserId(req);
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

    const { title, subtitle, content } = req.body;
    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      // validate mimetype (optional)
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({ msg: 'Unsupported image format' });
      }

      const result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'devblog',
        resource_type: 'image',
        transformation: [{ width: 1600, crop: 'limit' }],
      });

      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const post = new Post({
      title,
      subtitle,
      content,
      image: imageUrl,
      imagePublicId,
      user: userId,
    });

    await post.save();
    await post.populate('user', 'name');

    res.status(201).json(post);
  } catch (err) {
    console.error('POST /posts error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* UPDATE post (with optional new image) */
/* Accepts multipart/form-data with optional 'image' file, and text fields */
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const tokenUserId = getTokenUserId(req);
    if (!tokenUserId) return res.status(401).json({ msg: 'Unauthorized' });
    if (post.user.toString() !== tokenUserId.toString()) return res.status(401).json({ msg: 'Unauthorized' });

    const { title, subtitle, content } = req.body;

    // If new file sent, upload new image and delete old one
    if (req.file) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({ msg: 'Unsupported image format' });
      }

      // upload new
      const result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'devblog',
        resource_type: 'image',
        transformation: [{ width: 1600, crop: 'limit' }],
      });

      // delete old image from cloudinary if exists
      if (post.imagePublicId) {
        try {
          await deleteFromCloudinary(post.imagePublicId);
        } catch (e) {
          console.warn('Failed to delete old image from Cloudinary', e);
        }
      }

      post.image = result.secure_url;
      post.imagePublicId = result.public_id;
    }

    // update text fields (if provided)
    post.title = title ?? post.title;
    post.subtitle = subtitle ?? post.subtitle;
    post.content = content ?? post.content;
    post.updatedAt = Date.now();

    await post.save();
    await post.populate('user', 'name');

    res.json(post);
  } catch (err) {
    console.error('PUT /posts/:id error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/* DELETE post (and delete cloudinary image if present) */
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const tokenUserId = getTokenUserId(req);
    if (!tokenUserId) return res.status(401).json({ msg: 'Unauthorized' });
    if (post.user.toString() !== tokenUserId.toString()) return res.status(401).json({ msg: 'Unauthorized' });

    // delete image from cloudinary if present
    if (post.imagePublicId) {
      try {
        await deleteFromCloudinary(post.imagePublicId);
      } catch (e) {
        console.warn('Failed to delete image from Cloudinary on post deletion', e);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error('DELETE /posts/:id error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
