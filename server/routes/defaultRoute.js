import express from 'express';

import UserController from '../controller/UserController';
import ParcelOrderController from '../controller/ParcelOrderController';

import DatabaseManager from '../db_manager/DatabaseManager';

const defaultRouters = express.Router();


/**
 * API Documentation
 */
defaultRouters.get('/', (req, res) => {
  res.send('<h1> Welcome to SendIT Official Documentation, website');
});

/**
 * API: create new user account
 * @access :POST /api/v2/auth/signup
 */
defaultRouters.post('/auth/signup', (req, res) => {
  UserController.registerUser(req.body);
  res.json(UserController.response()).status(UserController.status());
});

/**
 * API: login user to account
 * @access :POST /api/v2/auth/login
 */
defaultRouters.post('/auth/login', (req, res) => {
  UserController.loginUser(req.body);
  res.json(UserController.response()).status(UserController.status());
});

/** parcel processing */

/**
 * API: Access parcel delivery order by a specific user
 * @access :GET /api/v2/users/[:userId]/parcels
 */
defaultRouters.get('/users/:userId/parcels', (req, res) => {
  ParcelOrderController.getUsersOrder(req.params.userId);
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Access to a specific delivery order
 * @access :GET /api/v2/parcels/[:parcelId]
 */
defaultRouters.get('/parcels/:parcelId', (req, res) => {
  ParcelOrderController.getSpecificOrder(req.params.parcelId);
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Access all parcel delivery orders
 * @access :GET /api/v2/parcels
 */
defaultRouters.get('/parcels', (req, res) => {
  ParcelOrderController.orders();
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Create a parcel delivery order.
 * @access :POST /api/v2/parcels
 */
defaultRouters.post('/parcels', (req, res) => {
  ParcelOrderController.createOrders({
    data: req.body,
    userId: UserController.userId() || null
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Cancel the specific parcel delivery order
 * @access :PUT /api/v2/parcels/[:parcelId]/cancel
 */
defaultRouters.put('/parcels/:parcelId/cancel', (req, res) => {
  ParcelOrderController.cancelOrders({
    parcelId: req.params.parcelId,
    userId: UserController.userId() || null
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Cancel the specific parcel delivery order
 * @access :PATCH /api/v2/parcels/[:parcelId]/cancel
 */
defaultRouters.patch('/parcels/:parcelId/cancel', (req, res) => {
  ParcelOrderController.cancelOrders({
    parcelId: req.params.parcelId,
    userId: UserController.userId() || null
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Change the location of a specific parcel delivery order
 * @access :PUT /api/v2/parcels/[:parcelId]/destination
 */
defaultRouters.put('/parcels/:parcelId/destination', (req, res) => {
  ParcelOrderController.changeDestination({
    parcelId: req.params.parcelId,
    userId: UserController.userId() || null,
    data: req.body
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Change the status of a specific parcel delivery order
 * @access :PUT /api/v2/parcels/[:parcelId]/status
 */
defaultRouters.put('/parcels/:parcelId/status', (req, res) => {
  ParcelOrderController.changeStatus({
    parcelId: req.params.parcelId,
    userId: UserController.role() || null,
    data: req.body.pStatus
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Change the present location of a specific parcel delivery order
 * @access :PUT /api/v2/parcels/[:parcelId]/presentLocation
 */
defaultRouters.put('/parcels/:parcelId/presentLocation', (req, res) => {
  ParcelOrderController.changeLocation({
    parcelId: req.params.parcelId,
    userId: UserController.role() || null,
    data: req.body.presentLocation
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

/**
 * API: Change the present location of a specific parcel delivery order
 * @access :PATCH /api/v2/parcels/[:parcelId]/currentlocation
 */
defaultRouters.patch('/parcels/:parcelId/currentlocation', (req, res) => {
  ParcelOrderController.changeLocation({
    parcelId: req.params.parcelId,
    userId: UserController.role() || null,
    data: req.body.presentLocation
  });
  res.json(ParcelOrderController.response()).status(ParcelOrderController.status());
});

export default defaultRouters;
