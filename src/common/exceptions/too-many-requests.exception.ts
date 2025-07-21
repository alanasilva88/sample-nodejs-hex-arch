//This will come in handy when we are using a rate limiter to limiter the  number of request for users, based on their ip
import { HttpException, HttpStatus } from "@nestjs/common";

export class TooManyRequestsException extends HttpException {
  constructor(message = "Requisições em excesso") {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
