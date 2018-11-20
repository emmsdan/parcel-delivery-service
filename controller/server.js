import express from 'express';
import bodyParser from 'body-parser';
import db from './db';

import userRouter from  './routes/users'
import parcelRouter from  './routes/parcel'

import v2Routes from './routes/v2Routes'
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

/**
 * API version 1
 * can provided access to user and parcel routes
 * no authentication.
 * and data does not persist.
 */
app.use ('/api/v1/users', userRouter);
app.use ('/api/v1/parcels', parcelRouter);

/**
 * API version 2
 * provided access to user, parcel,
 * authentication and admin.
 * data are stored in postgreSQL Database.
 * using a single module called v2Routes
 * to handle all version 2 routing
 */
app.use('/api/v2/', v2Routes);
/**
 * handles error pages like 404, 500 etc
 * handled just common cases
 */
app.use ('*', errorRouter);

/**
 * start listen to server
 * Create need tables on server start
 */
const server = app.listen(port, () => {

  db.none(`CREATE TABLE  IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    userId VARCHAR,
    username VARCHAR,
    fullname VARCHAR,
    phone Numeric,
    email INTEGER,
    sex VARCHAR,
    registered TIMESTAMP,
    isAdmin Boolean
  );
  CREATE TABLE  IF NOT EXISTS parcel (
    id SERIAL PRIMARY KEY,
    userId VARCHAR,
    pName VARCHAR,
    pDesc VARCHAR,
    pPix Varchar,
    weight Numeric,
    weightmetric VARCHAR,
    status VARCHAR,
    sentOn timestamp,
    deliveredOn timestamp,
    pickUpName VARCHAR,
    pickUpAddress TEXT,
    destName VARCHAR,
    destAddress TEXT
  )`)
  .then ( (response) => {
    console.log ('Table Created/Exist')
  })
  .catch( (error) => {
    console.log (`Error Message: ${error}`)
  })
  console.log(`App server is listening on port ${port}!`)
})

process.on('exit', () => server.close())
process.on('SIGTERM', () => server.close())
process.on('uncaughtException', () => server.close())

export default app;