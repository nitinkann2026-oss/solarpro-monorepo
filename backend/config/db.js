import mongoose from 'mongoose';
import dns from 'dns';

// Ensure cloud SRV records (MongoDB Atlas) resolve smoothly across all Windows networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Use system default if custom DNS cannot be assigned
}
/**
 * --------------------------------------------------------------------------
 * DATABASE CONNECTION (MONGODB + MONGOOSE)
 * --------------------------------------------------------------------------
 * What is MongoDB?
 * - MongoDB is a popular NoSQL database that stores data in flexible,
 *   JSON-like documents (instead of rigid tables like SQL).
 *
 * What is Mongoose?
 * - Mongoose is an ODM (Object Data Modeling) library for Node.js.
 * - It acts like a translator: it allows us to define schemas (blueprints),
 *   validate incoming data, and easily query MongoDB using JavaScript methods.
 *
 * Graceful Connection:
 * - If MongoDB is running on your computer or an Atlas cloud URI is provided,
 *   it connects automatically.
 * - If MongoDB is not yet installed or running, it catches the error and
 *   switches smoothly to the local storage fallback so your server NEVER crashes!
 */

export let isMongoConnected = false;

export const connectDB = async () => {
  if (mongoose.connection && mongoose.connection.readyState >= 1) {
    isMongoConnected = true;
    return true;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/solarpro';

  try {
    const isAtlas = mongoUri.includes('mongodb+srv') || mongoUri.includes('.mongodb.net');
    
    // Cloud Atlas requires a bit more time for DNS & SSL handshake (10s) vs local (2.5s)
    const timeout = isAtlas ? 10000 : 2500;

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: timeout,
    });

    isMongoConnected = true;
    console.log(`\x1b[32m✔ MongoDB Connected Successfully (${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB'}): ${conn.connection.host}\x1b[0m`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    const isAtlas = mongoUri.includes('mongodb+srv') || mongoUri.includes('.mongodb.net');

    console.log('\x1b[33m%s\x1b[0m', '-------------------------------------------------------');
    if (isAtlas) {
      console.log('\x1b[31m%s\x1b[0m', '❌ MongoDB Atlas Connection Failed!');
      console.log('\x1b[33m%s\x1b[0m', `Reason: ${error.message}`);
      console.log('\x1b[36m%s\x1b[0m', '💡 Common Atlas Fixes:');
      console.log('\x1b[36m%s\x1b[0m', '1. In MongoDB Atlas, go to "Network Access" ➔ Click "Add IP Address" ➔ Select "Allow Access from Anywhere (0.0.0.0/0)".');
      console.log('\x1b[36m%s\x1b[0m', '2. In "Database Access", verify your username & password.');
      console.log('\x1b[36m%s\x1b[0m', '3. Make sure to replace <password> in .env with your actual password.');
    } else {
      console.log('\x1b[33m%s\x1b[0m', 'ℹ️  Local MongoDB is not running (Connection timed out).');
      console.log('\x1b[36m%s\x1b[0m', '👉 Active Fallback: Using Local JSON Storage (backend/data/consultations.json)');
    }
    console.log('\x1b[33m%s\x1b[0m', '-------------------------------------------------------');
    return false;
  }
};
