class CustomConflictError extends Error {
  constructor(message, partial = "") {
    super(message);
    this.statusCode = 409;
    // So the error is neat when stringified. ConflictError: message instead of Error: message
    this.name = "ConflictError";
    this.partial = partial;
  }
}

module.exports = CustomConflictError;
