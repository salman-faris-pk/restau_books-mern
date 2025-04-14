import mongoose from "mongoose";
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_CONNECTION_STRING environment variable inside .env"
  );
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      autoIndex: false,
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected successfully");
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};