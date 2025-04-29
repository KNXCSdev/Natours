const express = require('express');

const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

const qs = require('qs');

const { default: rateLimit } = require('express-rate-limit');
const { default: helmet } = require('helmet');
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp');

//1) MIDDLEWARES SECTION

app.use(helmet());

//SETTING THE MONGOOSE QUERY PARSER TO CONVERT OBJECT
app.set('query parser', (str) => qs.parse(str));

/* eslint-disable no-undef */ //DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//BODY PARSER, READING DATA FROM BODY INTO REQ.BODY
//limit data to 10kb
app.use(express.json({ limit: '10kb' }));

//DATA SANITIZATION AGAINTS XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'averageQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

// TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//LIMIT REQUEST FROM SAME API
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

//3) SECTION ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//IT ONLY EXECUTES WHEN ROUTES DONT MATCH ^
app.all('/{*any}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // IT IMMEDIATLY PASSES TO ERROR HANDLING MIDDLEWARE BECAUSE NEXT HAS ARGUMENT INSIDE
});

app.use(globalErrorHandler);

module.exports = app;
