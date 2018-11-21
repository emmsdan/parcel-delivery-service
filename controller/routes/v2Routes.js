import express from'express';
import bodyParser from 'body-parser';

import v2User from '../models/v2User';
import v2Parcel from '../models/v2Parcel';

const routers = express.Router();


/**
 * API Documentation
 */
routers.get('/',  ( req, res ) => {
  res.send('<h1> Welcome to SendIT Official Documentation, website');
})

/**
 * API: create new user account
 * @access :POST /api/v2/auth/signup
 */
routers.post('/auth/signup',  ( req, res ) => {
  v2User.registerUser(req.body, res);
})

/**
 * API: login user to account
 * @access :POST /api/v2/auth/login
 */
routers.post('/auth/login',  ( req, res ) => {
  v2User.loginUser(req.body, res);
})

/** parcel processing */

/**
 * API: Access parcel delivery order by a specific user
 * @access :GET /api/v2/users/[:userId]/parcels
 */
routers.get('/users/:userId/parcels',  ( req, res ) => {
  v2Parcel.getUsersOrder(req.params.userId);
  res.json (v2Parcel.response()).status(v2Parcel.status());
})

/**
 * API: Access to a specific delivery order
 * @access :GET /api/v2/parcels/[:parcelId]
 */
routers.get('/parcels/:parcelId',  ( req, res ) => {
  v2Parcel.getSpecificOrder(req.params.parcelId);
  res.json (v2Parcel.response()).status(v2Parcel.status());
})

/**
 * API: Access all parcel delivery orders
 * @access :GET /api/v2/parcels
 */
routers.get('/parcels',  ( req, res ) => {
  v2Parcel.orders();
  res.json (v2Parcel.response()).status(v2Parcel.status());
})

/**
 * API: Create a parcel delivery order.
 * @access :POST /api/v2/parcels
 */
routers.post('/parcels',  ( req, res ) => {
  v2Parcel.createOrders({
    'data' : req.body,
    'userId' : v2User.userId() || null
  });
  res.json (v2Parcel.response()).status(v2Parcel.status());
})

/**
 * API: Cancel the specific parcel delivery order
 * @access :PUT /api/v2/parcels/[:parcelId]/cancel
 */
routers.put('/parcels/:parcelId/cancel',  ( req, res ) => {
  v2Parcel.cancelOrders({
    'parcelId' : req.params.parcelId,
    'userId' : v2User.userId() || null
  });
  res.json (v2Parcel.response()).status(v2Parcel.status());
})

/**
 * API: Cancel the specific parcel delivery order
 * @access :PATCH /api/v2/parcels/[:parcelId]/cancel
 */
routers.patch('/parcels/:parcelId/cancel',  ( req, res ) => {
  v2Parcel.cancelOrders({
    'parcelId' : req.params.parcelId,
    'userId' : v2User.userId()  || null
  });
  res.json (v2Parcel.response()).status(v2Parcel.status());
})

/**
 * API: Change the location of a specific parcel delivery order
 * @access :PUT /api/v2/parcels/[:parcelId]/destination
 */
routers.put('/parcels/:parcelId/destination',  ( req, res ) => {
  v2Parcel.changeDestination({
    'parcelId' : req.params.parcelId,
    'userId' : v2User.userId() || null,
    'data' : req.body
  });
  res.json (v2Parcel.response()).status(v2Parcel.status());
})

/**
 * API: Change the status of a specific parcel delivery order
 * @access :PUT /api/v2/parcels/[:parcelId]/status
 */
routers.put('/parcels/:parcelId/status',  ( req, res ) => {
  v2Parcel.changeStatus({
    'parcelId' : req.params.parcelId,
    'userId' : v2User.role() || null,
    'data' : req.body.pStatus
  });
  res.json (v2Parcel.response()).status(v2Parcel.status());
})

/**
 * API: Change the present location of a specific parcel delivery order
 * @access :PUT /api/v2/parcels/[:parcelId]/presentLocation
 */
routers.put('/parcels/:parcelId/presentLocation',  ( req, res ) => {
  v2Parcel.changeLocation({
    'parcelId' : req.params.parcelId,
    'userId' : v2User.role() || null,
    'data' : req.body.presentLocation
  });
  res.json (v2Parcel.response()).status(v2Parcel.status());
})

/**
 * API: Change the present location of a specific parcel delivery order
 * @access :PATCH /api/v2/parcels/[:parcelId]/currentlocation
 */
routers.patch('/parcels/:parcelId/currentlocation',  ( req, res ) => {
  v2Parcel.changeLocation({
    'parcelId' : req.params.parcelId,
    'userId' : v2User.role() || null,
    'data' : req.body.presentLocation
  });
  res.json (v2Parcel.response()).status(v2Parcel.status());
})

module.exports = routers;