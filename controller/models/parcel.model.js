import {inArray, removeArray, generateID} from '../helpers/helper';

export default class parcelOrder {
  constructor (parcels) {
    this.parcels = parcels;
  }

  getParcels () {
    if (this.parcels.length === 0) {
      return 'no parcel available';
    }
  return (this.parcels);
  }

  getSingleParcel (id) {
    return inArray(this.parcels, 'id', id);
  }

  getUserParcels (userid) {
    return this.parcels.find( parcels => parcels.userid == userid);
  }

  removeParcel (parcelId) {
    const deleteOrder= this.parcels.find(p => p.id === parseInt(parcelId))
    if (!deleteOrder){
      return ('This order does not exist');
    } else {
      this.parcels.splice(this.parcels.indexOf(deleteOrder), 1)
      return ('This Order has been deleted');
    }
  }

  createOrder (order) {
    let orderId = generateID(999);
    if (this.orderExist(orderId)){
      orderId = orderId * 2;
    }

    this.parcels.push ({
      userid: order.userid,
      id: orderId,
      content: order.content,
      pickup: order.pickup,
      pickupcode: order.pickupcode,
      destination: order.destination,
      destinationcode: order.destinationcode,
      weight: order.weight
    });
  }
  updateParcel (id, field, value = null){
    if (value !== null){
      this.getSingleParcel(id).field = value;
      return 'status has been updated';
    }
    const parcel = this.getSingleParcel (id);
    parcel.destination = field.destination;
    parcel.destinationcode = field.destinationcode;
    return 'destination has been updated';
  }
  orderExist (id) {
    try {
      if(this.parcels.find( parcels => parcels.userid == id).length > 0 ){
        return true;
      }
      return false;
    }catch(err){
      return false;
    }
  }
}