import { Client } from 'pg';

const dbURL = {
  user: 'postgres',
  host: 'localhost',
  database: 'sendItDB',
  password: process.env.PGPASS,
  port: 5432
};

/**
 * Handles database manipulations
 */
class DatabaseManager {
  /**
   * setup database
   * @param {string} sql
   * @param {string/object/array} fields (optional)
   * @param {object} dbUrl (optional)
   * @returns {promise}
   */
  static query(sql, fields = null, dbUrl = dbURL) {
    const client = new Client(dbUrl);
    client.connect();
    if (fields === null) {
      return client.query(sql);
    }
    return client.query(sql, fields);
  }

  /**
   *  handles db client
   * @param {string} dbUrl (optional)
   * @returns {object}
   */
  static client(dbUrl = dbURL) {
    const client = new Client(dbUrl);
    client.connect();
    return client;
  }
}

module.exports = DatabaseManager;
