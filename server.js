import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './auth.routes.js';
import blogRoutes from './blog.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// MongoDB connection and server start
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in environment variables.');
    }

    console.log('Connecting to MongoDB at:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

startServer();
