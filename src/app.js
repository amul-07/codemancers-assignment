import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import routes from './apis/routes/index.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './utils/errorHandler.js';
import { STATUS } from './utils/constants.js';

const app = express();

//GLOBAL MIDDLEWARES

//Setting Security HTTP Headers
app.use(helmet());

// Logging in Development Mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Limiting no. of request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from same IP, try again later!'
});
app.use('/api', limiter);

// Body Parser
app.use(express.json({ limit: '5000kb' }));

//Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss());

/** Routes go here */
app.use('/api/v1', routes);

/** Handling Unknown Routes */
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, STATUS.NOT_FOUND));
});

app.use(globalErrorHandler);

export default app;
