import express from 'express';
import bodyParser from 'body-parser';

import defaultRouter from './server/routes/defaultRoute';
import errorRouter from './server/routes/errorRoute';
import DatabaseManager from './server/db_manager/DatabaseManager';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));


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
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App server is listening on port ${port}!`);
});


process.on('exit', () => server.close());
process.on('SIGTERM', () => server.close());
process.on('uncaughtException', () => server.close());

export default app;
