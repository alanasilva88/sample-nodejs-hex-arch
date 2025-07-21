export class ServiceException extends Error {
  constructor(
    message: string,
    public readonly originalError?: any
  ) {
    super(message);
    this.name = "ServiceException";
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}
