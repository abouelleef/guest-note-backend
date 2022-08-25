import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import AppError from './utils/appError';
import globalErrorHandler from './middlewares/errorHandler.middleware';
import indexRouter from './routes';
import { corsOptions } from './config/corsOptions';

const app = express();

// GLOBAL MIDDLEWARES
app.use(cors(corsOptions)); // Access-Control-Allow-Origin

app.use(helmet()); // Set security HTTP headers
app.use(helmet.xssFilter()); // XSS-Protection

app.use((req, res, next) => {
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

// Development logging
if (process.env.NODE_ENV === 'development') {
    console.log('Start Development');
    app.use(morgan('dev'));
} else {
    console.log('Strat Production');
}

// Limit requests from the same API
const limiter = rateLimit({
    max: process.env.NODE_ENV === 'development' ? 1000000 : 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);


// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '50mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Parse Cookie
app.use(cookieParser());



// For allowing access to static files
app.use(express.static(`public`));


//  ROUTES
app.use('/api/v1', indexRouter);

// Global route
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// GLOBAL ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandler);

export default app;
