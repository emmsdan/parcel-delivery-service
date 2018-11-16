import express from'express';
const userRouter = express.Router();

userRouter.use (( req, res ) => {
  res.json ({'message' : 'data not found', 'status' : 404}, 404)
});

userRouter.use (( req, res ) => {
  res.json ({'message' : 'this is a bad request', 'status' : 400}, 400)
});

userRouter.use (( req, res ) => {
  res.json ({'message' : 'Bad gateway', 'status' : 502}, 502)
});

userRouter.use (( req, res ) => {
  res.json ({'message' : 'Internal Server Error', 'status' : 500}, 500)
});

module.exports = userRouter;
