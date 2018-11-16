import express from'express';
import bodyParser from 'body-parser';
import parcels from '../models/users';

const parcelRouter = express.Router();

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
  if (req.body.status){
    let resp = parcels.updateParcel(req.body.parcelID,'status', req.body.status)
  }else{
    let resp = parcels.updateParcel(req.body.parcelID,req.body)
  }
  res.json(resp)
})
module.exports = parcelRouter, parcels;
