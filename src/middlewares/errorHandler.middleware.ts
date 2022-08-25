import { ErrorRequestHandler, Response } from "express";
import AppError from "../utils/appError";
import fs from "fs-extra"

const sendErrorDev = (
    err: any,
    res: Response,
) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const sendErrorProd = (err: AppError, res: Response) => {
    // Operational, trusted error:send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    // Programming or other unknown error: don't leak error details
    else {
        console.error('Error 💥💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong',
        });
    }
};


const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    fs.emptyDirSync(`${process.cwd()}\\public\\images\\temp`)
    console.log({ err });
    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    }
    sendErrorProd(err, res);
};

export default globalErrorHandler;
