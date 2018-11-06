import express from'express';
const parcelRouter = express.Router();

// get all parcels.
parcelRouter.get('/',  ( req, res ) => {

})

// get single parcel
parcelRouter.get('/:parcelID', ( req, res ) => {

})

// cancel parcel
parcelRouter.put('/:parcelID/cancel', ( req, res ) => {

})

// create parcel
parcelRouter.post('/', ( req, res ) => {

})

// update parcel
parcelRouter.post('/update', ( req, res ) => {

})

module.exports = parcelRouter;
