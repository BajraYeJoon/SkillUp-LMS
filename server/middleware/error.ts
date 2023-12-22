import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";

interface CustomError {
  statusCode: number;
  message: string;
  name?: string;
  path?: string;
  code?: number;
  keyValue?: object;
}

const HTTP_STATUS_CODES = {
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
};

export const ErrorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  err.message = err.message || "Internal Server Error";

  //Wrong Mongoose Object ID Error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, HTTP_STATUS_CODES.BAD_REQUEST);
  }

  //Duplicate Mongoose key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue as object)} entered`;
    err = new ErrorHandler(message, HTTP_STATUS_CODES.BAD_REQUEST);
  }

  //Wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try Again!!!";
    err = new ErrorHandler(message, HTTP_STATUS_CODES.BAD_REQUEST);
  }

  //jwt expired error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is expired. Try Again!!!";
    err = new ErrorHandler(message, HTTP_STATUS_CODES.BAD_REQUEST);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
