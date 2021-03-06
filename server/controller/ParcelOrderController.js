import validator from 'validator';
import moment from 'moment';
import bcrypt from 'bcrypt';
import { Client } from 'pg';

import { inArray, generateID, isEmpty } from '../helpers/helper';
import ResponseController from './ResponseController';
import DatabaseManager from '../db_manager/DatabaseManager';
import NotificationController from './NotificationController';

const date = moment();
const validateNewOrder = Symbol('validateNewOrder');
/**
 * Handles Parcel Orders
 * @author EmmsDan <ecomje@gmail.com>
 */
class ParcelOrderController extends ResponseController {
  /**
   *  Assigns data to the program
   * @param {array} parcels
   */
  constructor(parcels) {
    super();
    this.parcels = parcels;
  }

/**
   * Get access to all the Parcels in DB
   * @returns {object}
   */
  getOrders() {
    const client = new Client(DatabaseManager.dbConnectString());
    client.connect();
    client.query('SELECT * FROM PARCEL')
      .then((response) => {
        if (response.rowCount > 0) {
          this.setResponse(response.rows);
          this.setStatus(200);
          client.end();
        }
        this.setResponse('Parcel not available');
        this.setStatus(200);
        client.end();
      })
      .catch((error) => {
        this.setResponse('server error');
        this.setStatus(204);
        client.end();
      });
  }

  /**
   *  get a Specific parcel
   * @param {number} id
   * @returns {array}
   */
  getSpecificOrder(id) {
    if (!validator.isAlpha(id)) {
      this.setResponse('Invalid parcel ID specified');
      this.setStatus(400);
      return false;
    }

    const client = new Client(DatabaseManager.dbConnectString());
    client.connect();
    client.query('SELECT * FROM PARCEL WHERE orderid=$1', [id])
      .then((response) => {
        if (response.rowCount > 0) {
          this.setResponse(response.rows);
          this.setStatus(200);
          client.end();
        }
        this.setResponse('Parcel is not available');
        this.setStatus(200);
        client.end();
      })
      .catch((error) => {
        this.setResponse('server error');
        this.setStatus(204);
        client.end();
      });
  }

  /**
   *  Get Specific order relating a User
   * @param {string/number} userid
   * @returns {array/object}
   */
  getUsersOrder(userid) {
    if (!validator.isAlphanumeric(userid)) {
      this.setResponse('Invalid userId specified');
      this.setStatus(400);
      return false;
    }
    const client = new Client(DatabaseManager.dbConnectString());
    client.connect();
    client.query('SELECT * FROM PARCEL WHERE userid=$1', [userid])
      .then((response) => {
        if (response.rowCount > 0) {
          this.setResponse(response.rows);
          this.setStatus(200);
          client.end()
        }
        this.setResponse('Parcel not available for This User');
        this.setStatus(200);
        client.end();
      })
      .catch((error) => {
        this.setResponse('server error');
        this.setStatus(204);
        client.end();
      });
  }


  /**
   *  Create Parcel delivery order
   * @param {object} data
   * @returns {object}
   */
  createOrders(data) {
    const order = data.data;
    if (data.userId === undefined) {
      this.setResponse('Please Login to continue');
      this.setStatus(423);
      return false;
    }
    if (isEmpty(order)) {
      this.setResponse('You need to supply necessary Credentials');
      this.setStatus(417);
      return false;
    }
    const orderId = (generateID(222).toString() + date.valueOf().toString());
    if (!this[validateNewOrder](order)) {
      return false;
    }
    const client = new Client(DatabaseManager.dbConnectString());
    client.connect();
    client.query(
      'INSERT INTO Parcel (orderId, userId, pName, pDesc, pPix, weight, status, sentOn, pickUpName, pickUpAddress, destName, destAddress) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);',
      [
        orderId,
        data.userId,
        order.contentName,
        order.contentDesc,
        order.contentImage,
        order.weight,
        'pending',
        moment(),
        order.pickupName,
        `${order.pickUpAddress}:==:${order.pickupCode}`,
        order.destinationName,
        `${order.destinationAddress}:==:${order.destinationcode}`
      ])
      .then((response) => {
        this.setResponse({ orderId, success: 'Parcel added successfully' });
        this.setStatus(201);
        client.end();
      })
      .catch((error) => {
        this.setResponse(error.message);
        this.setStatus(417);
        client.end();
      });
  }

