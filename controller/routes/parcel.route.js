import express from'express';
import parcelOrder from '../models/parcel.model';
import bodyParser from 'body-parser';

const parcelRouter = express.Router();
const parcels = new parcelOrder([
  {
    userid : 3232,
    id : 123,
    content: "iPhone 8+",
    pickup: "Ojota Bus stop",
    destination: "Anthony Bus Stop",
    currentLocation: "K2",
    weight: 322,
    status: "pending"
  },
  {
    userid : 3232,
    id : 1234,
    content: "iPhone 8+",
    pickup: "Ojota Bus stop",
    destination: "Anthony Bus Stop",
    currentLocation: "K2",
    weight: 322,
    status: "pending"
  }
]);

// get all parcels.
parcelRouter.get('/',  ( req, res ) => {
  res.json(parcels.getParcels());
})

// get single parcel
parcelRouter.get('/:parcelID', ( req, res ) => {
  res.json(parcels .getSingleParcel (req.params.parcelID));
})

// cancel parcel
parcelRouter.get('/:parcelID/cancel', ( req, res ) => {
  res.json(parcels.removeParcel(req.params.parcelID))
})

// create parcel
parcelRouter.post('/', ( req, res ) => {
  res.json (parcels.createOrder(req.body))
})

// update parcel
parcelRouter.post('/update', ( req, res ) => {

})

module.exports = parcelRouter;
