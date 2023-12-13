interface IErrorHandler {
  statusCode: number;
  message: string;
}
/* The ErrorHandler class is a TypeScript class that extends the Error class and implements the
IErrorHandler interface, providing a custom error handling mechanism with an associated HTTP status
code. */

class ErrorHandler extends Error implements IErrorHandler {
  private _statusCode: number;
  message!: string;

  constructor(message: string = "", statusCode: number) {
    super(message);
    if (statusCode < 100 || statusCode > 599) {
      throw new Error("Invalid HTTP status code");
    }
    this._statusCode = statusCode;

    this.stack = new Error().stack;
  }

  get statusCode(): number {
    return this._statusCode;
  }

  set statusCode(value: number) {
    this._statusCode = value;
  }
}

export default ErrorHandler;
