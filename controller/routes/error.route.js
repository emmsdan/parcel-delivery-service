import express from'express';
const userRouter = express.Router();

userRouter.use (( req, res ) => {
  res.json ({'message' : '404'}, 404)
});

module.exports = userRouter;
