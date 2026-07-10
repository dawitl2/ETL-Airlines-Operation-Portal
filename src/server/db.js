import mongoose from 'mongoose'

let cached = globalThis.__etlMongoose

if (!cached) {
  cached = globalThis.__etlMongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is required. Copy .env.example to .env.local and fill it in.')
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
