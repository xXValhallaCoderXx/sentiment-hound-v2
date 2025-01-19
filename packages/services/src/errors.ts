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


export enum ResourceCreateErrorCodes {
  TASK_CREATE = "CREATING_TASK_ERROR",
}

export const isCustomError = (
  error: unknown
): error is { friendlyMessage: string } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "friendlyMessage" in error &&
    typeof (error as any).friendlyMessage === "string"
  );
};

export class ResourceCreateError extends Error {
  constructor(
    public code: ResourceCreateErrorCodes,
    /**
     * A user-friendly, human-readable message you can pass back to the consumer.
     * E.g., "We couldn't create your task. Please try again."
     */
    public friendlyMessage: string,

    /**
     * The original error or any debugging info you want to include/log
     */
    public originalError?: unknown
  ) {
    // For the base Error message, you can choose whichever you prefer.
    // Usually, you'd either use the `friendlyMessage` or
    // a combination of code + friendlyMessage for the primary `message` property.
    super(friendlyMessage);

    // Assign the custom name for stack traces, etc.
    this.name = "ResourceCreateError";

    // (Optional) preserve the prototype chain in TS
    Object.setPrototypeOf(this, ResourceCreateError.prototype);

    // (Optional) If Node 16.9+ you can also do:
    // this.cause = originalError;
  }
}