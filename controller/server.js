import express from 'express';
import bodyParser from 'body-parser';

import userRouter from  './routes/users'
import parcelRouter from  './routes/parcel'
import errorRouter from  './routes/error'

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.get('/', (req, res) => {
  res.json({'message': `Please use the proper API version to access the page`})
  res.status(401)
})

app.use ('/api/v1/users', userRouter);
app.use ('/api/v1/parcel', parcelRouter);

// handles error pages like 404
app.use ('*', errorRouter);

app.listen(port, () => {
  console.log(`App server is listening on port ${port}!`);
})