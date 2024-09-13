const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'your_pg_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_pg_password',
  port: 5432,
});

module.exports = pool;