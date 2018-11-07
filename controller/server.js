import express from 'express';

import userRouter from  './routes/users.route'
import adminRouter from  './routes/parcel.route'
import authRouter from  './routes/authenicator.route'
import parcelRouter from  './routes/parcel.route'
import errorRouter from  './routes/error.route'

const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.json('Hello World!')
})

app.use ('/api/v1/users', userRouter);
app.use ('/api/v1/admin', adminRouter);
app.use ('/api/v1/access', authRouter);
app.use ('/api/v1/parcel', parcelRouter);

// handles error pages like 404
app.use ('*', errorRouter);

app.listen(port, () => {
  console.log(`App server is listening on port ${port}!`);
})