import express from 'express';
import bodyParser from 'body-parser';

import userRouter from  './routes/users.route'
import parcelRouter from  './routes/parcel.route'
import errorRouter from  './routes/error.route'

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.get('/', (req, res) => {
  res.send(`
  <link rel='stylesheet' href='https://emmsdan.github.io/parcel-delivery-service/UI/assets/css/main.css' />
  <h2> create user </h2>
  <form action="/api/v1/users/create" method="post">
    <input name="name"> name <br>
    <input name="email"> email <br>
    <input name="phone"> phone <br>
    <input name="password"> password <br><br>
      <button type='submit'> submit </button>
  </form>
  <br/>
  <br/>
  <h2> create parcel </h2>
  <form action="/api/v1/parcel" method="post">
    <input name="userid"> userid <br>
    <input name="content"> content <br>
    <input name="pickup"> pickup <br>
    <input name="pickupcode"> pickupcode <br>
    <input name="destination"> destination <br>
    <input name="destinationcode"> destinationcode <br>
    <input name="weight"> weight <br><br>
      <button type='submit'> submit </button>
  </form>`)
})

app.use ('/api/v1/users', userRouter);
app.use ('/api/v1/parcel', parcelRouter);

// handles error pages like 404
app.use ('*', errorRouter);

app.listen(port, () => {
  console.log(`App server is listening on port ${port}!`);
})