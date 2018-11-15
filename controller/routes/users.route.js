import express from'express';
import bodyParser from 'body-parser';
const userRouter = express.Router();
import userDb from '../models/users.model'

// get user profile.
userRouter.post('/create',  ( req, res ) => {
  res.json (userDb.createUser(req.body));
})

// get user parcels
userRouter.get('/:userId/parcels', ( req, res ) => {
  res.json(userDb.getUserParcels(req.params.userId));
});


module.exports = userRouter;
