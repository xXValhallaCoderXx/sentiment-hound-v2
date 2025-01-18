export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}


export class DatabaseError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
