import validator from 'validator';
import moment from 'moment';
import { Client } from 'pg';

import { generateID, isEmpty } from '../helpers/helper';
import ResponseController from './ResponseController';
import DatabaseManager from '../db_manager/DatabaseManager';

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
   * @param {object} res
   * @returns {object}
   */
  getOrders(res) {
    const client = new Client(DatabaseManager.dbConnectString());
    client.connect();
    return client.query('SELECT * FROM PARCEL')
      .then((response) => {
        if (response.rowCount > 0) {
          this.setResponse(response.rows);
          this.setStatus(200);
          this.endResponse(client, res);
          return true;
        }
        this.setResponse('Parcel not available');
        this.setStatus(200);
        this.endResponse(client, res);
      })
      .catch((error) => {
        console.log (error, 'spop');
        this.setResponse(error.message);
        this.setStatus(204);
        this.endResponse(client, res);
      });
  }

  endResponse(client, res) {
    client.end();
    res.json(this.response()).status(this.status());
  }

  /**
   *
   * @param {string} id
   * @param {any} log :optioal
   * @returns {boolean};
   */
  validateID(id, log = null) {
    if (id === undefined && log !== null) {
      this.setResponse('Please Login to continue');
      this.setStatus(423);
      return false;
    }
    if (!validator.isAlphanumeric(id) || id === undefined) {
      this.setResponse('Invalid ID specified');
      this.setStatus(400);
      return false;
    }
    return true;
  }

  /**
   *  get a Specific parcel
   * @param {number} id
   * @returns {array}
   */
  getSpecificOrder(id) {
    if (!this.validateID(id)) return false;
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
        this.setResponse(error.message);
        this.setStatus(204);
        client.end();
      });
  }

  /**
   *  Get Specific order relating a User
   * @param {string/number} userid
   * @returns {array/object}
   */
  getUsersOrder(userid, res) {
    if (!this.validateID(userid)) {
      res.json(this.response()).status(this.status());
      return false;
    }
    const client = new Client(DatabaseManager.dbConnectString());
    client.connect();
    client.query('SELECT * FROM PARCEL WHERE userid=$1', [userid])
      .then((response) => {
        if (response.rowCount > 0) {
          this.setResponse(response.rows);
          this.setStatus(200);
          client.end();
          res.json(this.response()).status(this.status());
        }
        this.setResponse('Parcel not available for This User');
        this.setStatus(200);
        client.end();
        res.json(this.response()).status(this.status());
      })
      .catch((error) => {
        this.setResponse(error.message);
        this.setStatus(204);
        client.end();
        res.json(this.response()).status(this.status());
      });
    return true;
  }


  /**
   *  Create Parcel delivery order
   * @param {object} data
   * @param {object} res
   * @returns {object}
   */
  createOrders(data, res) {
    const order = data.data;
    if (!this.validateID(data.userId)) {
      res.json(this.response()).status(this.status());
      return false;
    }
    if (isEmpty(order)) {
      this.setResponse('You need to supply necessary Credentials');
      this.setStatus(417);
      res.json(this.response()).status(this.status());
      return false;
    }
    const orderId = (generateID(222).toString() + date.valueOf().toString());
    if (!this[validateNewOrder](order)) {
      res.json(this.response()).status(this.status());
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
      ]
    )
      .then((response) => {
        this.setResponse({ orderId, success: 'Parcel added successfully', response });
        this.setStatus(201);
        client.end();
        res.json(this.response()).status(this.status());
      })
      .catch((error) => {
        this.setResponse(error.message);
        this.setStatus(417);
        client.end();
        res.json(this.response()).status(this.status());
      });
    return true;
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
    const client = new Client(DatabaseManager.dbConnectString());
    client.connect();
    client.query('SELECT * FROM PARCEL WHERE orderid=$1', [ids.parcelId])
      .then((response) => {
        if (response.rowCount > 0) {
          if (response.rows[0].status !== 'delivered') {
            const client = new Client(DatabaseManager.dbConnectString());
            client.connect();
            client.query('UPDATE PARCEL SET cLocation=$1 WHERE orderid=$2', [
              ids.data,
              ids.parcelId
            ])
              .then((resp) => {
                this.setResponse({ success: 'Parcel Current Location Updated' });
                this.setStatus(200);
                client.end();
                return true;
              })
              .catch((error) => {
                this.setResponse(error.message);
                this.setStatus(200);
                client.end();
                return true;
              });
          }
          this.setResponse('This Parcel can\'t be updated');
          this.setStatus(200);
          client.end();
          return true;
        }
        this.setResponse('Parcel is not available');
        this.setStatus(200);
        client.end();
        return true;
      })
      .catch((error) => {
        this.setResponse(`server error: ${error.message}`);
        this.setStatus(200);
        client.end();
        return false;
      });
  }


  /**
   * updated parcel status or destination
   * @param {object} data
   * @returns {object}
   */
  changeDestination(data) {
    if (!this.validateID(data.userId) || !this.validateID(data.parcelId)) return false;
    if (!this.validateDest(data)) return false;
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
              return true;
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
   * @param {object} order
   * @returns {boolean}
   */
  validateDest(order) {
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

  /**
   * cancel parcel order from being delivered
   * @param {object} ids : {parcelId, userId}
   * @returns {object}
   */
  cancelOrders(ids) {
    if (!this.validateID(ids.userId) || !this.validateID(ids.userId, 'userid') || !this.validateID(ids.parcelId)) return false;

    const client = new Client(DatabaseManager.dbConnectString());
    client.connect();
    client.query('SELECT * FROM PARCEL WHERE orderid=$1', [ids.parcelId])
      .then((response) => {
        if (response.rowCount > 0) {
          if (response.rows[0].userid === ids.userId) {
            const client = new Client(DatabaseManager.dbConnectString());
            client.connect();
            client.query('UPDATE PARCEL SET status=$1 WHERE userid=$2 AND orderid=$3', ['canceled', ids.userId, ids.parcelId])
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
    if (!this.validateID(ids.userId)) return false;
    const client = new Client(DatabaseManager.dbConnectString());
    client.connect();
    client.query('SELECT * FROM PARCEL WHERE orderid=$1', [ids.parcelId])
      .then((response) => {
        if (response.rowCount > 0) {
          if (response.rows[0].status !== 'delivered') {
            const client = new Client(DatabaseManager.dbConnectString());
            client.connect();
            client.query('UPDATE PARCEL SET status=$1 WHERE orderid=$2', [ids.data, ids.parcelId])
              .then(() => {
                this.setResponse({ success: 'Parcel Status Updated' });
                this.setStatus(200);
                client.end();
                return true;
              })
              .catch((error) => {
                this.setResponse(error);
                this.setStatus(200);
                client.end();
                return true;
              });
          }
          this.setResponse('This Parcel can\'t be updated');
          this.setStatus(200);
          client.end();
          return true;
        }
        this.setResponse('Parcel is not available');
        this.setStatus(200);
        client.end();
        return true;
      })
      .catch((error) => {
        this.setResponse(`server error: ${error.message}`);
        this.setStatus(200);
        client.end();
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
