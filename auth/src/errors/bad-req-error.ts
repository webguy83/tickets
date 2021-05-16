import { CustomError } from './custom-error';

export class BadReqError extends CustomError {
  statusCode = 400;

  constructor(public msg: string) {
    super(msg);

    Object.setPrototypeOf(this, BadReqError.prototype);
  }

  serializeErrors() {
    return [{ message: this.msg }];
  }
}
