require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false, // Note: Setting this to false is insecure for production environments
    // ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString(),
  } : false,
});

pool.connect((err) => {
  if(err){
    console.error('Connection Error', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

module.exports = pool;


// Tämä antaa password authentication failed for user "postgres" virheen

// require('dotenv').config();
// const {Pool} = require('pg');

// const pgPool = new Pool({
//     host: process.env.PG_HOST,
//     port: process.env.PG_PORT,
//     database: process.env.PG_DB,
//     user: process.env.PG_USER,
//     password: process.env.PG_PW,
//     ssl: true
// });

// pgPool.connect((err) => {
//     if(err){
//         console.log(err.message);
//     }
// });

// module.exports = pgPool;