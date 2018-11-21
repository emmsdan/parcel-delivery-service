import express from 'express';

const errorRouter = express.Router();

errorRouter.use((req, res) => {
  res.json({ message: 'data not found', status: 404 }, 404);
});

errorRouter.use((req, res) => {
  res.json({ message: 'this is a bad request', status: 400 }, 400);
});

errorRouter.use((req, res) => {
  res.json({ message: 'Bad gateway', status: 502 }, 502);
});

errorRouter.use((req, res) => {
  res.json({ message: 'Internal Server Error', status: 500 }, 500);
});

export default errorRouter;
