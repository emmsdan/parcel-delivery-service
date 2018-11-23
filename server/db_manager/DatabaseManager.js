import { Client } from 'pg';
import moment from 'moment';

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
    return client;
  }

  /**
   *  add notification to db
   * @param {object} message
   * @param {string} dbUrl (optional)
   */
  static setNotification(message, dbUrl = dbURL) {
    const client = new Client(dbUrl);
    client.connect();
    client.query('INSERT INTO NOTIFY (userId, message, dated) VALUES ($1, $2, $3)', [
      message.userId,
      message.notify,
      moment().unix()
    ], (error, resp) => {
      if (error) throw error;
      console.log(resp);
      client.end();
    });
  }

  /**
   *  get notification from db
   * @param {string} userId
   * @param {string} dbUrl (optional)
   * @returns {array}
   */
  static getNotification(userId, dbUrl = dbURL) {
    const client = new Client(dbUrl);
    client.connect();
    client.query('SELECT * FROM NOTIFY WHERE userId = $1', [userId], (error, resp) => {
      if (error) return error;
      client.end();
      return resp;
    });
  }
}

export default DatabaseManager;
