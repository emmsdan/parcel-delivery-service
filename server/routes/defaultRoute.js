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

defaultRouters.use((req, res, next) => {
  console.log (`requested url: '${req.url}'`);
  next();
});

defaultRouters.get('/', AuthTokenController.checkToken, (req, res) => {
  res.send('<h1> Welcome to SendIT Official Documentation, website');
});

/**
 * API: create new user account
 * @access :POST /api/v1/auth/signup
 */
defaultRouters.post('/auth/signup', AuthTokenController.checkToken, (req, res) => {
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
defaultRouters.post('/auth/login', AuthTokenController.checkToken, (req, res) => {
  UserController.loginUser(req.body);
  if (UserController.header()) {
    res.cookie('x-token', UserController.header());
    res.json(UserController.response()).status(UserController.status());
    return true;
  }
  res.json('Login Access Canceled').status(UserController.status());
});

/**
 * API: log user out
 * @access :GET /api/v1/auth/logout
 */
defaultRouters.get('/auth/logout', AuthTokenController.checkToken, (req, res) => {
  if (req.cookies['x-token'] === '') {
    res.clearCookie('x-token');
    res.json({ error: 'This User already Logged out.', status: 205 }).status(205);
    return;
  }
  res.cookie('x-token', '', { expire: new Date(Date.now() - 864e5) });
  res.clearCookie('x-token');
  res.json({ data: 'logged out, successfully', status: 200 }).status(200);
});

/** parcel processing */

/**
 * API: Access parcel delivery order by a specific user
 * @access :GET /api/v1/users/[:userId]/parcels
 */
defaultRouters.get('/users/:userId/parcels', AuthTokenController.checkToken, (req, res) => {
  const token = AuthTokenController.decodeToken(req.cookies['x-token']);
  if (!token || (token.role === 'user' && token.userId !== req.params.userId)) {
    res.json({ error: 'Unauthoerized', status: 401 }).status(401);
    return;
  }
  ParcelOrderController.getUsersOrder(req.params.userId);
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Access to a specific delivery order
 * @access :GET /api/v1/parcels/[:parcelId]
 */
defaultRouters.get('/parcels/:parcelId', AuthTokenController.adminToken, (req, res) => {
  ParcelOrderController.getSpecificOrder(req.params.parcelId);
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Access all parcel delivery orders
 * @access :GET /api/v1/parcels
 */
defaultRouters.get('/parcels', AuthTokenController.adminToken, (req, res) => {
  ParcelOrderController.getOrders(res);
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
  res.end();
});

/**
 * API: Create a parcel delivery order.
 * @access :POST /api/v1/parcels
 */
defaultRouters.post('/parcels', AuthTokenController.checkToken, (req, res) => {
  ParcelOrderController.createOrders({
    data: req.body,
    userId: AuthTokenController.decodeToken(req.cookies['x-token']).userId
  }, res);
});

/**
 * API: Cancel the specific parcel delivery order
 * @access :PUT /api/v1/parcels/[:parcelId]/cancel
 */
defaultRouters.put('/parcels/:parcelId/cancel', AuthTokenController.checkToken, (req, res) => {
  ParcelOrderController.cancelOrders({
    parcelId: req.params.parcelId,
    userId: AuthTokenController.decodeToken(req.cookies['x-token']).userId
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Change the location of a specific parcel delivery order
 * @access :PUT /api/v1/parcels/[:parcelId]/destination
 */
defaultRouters.put('/parcels/:parcelId/destination', AuthTokenController.adminToken, (req, res) => {
  ParcelOrderController.changeDestination({
    parcelId: req.params.parcelId,
    userId: AuthTokenController.decodeToken(req.cookies['x-token']).userId,
    data: req.body
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Change the status of a specific parcel delivery order
 * @access :PUT /api/v1/parcels/[:parcelId]/status
 */
defaultRouters.put('/parcels/:parcelId/status', AuthTokenController.adminToken, (req, res) => {
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
defaultRouters.put('/parcels/:parcelId/presentLocation', AuthTokenController.checkToken, (req, res) => {
  ParcelOrderController.changeLocation({
    parcelId: req.params.parcelId,
    data: req.body.presentLocation
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

defaultRouters.get('/admin/reset/:keypad', (req, res) => {
  if ((req.params.keypad !== 'eternity')) {
    res.json({ error: 'Unauthoerized', status: 401 }).status(401);
    return;
  }
  ParcelOrderController.resetDB();
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

export default defaultRouters;
