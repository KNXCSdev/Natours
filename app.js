const express = require('express');

const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

const qs = require('qs');

//1) MIDDLEWARES SECTION

//SETTING THE MONGOOSE QUERY PARSER TO CONVERT OBJECT
app.set('query parser', (str) => qs.parse(str));

/* eslint-disable no-undef */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); //MIDDLEWARE
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3) SECTION ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//IT ONLY EXECUTES WHEN ROUTES DONT MATCH ^
app.all('/{*any}', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // IT IMMEDIATLY PASSES TO ERROR HANDLING MIDDLEWARE BECAUSE NEXT HAS ARGUMENT INSIDE
});

app.use(globalErrorHandler);

module.exports = app;
