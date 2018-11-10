import express from'express';
const userRouter = express.Router();
import parcels from '../models/parcel.model'

// get user profile.
userRouter.get('/',  ( req, res ) => {

})

// get user parcels
userRouter.get('/:userId/parcels', ( req, res ) => {
  res.json(parcels.getUserParcels(req.params.userId));
});

module.exports = userRouter;
