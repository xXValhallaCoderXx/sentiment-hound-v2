export class IntegrationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "IntegrationError";
  }
}

export class IntegrationNotFoundError extends IntegrationError {
  constructor(id: string | number) {
    super(`Integration with ID ${id} not found`, "INTEGRATION_NOT_FOUND", 404);
  }
}

export class IntegrationValidationError extends IntegrationError {
  constructor(message: string) {
    super(message, "INTEGRATION_VALIDATION_ERROR", 400);
  }
}

export class IntegrationAuthenticationError extends IntegrationError {
  constructor(message: string) {
    super(message, "INTEGRATION_AUTH_ERROR", 401);
  }
}
