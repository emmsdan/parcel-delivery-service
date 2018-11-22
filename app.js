import express from 'express';
import bodyParser from 'body-parser';

import defaultRouter from './server/routes/defaultRoute';
import errorRouter from './server/routes/errorRoute';
import DatabaseManager from './server/db_manager/DatabaseManager';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
let port = process.env.PORT;
if (port == null || port === '') {
  port = 8000;
}

app.get('/', (req, res) => {
  res.json({ message: 'Please use the proper API version to access the page' });
  res.status(401);
});

app.use('/api/v1/', bodyParser.urlencoded({ extended: false }), defaultRouter);

// handles error pages like 404
app.use('*', errorRouter);

/**
 * start listen to server
 * Create need tables on server start
 */
const server = app.listen(port, () => {
  DatabaseManager.query(`CREATE TABLE  IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    userId VARCHAR,
    username VARCHAR,
    fullname VARCHAR,
    phone Numeric,
    email VARCHAR  (60) UNIQUE,
    sex VARCHAR,
    password VARCHAR,
    registered TIMESTAMP,
    isAdmin Varchar
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
    .then((response) => {
      console.log('Table Created/Exist');
    })
    .catch((error) => {
      console.log(`Error Message: ${error}`);
    });
  console.log(`App server is listening on port ${port}!`);
});


process.on('exit', () => server.close());
process.on('SIGTERM', () => server.close());
process.on('uncaughtException', () => server.close());

export default app;
