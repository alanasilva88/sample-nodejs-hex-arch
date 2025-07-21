import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
  constructor(message = 'Erro interno do Servidor') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
