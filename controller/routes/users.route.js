import express from'express';
const userRouter = express.Router();

// get user profile.
userRouter.get('/',  ( req, res ) => {

})

// get user parcels
userRouter.get('/:userId/parcels', ( req, res ) => {

});

module.exports = userRouter;
