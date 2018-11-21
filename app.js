import express from 'express';
import bodyParser from 'body-parser';

import userRouter from  './server/routes/users'
import parcelRouter from  './server/routes/parcel'
import errorRouter from  './server/routes/error'

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
app.use ('/api/v1/parcels', parcelRouter);

// handles error pages like 404
app.use ('*', errorRouter);

const server = app.listen(port, () => console.log(`App server is listening on port ${port}!`))

process.on('exit', () => server.close())
process.on('SIGTERM', () => server.close())
process.on('uncaughtException', () => server.close())

export default app;