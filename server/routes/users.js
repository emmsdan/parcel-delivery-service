import express from'express';
import bodyParser from 'body-parser';
const userRouter = express.Router();
import userDb from '../models/users'

// get user profile.
userRouter.post('/create',  ( req, res ) => {
  res.json (userDb.createUser(req.body)).status(userDb.status());
})

// get user parcels
userRouter.get('/:userId/parcels', ( req, res ) => {
  res.json(userDb.getUserParcels(req.params.userId));
});

// get user parcels
userRouter.get('/admin', ( req, res ) => {
  res.json(userDb.getAllUsers());
});

module.exports = userRouter;