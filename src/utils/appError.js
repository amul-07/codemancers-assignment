// import logging from './logging.js';
import { STATUSMESSAGE } from './constants.js';
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = STATUSMESSAGE[statusCode];
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);

        // logging.error(message);
    }
}

export default AppError;
