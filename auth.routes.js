import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './User.js';
import auth from './auth.js';
import role from './role.js';

const router = express.Router();

const seedUsers = async () => {
  const existing = await User.find();
  if (existing.length) return;
  const users = [
    { username: 'admin123', password: 'pass123', role: 'admin' },
    { username: 'mod123', password: 'pass123', role: 'moderator' },
    { username: 'user123', password: 'pass123', role: 'user' }
  ];
  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const newUser = new User({ username: u.username, password: hashedPassword, role: u.role });
    await newUser.save();
  }
};
seedUsers();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/promote/:id', auth, role('admin'), async (req, res) => {
  try {
    const { role: newRole } = req.body;
    if (!['admin', 'moderator'].includes(newRole)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role: newRole }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: `User promoted to ${newRole}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
