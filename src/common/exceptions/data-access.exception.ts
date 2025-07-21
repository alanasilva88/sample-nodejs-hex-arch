export class DataAccessException extends Error {
    constructor(message: string, public readonly originalError?: any) {
      super(message);
      this.name = 'DataAccessException';
      if (originalError) {
        this.stack = originalError.stack;
      }
    }
  }