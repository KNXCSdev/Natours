const mongoose = require('mongoose');
const dotenv = require('dotenv');

/* eslint-disable no-undef */
process.on('uncaughtException', () => {
  console.error('UNCAUGHT EXCEPTION! 💥 SHUTTING DOWN...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
  6;
});

process.on('unhandledRejection', () => {
  console.error('UNHANDLED REJECTION! 💥 SHUTTING DOWN...');
  server.close(() => {
    process.exit(1);
  });
});
