import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/(DBName)";

if (!MONGODB_URI) {
  throw new Error("DB URI is invalid");
}

let cached = global.mongoose;

async function connectToDB() {
  if (cached && cached.conn) {
    return cached.conn;
  }

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
      })
      .then((mongoose) => {
        console.log("MongoDB connected successfully"); 
        return mongoose;
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB");
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export { connectToDB };
