// import pkg from 'pg';
// const { Pool } = pkg;

// export default async function postgresConnect() {
//   let pool;
  
//   // Support both DATABASE_URL (Render/Heroku) and individual env vars (local dev)
//   if (process.env.DATABASE_URL || process.env.EXTERNAL_DATABASE_URL) {
//     // Use connection string (Render/Heroku style)
//     const connectionString = process.env.DATABASE_URL || process.env.EXTERNAL_DATABASE_URL;
//     pool = new Pool({
//       connectionString: connectionString,
//       ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
//     });
//     console.log("📌 Using DATABASE_URL connection string");
//   } else {
//     // Check if we're in production without DATABASE_URL
//     if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
//       console.error("❌ ERROR: DATABASE_URL is required in production!");
//       console.error("Please set DATABASE_URL environment variable in Render Dashboard:");
//       console.error("1. Go to your service → Settings → Environment");
//       console.error("2. Link your PostgreSQL database, OR");
//       console.error("3. Add DATABASE_URL manually with your connection string");
//       throw new Error("DATABASE_URL environment variable is required in production");
//     }
    
//     // Use individual environment variables (local development only)
//     if (!process.env.PG_USER || !process.env.PG_DATABASE) {
//       console.error("❌ ERROR: Database configuration missing!");
//       console.error("For local dev, set: PG_USER, PG_HOST, PG_DATABASE, PG_PASSWORD, PG_PORT");
//       console.error("For production, set: DATABASE_URL");
//       throw new Error("Database configuration is missing");
//     }
    
//     pool = new Pool({
//       user: process.env.PG_USER,
//       host: process.env.PG_HOST || 'localhost',
//       database: process.env.PG_DATABASE,
//       password: String(process.env.PG_PASSWORD),
//       port: Number(process.env.PG_PORT) || 5432,
//     });
//     console.log("📌 Using individual environment variables (local dev)");
//   }

//   try { 
//     await pool.query("SELECT NOW()");
//     console.log("✅ PostgreSQL connected");
//     return pool;
//   } catch (err) {
//     console.error("❌ PostgreSQL connection error:", err.message || err);
//     throw err;
//   }
// }

import pkg from 'pg';
const { Pool } = pkg;

export default async function postgresConnect() {
  let pool;
  const isRender = process.env.RENDER; // Render sets this env variable
  const env = process.env.NODE_ENV || 'development';

  if (process.env.DATABASE_URL) {
    // Use DATABASE_URL in both local and Render
    const connectionString = process.env.DATABASE_URL;
    const forceSsl =
      (process.env.DATABASE_SSL || '').toLowerCase() === 'true' ||
      env === 'production' ||
      isRender ||
      connectionString.includes('render.com');

    pool = new Pool({
      connectionString,
      // Many hosted Postgres providers (Render, Supabase, etc.) require SSL even in dev
      ssl: forceSsl ? { rejectUnauthorized: false } : false
    });

    console.log("📌 Using DATABASE_URL connection string");
    console.log(`🔐 SSL ${forceSsl ? 'enabled' : 'disabled'} for DATABASE_URL`);

  } else {
    // Fallback to local PG_* variables
    if (!process.env.PG_USER || !process.env.PG_DATABASE) {
      throw new Error("❌ Database configuration missing! Set DATABASE_URL or PG_* variables.");
    }

    pool = new Pool({
      user: process.env.PG_USER,
      host: process.env.PG_HOST || "localhost",
      database: process.env.PG_DATABASE,
      password: String(process.env.PG_PASSWORD),
      port: Number(process.env.PG_PORT) || 5432,
    });

    console.log("📌 Using local PG_* variables");
  }

  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected");
    return pool;
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
    throw err;
  }
}