  /**
   * change parcel status
   * @param {object} ids : {parcelId, userId}
   * @returns {object}
   */
  changeLocation(ids) {
    if (ids.data === undefined) {
      this.setResponse('location should be specified');
      this.setStatus(200);
      return false;
    }
    if (!validator.isAlphanumeric(ids.data)) {
      this.setResponse('location can only contain AlphaNumeric');
      this.setStatus(200);
      return false;
    }
    if (!validator.isNumeric(ids.parcelId)) {
      this.setResponse('Invalid parcel Id specified');
      this.setStatus(200);
      return false;
    }
    return DatabaseManager.query('SELECT * FROM PARCEL WHERE orderid=$1', [ids.parcelId])
      .then((response) => {
        if (response.rowCount > 0) {
          if (response.rows[0].status !== 'delivered') {
            return DatabaseManager.query('UPDATE PARCEL SET cLocation=$1 WHERE orderid=$2', [
              ids.data,
              ids.parcelId
            ])
              .then(() => {
                this.setResponse({ success: 'Parcel Current Location Updated' });
                this.setStatus(200);
                return true;
              })
              .catch((error) => {
                this.setResponse(error.message);
                this.setStatus(200);
                return true;
              });
          }
          this.setResponse('This Parcel can\'t be updated');
          this.setStatus(200);
          return true;
        }
        this.setResponse('Parcel is not available');
        this.setStatus(200);
        return true;
      })
      .catch((error) => {
        this.setResponse(`server error: ${error.message}`);
        this.setStatus(200);
        return false;
      });
  }


  /**
   * updated parcel status or destination
   * @param {object} data
   * @returns {object}
   */
  changeDestination(data) {
    if (!validator.isAlphanumeric(data.userId)) {
      this.setResponse('Invalid userId specified');
      this.setStatus(400);
      return false;
    }
    if (!validator.isNumeric(data.parcelId)) {
      this.setResponse('Invalid parcelId specified');
      this.setStatus(400);
      return false;
    }

    if (data.data.destinationName === undefined) {
      this.setResponse('Please Enter the Name of personel to deliver to');
      this.setStatus(417);
      return false;
    }
    if (data.data.destinationAddress === undefined) {
      this.setResponse('Please Enter the Delivery Address');
      this.setStatus(417);
      return false;
    }
    if (data.data.destinationCode === undefined) {
      this.setResponse('Please Enter the Delivery Area Post Code');
      this.setStatus(417);
      return false;
    }
    const client = new Client(DatabaseManager.dbConnectString());
    client.connect();
    client.query('SELECT * FROM PARCEL WHERE orderid=$1', [data.parcelId])
      .then((response) => {
        if (response.rowCount > 0) {
          if (response.rows[0].userid === data.userId) {
            if (response.rows[0].status === 'delivered') {
              this.setResponse('Sorry, this Order has already been delivered. Can\'t Change status.');
              this.setStatus(412);
              client.end();
            }
            const client = new Client(DatabaseManager.dbConnectString());
            client.connect();
            client.query('UPDATE PARCEL SET destname=$1, destaddress=$2 WHERE userid=$3 AND orderid=$4', [
              data.data.destinationName,
              `${data.data.destinationAddress}:==:${data.data.destinationCode}`,
              data.userId,
              data.parcelId
            ])
              .then(() => {
                this.setResponse('destination has been updated');
                this.setStatus(202);
                client.end();
              })
              .catch((error) => {
                this.setResponse(error.message);
                this.setStatus(417);
                client.end();
              });
          }
          this.setResponse('Unauthorized access to Parcel');
          this.setStatus(401);
          client.end();
        }
        this.setResponse('Parcel not available');
        this.setStatus(304);
        client.end();
      })
      .catch((error) => {
        this.setResponse(`server error: ${error.message}`);
        this.setStatus(406);
        client.end();
      });
  }

