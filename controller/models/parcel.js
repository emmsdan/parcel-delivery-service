import {inArray, removeArray, generateID} from '../helpers/helper';

class ParcelOrder {
  constructor (parcels) {
    this.parcels = parcels;
  }
  setStatus (statusCode) {
    this.statusCode = statusCode;
  }
  status () {
    return this.statusCode;
  }
  getParcels () {
    if (this.parcels.length === 0) {
      this.setStatus(404)
      return {'message': 'Parcel not available'};
    }
    this.setStatus(200)
    return (this.parcels);
  }

  getSingleParcel (id) {
    return inArray(this.parcels, 'id', id);
  }

  getUserParcels (userid) {
    const parcel = this.parcels.find( parcels => parcels.userid == userid);
    if(parcel){
      this.setStatus(200)
      return parcel;
    }else{
      this.setStatus(404)
      return {'message':'Parcel not available for This User'};
    }
  }

  removeParcel (parcelId) {
    const deleteOrder= this.parcels.find(p => p.id === parseInt(parcelId))
    if (!deleteOrder){
      this.setStatus(404)
      return {'message' : 'The Order, you are looking for, does not exist'};
    } else {
      this.setStatus(410)
      this.parcels.splice(this.parcels.indexOf(deleteOrder), 1)
      return {'message': 'This Order has been deleted'};
    }
  }

  createOrder (order) {
    let orderId = generateID(999);
    if (this.orderExist(orderId)){
      orderId = (this.parcels - 1) + (orderId * 2);
    }
    console.log (order)
    if (order.userId === undefined){
      return {'message' : 'UserId not specified: Order Must belong to a User'};
    }
    if (order.content === undefined || order.pickup === undefined || order.pickupcode === undefined || order.destination === undefined || order.destinationcode === undefined || order.weight === undefined){
      return {'message' : 'Order Details can\'t be empty'};
    }

    this.parcels.push ({
      userid: order.userId,
      id: orderId,
      content: order.content,
      pickup: order.pickup,
      pickupcode: order.pickupcode,
      destination: order.destination,
      destinationcode: order.destinationcode,
      weight: order.weight,
      status : 'pending'
    });
    this.setStatus (201);
    return {'message' : 'new order created'}
  }
  updateParcel (id, field, value = null){
    if (value !== null){
      this.getSingleParcel(id).field = value;
      return {'message': 'status has been updated'};
    }
    const parcel = this.getSingleParcel (id);
    parcel.destination = field.destination;
    parcel.destinationcode = field.destinationcode;
    return {'message': 'destination has been updated'};
  }
  cancelParcel (id){
    const parcel = this.getSingleParcel (id);
    if (typeof parcel === 'object'){
      if (parcel.status === 'transit' && parcel.status === 'delivered'){
        return {'message' : `This parcel cannot be canceled, Its status is ${parcel.status}`}
      }
      parcel.status = 'canceled';
      return {'message': 'This parcel has be canceled'};
    }
    return {'message': 'parcel not found'}
  }
  orderExist (id) {
    try {
      if(this.parcels.find( parcels => parcels.userid == id)){
        return true;
      }
      return false;
    }catch(err){
      return false;
    }
  }
}

export default ParcelOrder