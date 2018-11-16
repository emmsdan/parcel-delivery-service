import express from'express';
const userRouter = express.Router();

userRouter.use (( req, res ) => {
  res.status(404).json ({
    'message' : 'page or resource not found',
    'status' : 404
  });
});

module.exports = userRouter;
