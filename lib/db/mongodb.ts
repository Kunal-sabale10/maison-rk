import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global caching declaration for TypeScript
declare global {
  var mongooseGlobal: MongooseGlobal | undefined;
}

const cached: MongooseGlobal = global.mongooseGlobal || (global.mongooseGlobal = { conn: null, promise: null });


export async function connectToDatabase() {
  if (!MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI env variable is not set. Operating in high-fidelity mock fallback mode.");
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("✅ Successfully connected to MongoDB database.");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Failed to connect to MongoDB:", e);
    throw e;
  }

  return cached.conn;
}
