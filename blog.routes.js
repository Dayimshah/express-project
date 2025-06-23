import express from 'express';
import Blog from './Blog.js';
import auth from './auth.js';
import role from './role.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const newBlog = new Blog({ ...req.body, author: req.user.id });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const isOwner = blog.author.toString() === req.user.id;
    const isMod = req.user.role === 'moderator';
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isMod && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const isOwner = blog.author.toString() === req.user.id;
    const isMod = req.user.role === 'moderator';
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isMod && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
