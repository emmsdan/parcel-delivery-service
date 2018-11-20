import pg from 'pg-promise';
const pgp = pg();
const db = pgp({
  host: 'localhost',
  database: 'sendItDB',
  port: 5432,
  user: 'postgres', // any admin user
  password: 'eternity123'
});

module.exports = db;