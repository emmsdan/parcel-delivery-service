import {inArray, removeArray} from '../helpers/helper';

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
    let orderDetails = {};
    for (let [key, value] of order) {
      orderDetails[key] = value ;
    }
    this.parcels.push (orderDetails);
  }
}