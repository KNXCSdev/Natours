const express = require('express');

const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

const qs = require('qs');

const { default: rateLimit } = require('express-rate-limit');
const { default: helmet } = require('helmet');
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
/* eslint-disable no-undef */

//1) MIDDLEWARES SECTION

app.use(helmet());

// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://js.stripe.com',
];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = [
  'https://unpkg.com',
  'https://tile.openstreetmap.org',
  'ws://127.0.0.1:1234',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

//set security http headers
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // ✅ avoids fallback to 'none'
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", 'https://js.stripe.com', ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
      frameSrc: ["'self'", 'https://js.stripe.com'], // ✅ allow Stripe iframe
    },
  }),
);

app.set('view engine', 'pug'); // SET VIEW ENGINE TO PUG
app.set('views', `${__dirname}/views`); // SET VIEWS DIRECTORY

//SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

//SETTING THE MONGOOSE QUERY PARSER TO CONVERT OBJECT
app.set('query parser', (str) => qs.parse(str));

//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//BODY PARSER, READING DATA FROM BODY INTO REQ.BODY
//limit data to 10kb
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

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
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//IT ONLY EXECUTES WHEN ROUTES DONT MATCH ^
app.all('/{*any}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // IT IMMEDIATLY PASSES TO ERROR HANDLING MIDDLEWARE BECAUSE NEXT HAS ARGUMENT INSIDE
});

app.use(globalErrorHandler);

module.exports = app;
