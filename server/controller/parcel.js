import { inArray, generateID } from '../helpers/helper';

/**
 * Handles Parcel Orders
 * @author EmmsDan <ecomje@gmail.com>
 */
class ParcelOrder {
  /**
   *  Assigns data to the program
   * @param {array} parcels
   */
  constructor(parcels) {
    this.parcels = parcels;
  }

  /**
   *  set response status
   * @param {number} statusCode : set response status
   */
  setStatus(statusCode) {
    this.statusCode = statusCode;
  }

  /**
   * Get response status
   * @returns {number}
   */
  status() {
    return this.statusCode;
  }

  /**
   * Get access to all the Parcels in DB
   * @returns {object}
   */
  getParcels() {
    if (this.parcels.length === 0) {
      this.setStatus(404);
      return { message: 'Parcel not available' };
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
  getUserParcels(userid) {
    const parcel = this.parcels.find(parcels => parcels.userid === userid);
    if (parcel) {
      this.setStatus(200);
      return parcel;
    }
    this.setStatus(404);
    return { message: 'Parcel not available for This User' };
  }


  /**
   *  Create Parcel delivery order
   * @param {object} order
   * @returns {object}
   */
  createOrder(order) {
    let orderId = generateID(999);
    if (this.orderExist(orderId)) {
      orderId = (this.parcels - 1) + (orderId * 2);
    }

    if (order.userId === undefined) {
      return { message: 'UserId not specified: Order Must belong to a User' };
    }
    if (order.content === undefined || order.pickup === undefined) {
      return { message: 'Order Details can\'t be empty' };
    }
    if (order.destination === undefined || order.destinationcode === undefined) {
      return { message: 'Order Details can\'t be empty' };
    }
    if (order.pickupcode === undefined || order.weight === undefined) {
      return { message: 'Order Details can\'t be empty' };
    }

    this.parcels.push({
      userid: order.userId,
      id: orderId,
      content: order.content,
      pickup: order.pickup,
      pickupcode: order.pickupcode,
      destination: order.destination,
      destinationcode: order.destinationcode,
      weight: order.weight,
      status: 'pending'
    });
    this.setStatus(201);
    return { message: 'new order created' };
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
      return { message: 'status has been updated' };
    }
    const parcel = this.getSingleParcel(id);
    parcel.destination = field.destination;
    parcel.destinationcode = field.destinationcode;
    return { message: 'destination has been updated' };
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
        return { message: `This parcel cannot be canceled, Its status is ${parcel.status}` };
      }
      parcel.status = 'canceled';
      return { message: 'This parcel has be canceled' };
    }
    return { message: 'parcel not found' };
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
}
export default ParcelOrder;