  /**
   * cancel parcel order from being delivered
   * @param {object} ids : {parcelId, userId}
   * @returns {object}
   */
  cancelOrders(ids) {
    if (ids.userId === undefined) {
      this.setResponse('Please Login to continue');
      this.setStatus(423);
      return false;
    }
    if (!validator.isAlphanumeric(ids.userId)) {
      this.setResponse('Invalid userId specified');
      this.setStatus(400);
      return false;
    }
    if (!validator.isNumeric(ids.parcelId)) {
      this.setResponse('Invalid parcelId specified');
      this.setStatus(400);
      return false;
    }

    const client = new Client(DatabaseManager.dbConnectString());
    client.connect();
    client.query('SELECT * FROM PARCEL WHERE orderid=$1', [ids.parcelId])
      .then((response) => {
        if (response.rowCount > 0) {
          if (response.rows[0].userid === ids.userId) {
            return DatabaseManager.query('UPDATE PARCEL SET status=$1 WHERE userid=$2 AND orderid=$3', [
              'canceled',
              ids.userId,
              ids.parcelId
            ])
              .then(() => {
                this.setResponse('Parcel canceled');
                this.setStatus(304);
                client.end();
              })
              .catch((error) => {
                this.setResponse(error);
                this.setStatus(417);
                client.end();
              });
          }
          this.setResponse('Unauthorized access to Parcel');
          this.setStatus(401);
          client.end();
        }
        this.setResponse('Parcel not available');
        this.setStatus(200);
        client.end();
      })
      .catch((error) => {
        this.setResponse(`server error: ${error.message}`);
        this.setStatus(200);
        client.end();
      });
  }


  /**
   * change parcel status
   * @param {object} ids : {parcelId, userId}
   * @returns {object}
   */
  changeStatus(ids) {
    if (ids.data === undefined) {
      this.setResponse('New Status type should be specified');
      this.setStatus(200);
      return false;
    }
    if (!validator.isAlpha(ids.data) || ids.data === 'canceled') {
      this.setResponse('Invalid status type specified');
      this.setStatus(200);
      return false;
    }
    if (!validator.isNumeric(ids.parcelId)) {
      this.setResponse('Invalid parcel Id specified');
      this.setStatus(200);
      return false;
    }
    return DatabaseManager.query('SELECT * FROM PARCEL WHERE orderid=$1', [ids.parcelId])
      .then((response) => {
        if (response.rowCount > 0) {
          if (response.rows[0].status !== 'delivered') {
            return DatabaseManager.query('UPDATE PARCEL SET status=$1 WHERE orderid=$2', [
              ids.data,
              ids.parcelId
            ])
              .then(() => {
                this.setResponse({ success: 'Parcel Status Updated' });
                this.setStatus(200);
                return true;
              })
              .catch((error) => {
                this.setResponse(error);
                this.setStatus(200);
                return true;
              });
          }
          this.setResponse('This Parcel can\'t be updated');
          this.setStatus(200);
          return true;
        }
        this.setResponse('Parcel is not available');
        this.setStatus(200);
        return true;
      })
      .catch((error) => {
        this.setResponse(`server error: ${error.message}`);
        this.setStatus(200);
        return false;
      });
  }

