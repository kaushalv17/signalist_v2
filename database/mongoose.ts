import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  // Persists across Next.js HMR reloads in development
  // eslint-disable-next-line no-var
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null };
}

const cached = global._mongooseCache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      '[DB] MONGODB_URI is not set. Add it to .env.local'
    );
  }

  // Return existing connection immediately
  if (cached.conn) return cached.conn;

  // Reuse in-flight promise to avoid multiple simultaneous connects
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,    // Fail fast — don't queue ops if not connected
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5_000,
        socketTimeoutMS: 45_000,
        family: 4,               // Prefer IPv4 (avoids DNS lookup delays)
      })
      .catch((err) => {
        // Reset so the next call can retry instead of hanging forever
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
