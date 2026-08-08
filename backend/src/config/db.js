import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn('[MongoDB] Warning: Neither MONGODB_URI nor MONGO_URI environment variable is defined.');
      return;
    }
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection Warning: ${error.message}. Will retry in background.`);
    // Retry connection after 3 seconds instead of process.exit(1)
    setTimeout(() => {
      connectDB();
    }, 3000);
  }
};
