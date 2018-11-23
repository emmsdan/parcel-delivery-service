import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import UserController from '../controller/UserController';
import ParcelOrderController from '../controller/ParcelOrderController';
import AuthTokenController from '../controller/AuthTokenController';

const defaultRouters = express.Router();


/**
 * API Documentation
 * in dev mode start server with "nodemon --exec babel-node app.js"
 */

defaultRouters.use(cookieParser());

defaultRouters.use(bodyParser.urlencoded({ extended: false }));

defaultRouters.get('/',  (req, res) => {
  res.send('<h1> Welcome to SendIT Official Documentation, website');
});

/**
 * API: create new user account
 * @access :POST /api/v1/auth/signup
 */
defaultRouters.post('/auth/signup',  (req, res) => {
  UserController.registerUser(req.body);
  if (UserController.header()) {
    res.cookie('x-token', UserController.header());
  }
  res.json(UserController.response()).status(UserController.status());
});

/**
 * API: login user to account
 * @access :POST /api/v1/auth/login
 */
defaultRouters.post('/auth/login',  (req, res) => {
  UserController.loginUser(req.body);
  if (UserController.header()) {
    res.cookie('x-token', UserController.header());
  }
  res.json(UserController.response()).status(UserController.status());
});

/**
 * API: log user out
 * @access :GET /api/v1/auth/logout
 */
defaultRouters.get('/auth/logout', (req, res) => {
  res.cookie('x-token', '', { expire: new Date() - (9999 * 260) });
  console.log (req.cookies['x-token'], 'no cookie');
  //ParcelOrderController.orders();
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});


/** parcel processing */

/**
 * API: Access parcel delivery order by a specific user
 * @access :GET /api/v1/users/[:userId]/parcels
 */
defaultRouters.get('/users/:userId/parcels',  (req, res) => {
  const token = AuthTokenController.decodeToken(req.cookies['x-token']);
  if (!token || (token.role === 'user' && token.userId !== req.params.userId)) {
    res.json({ error: 'Unauthoerized' }).status(401);
    return;
  }
  ParcelOrderController.getUsersOrder(req.params.userId);
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Access to a specific delivery order
 * @access :GET /api/v1/parcels/[:parcelId]
 */
defaultRouters.get('/parcels/:parcelId', (req, res) => {
  const token = AuthTokenController.decodeToken(req.cookies['x-token']);
  if (!token || token.role === 'user') {
    res.json({ error: 'Unauthoerized' }).status(401);
    return;
  }
  ParcelOrderController.getSpecificOrder(req.params.parcelId);
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Access all parcel delivery orders
 * @access :GET /api/v1/parcels
 */
defaultRouters.get('/parcels', (req, res) => {
  const token = AuthTokenController.decodeToken(req.cookies['x-token']);
  if (!token || token.role === 'user') {
    res.json({ error: 'Unauthoerized' }).status(401);
    return;
  }
  ParcelOrderController.getOrders();
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Create a parcel delivery order.
 * @access :POST /api/v1/parcels
 */
defaultRouters.post('/parcels', (req, res) => {
  const token = AuthTokenController.decodeToken(req.cookies['x-token']);
  if (!token) {
    res.json({ error: 'Unauthoerized' }).status(401);
    return;
  }

  ParcelOrderController.createOrders({
    data: req.body,
    userId: token.userId
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Cancel the specific parcel delivery order
 * @access :PUT /api/v1/parcels/[:parcelId]/cancel
 */
defaultRouters.put('/parcels/:parcelId/cancel',  (req, res) => {
  const token = AuthTokenController.decodeToken(req.cookies['x-token']);
  if (!token) {
    res.json({ error: 'Unauthoerized' }).status(401);
    return;
  }
  ParcelOrderController.cancelOrders({
    parcelId: req.params.parcelId,
    userId: token.userId
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Cancel the specific parcel delivery order
 * @access :PATCH /api/v1/parcels/[:parcelId]/cancel
 */
defaultRouters.patch('/parcels/:parcelId/cancel',  (req, res) => {
  const token = AuthTokenController.decodeToken(req.cookies['x-token']);
  if (!token) {
    res.json({ error: 'Unauthoerized' }).status(401);
    return;
  }
  ParcelOrderController.cancelOrders({
    parcelId: req.params.parcelId,
    userId: token.userId
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Change the location of a specific parcel delivery order
 * @access :PUT /api/v1/parcels/[:parcelId]/destination
 */
defaultRouters.put('/parcels/:parcelId/destination', (req, res) => {
  const token = AuthTokenController.decodeToken(req.cookies['x-token']);
  if (!token || (token.role !== 'user' || token.userId === undefined)) {
    res.json({ error: 'Unauthoerized' }).status(401);
    return;
  }
  ParcelOrderController.changeDestination({
    parcelId: req.params.parcelId,
    userId: token.userId,
    data: req.body
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Change the status of a specific parcel delivery order
 * @access :PUT /api/v1/parcels/[:parcelId]/status
 */
defaultRouters.put('/parcels/:parcelId/status',  (req, res) => {
  const token = AuthTokenController.decodeToken(req.cookies['x-token']);
  if (!token || token.role === 'user') {
    res.json({ error: 'Unauthoerized' }).status(401);
    return;
  }
  ParcelOrderController.changeStatus({
    parcelId: req.params.parcelId,
    data: req.body.pStatus
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Change the present location of a specific parcel delivery order
 * @access :PUT /api/v1/parcels/[:parcelId]/presentLocation
 */
defaultRouters.put('/parcels/:parcelId/presentLocation',  (req, res) => {
  ParcelOrderController.changeLocation({
    parcelId: req.params.parcelId,
    userId: UserController.role() || null,
    data: req.body.presentLocation
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Change the present location of a specific parcel delivery order
 * @access :PATCH /api/v1/parcels/[:parcelId]/currentlocation
 */
defaultRouters.patch('/parcels/:parcelId/currentlocation',  (req, res) => {
  ParcelOrderController.changeLocation({
    parcelId: req.params.parcelId,
    userId: UserController.role() || null,
    data: req.body.presentLocation
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

export default defaultRouters;
