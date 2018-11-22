import validator from 'validator';
import moment from 'moment';
import bcrypt from 'bcrypt';

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
  getParcels() {
    if (this.parcels.length === 0) {
      this.setStatus(404);
      return 'Parcel not available';
    }
    this.setStatus(200);
    return (this.parcels);
  }

  /**
   *  get a Specific parcel
   * @param {number} id
   * @returns {array}
   */
  getSingleParcel(id) {
    return inArray(this.parcels, 'id', id);
  }

  /**
   *  Get Specific order relating a User
   * @param {string/number} userid
   * @returns {array/object}
   */
  getUsersOrder(userid) {
    if (!validator.isAlphanumeric(userid)) {
      this.setResponse('Invalid userId specified');
      this.setStatus(200);
      return false;
    }
    return DatabaseManager.query('SELECT * FROM PARCEL WHERE userid=$1', [userid])
      .then((response) => {
        if (response.rowCount > 0) {
          this.setResponse(response.rows);
          this.setStatus(200);
          return true;
        }
        this.setResponse('Parcel not available for This User');
        this.setStatus(200);
        return true;
      })
      .catch((error) => {
        this.setResponse('server error');
        this.setStatus(200);
        return false;
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
      this.setStatus(200);
      return false;
    }
    if (isEmpty(order)) {
      this.setResponse('You need to supply necessary Credentials');
      this.setStatus(200);
      return false;
    }
    const orderId = (generateID(222).toString() + date.valueOf().toString());
    if (!this[validateNewOrder](order)) {
      return false;
    }
    return DatabaseManager.query(
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
        this.setStatus(200);
        return false;
      })
      .catch((error) => {
        this.setResponse(error.message);
        this.setStatus(200);
        return false;
      });
  }

  /**
   * updated parcel status or destination
   * @param {number} id
   * @param {object} field
   * @param {string} value
   * @returns {object}
   */
  updateParcel(id, field, value = null) {
    if (value !== null) {
      this.getSingleParcel(id).field = value;
      return 'status has been updated' ;
    }
    const parcel = this.getSingleParcel(id);
    parcel.destination = field.destination;
    parcel.destinationcode = field.destinationcode;
    return 'destination has been updated';
  }

  /**
   * cancel parcel order from being delivered
   * @param {number} id : parcel id
   * @returns {object}
   */
  cancelParcel(id) {
    const parcel = this.getSingleParcel(id);
    if (typeof parcel === 'object') {
      if (parcel.status === 'transit' && parcel.status === 'delivered') {
        return `This parcel cannot be canceled, Its status is ${parcel.status}` ;
      }
      parcel.status = 'canceled';
      return 'This parcel has be canceled';
    }
    return 'parcel not found';
  }

  /**
   *  Checks if parcel order exist
   * @param {number} id : parcel id
   * @returns {boolean}
   */
  orderExist(id) {
    try {
      if (this.parcels.find(parcels => parcels.userid === id)) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
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
