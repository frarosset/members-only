class CustomUnauthenticatedError extends Error {
  constructor(message, partial = "") {
    super(message);
    this.statusCode = 401;
    // So the error is neat when stringified. NotFoundError: message instead of Error: message
    this.name = "Unauthorized";
    this.partial = partial;
  }
}

module.exports = CustomUnauthenticatedError;
