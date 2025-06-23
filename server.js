import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './auth.routes.js';
import blogRoutes from './blog.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('Connecting to MongoDB at:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server started on port 5000'));
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
