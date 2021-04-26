require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorController');
const remedyRouter = require('./routes/remedyRoute');

const userRouter = require('./routes/userRoutes');

const app = express();
app.use(morgan('dev'));

//setting security http headers
app.use(helmet());

//setting request limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again after an hour',
});
app.use('/api', limiter);

//body parser
app.use(express.json({ limit: '10kb' })); //for parsing body from request

//prevent malicious mongo code
app.use(mongoSanitize());

//prevent malicious html and js code from input
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: ['dateOfEntry'],
  })
);

app.use('/api/v1/remedies', remedyRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  /*   res.status(404).json({
    status: 'fail',
    message: `Can't find the requested url ${req.originalUrl}`,
  }); */

  next(new AppError(`Can't find the requested url ${req.originalUrl} `, 404));
});

// by declaring an err param in the middleware express automatically knows that it is an error handling middleware
app.use(errorController);

module.exports = app;
