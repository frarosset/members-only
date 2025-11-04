class CustomBadReqestError extends Error {
  constructor(message, partial = "") {
    super(message);
    this.statusCode = 400;
    // So the error is neat when stringified. ConflictError: message instead of Error: message
    this.name = "Bad Request";
    this.partial = partial;
  }
}

module.exports = CustomBadReqestError;
