class CustomUnauthorizedError extends Error {
  constructor(message, partial = "") {
    super(message);
    this.statusCode = 403;
    // So the error is neat when stringified. Forbidden: message instead of Error: message
    this.name = "Forbidden";
    this.partial = partial;
  }
}

module.exports = CustomUnauthorizedError;
