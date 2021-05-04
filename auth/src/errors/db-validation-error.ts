import { CustomError } from './custom-error';

export class DbValidationError extends CustomError {
  statusCode = 500;
  reason = 'Error connection to Db!';
  constructor() {
    super('Db Error oh no :(');

    Object.setPrototypeOf(this, DbValidationError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
