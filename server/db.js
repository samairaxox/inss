// Connect to MongoDB once and share the db object everywhere.
const { MongoClient, ObjectId } = require('mongodb');
const config = require('./config');

let client;
let db;

async function connectDb() {
  if (db) return db;
  try {
    client = new MongoClient(config.mongoUri, { serverSelectionTimeoutMS: 3000 });
    await client.connect();
    db = client.db(config.dbName);
    console.log(`MongoDB connected: ${config.mongoUri} (db: ${config.dbName})`);
    return db;
  } catch (err) {
    console.error(
      `MongoDB not reachable at ${config.mongoUri}. Start MongoDB or fix MONGO_URI in .env`
    );
    process.exit(1);
  }
}

function getDb() {
  if (!db) throw new Error('Database not connected yet. Call connectDb() first.');
  return db;
}

// Returns an ObjectId, or null if the string is not a valid id
function toObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === String(id) ? new ObjectId(id) : null;
}

async function closeDb() {
  if (client) await client.close();
}

module.exports = { connectDb, getDb, toObjectId, closeDb };
