export class DbValidationError extends Error {
  reason = 'Error connection to Db!';
  constructor() {
    super();

    Object.setPrototypeOf(this, DbValidationError.prototype);
  }
}