  /**
   * reset database
   * @returns {null}
   */
  resetDB() {
    return DatabaseManager.query(`DROP TABLE IF EXISTS users, parcel; CREATE TABLE  IF NOT EXISTS users (id SERIAL PRIMARY KEY, userId VARCHAR, username VARCHAR, fullname VARCHAR, phone Numeric, email VARCHAR  (60) UNIQUE, sex VARCHAR, password VARCHAR,registered TIMESTAMP, isAdmin Varchar );
    CREATE TABLE  IF NOT EXISTS parcel (id SERIAL PRIMARY KEY,orderId VARCHAR, userId VARCHAR, pName VARCHAR, pDesc VARCHAR, pPix Varchar, weight Numeric, weightmetric VARCHAR, status VARCHAR, cLocation VARCHAR, sentOn timestamp, deliveredOn timestamp, pickUpName VARCHAR, pickUpAddress TEXT, destName VARCHAR, destAddress TEXT);
    INSERT INTO USERS (userid, username, fullname, email, sex, password, isadmin) VALUES ('eadmin123', 'emmsdan', 'emmanuel daniel', 'ecomje@gmal.com', 'male', '$2b$10$4qzMEL9oUbH54dRsuMYNs.S9c9Lsd1KctV0/0M2Cm00MPcfGhi10u', 'admin')`)
      .then((resp) => {
        this.setResponse(resp);
        this.setStatus(200);
        return false;
      })
      .catch((error) => {
        this.setResponse(`server error: ${error.message}`);
        this.setStatus(200);
        return false;
      });
  }

  /**
   * reset database
   * @returns {null}
   */
  resetDB() {
    const client = new Client(DatabaseManager.dbConnectString());
    client.connect();
    client.query(`DROP TABLE IF EXISTS users, parcel; CREATE TABLE  IF NOT EXISTS users (id SERIAL PRIMARY KEY, userId VARCHAR, username VARCHAR, fullname VARCHAR, phone Numeric, email VARCHAR  (60) UNIQUE, sex VARCHAR, password VARCHAR,registered TIMESTAMP, isAdmin Varchar );
    CREATE TABLE  IF NOT EXISTS parcel (id SERIAL PRIMARY KEY,orderId VARCHAR, userId VARCHAR, pName VARCHAR, pDesc VARCHAR, pPix Varchar, weight Numeric, weightmetric VARCHAR, status VARCHAR, cLocation VARCHAR, sentOn timestamp, deliveredOn timestamp, pickUpName VARCHAR, pickUpAddress TEXT, destName VARCHAR, destAddress TEXT);
    INSERT INTO USERS (userid, username, fullname, email, sex, password, isadmin) VALUES ('eadmin123', 'emmsdan', 'emmanuel daniel', 'ecomje@gmal.com', 'male', 'eternity123', 'admin')`)
      .then((resp) => {
        this.setResponse(resp);
        this.setStatus(200);
        client.end();
      })
      .catch((error) => {
        this.setResponse(`server error: ${error.message}`);
        this.setStatus(200);
        client.end();
      });
  }

  /**
   * @param {object} order
   * @returns {boolean}
   */
  [validateNewOrder](order) {
    if (order.contentName === undefined) {
      this.setResponse('Please enter Content Title/Name');
      this.setStatus(200);
      return false;
    }
    if (order.contentDesc === undefined) {
      order.contentDesc = '';
    }
    if (order.contentImage === undefined) {
      order.contentImage = '';
    }
    if (order.pickupName === undefined) {
      this.setResponse('Please Enter the Name of personel to pickup Item From');
      this.setStatus(200);
      return false;
    }
    if (order.pickUpAddress === undefined) {
      this.setResponse('Please You need to enter Pickup Location');
      this.setStatus(200);
      return false;
    }
    if (order.pickupCode === undefined) {
      this.setResponse('Please Enter the Pickup Area Post Code');
      this.setStatus(200);
      return false;
    }
    if (!validator.isNumeric((order.weight || 'n86f$%^'))) {
      this.setResponse('Please Enter valid weight');
      this.setStatus(200);
      return false;
    }
    if (order.destinationName === undefined) {
      this.setResponse('Please Enter the Name of personel to deliver to');
      this.setStatus(200);
      return false;
    }
    if (order.destinationAddress === undefined) {
      this.setResponse('Please Enter the Delivery Address');
      this.setStatus(200);
      return false;
    }
    if (order.destinationCode === undefined) {
      this.setResponse('Please Enter the Delivery Area Post Code');
      this.setStatus(200);
      return false;
    }
    return true;
  }
}

const parcelController = new ParcelOrderController();
export default parcelController;
