import dotenv from 'dotenv';

dotenv.config();
export const config = {
  development: {
    conString: process.env.DATABASE_URL_DEV || 'postgres://postgres:eternity123@localhost:5432/sendItDB'
  },
  test:
  {
    conString: process.env.DATABASE_URL_TEST || 'postgres://postgres:eternity123@localhost:5432/sendItDB'
  },
};
let ConnectionString;
const environment = process.env.NODE_ENV || 'development';
if (environment === 'production') ConnectionString = {
    connection: 'postgres://postgres:eternity123@localhost:5432/sendItDB', ssl: true };
else ConnectionString = config[environment].conString;
export const connection = ConnectionString;