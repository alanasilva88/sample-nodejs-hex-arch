import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeUtil {
  private static readonly CODE_LENGTH = 6;
  private static readonly CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  /**
   * Gera um código alfanumérico de 6 dígitos com letras maiúsculas e números.
   * Exemplo: W1YCR3
   */
  static generateCode(): string {
    let code = '';
    for (let i = 0; i < this.CODE_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * this.CHARACTERS.length);
      code += this.CHARACTERS[randomIndex];
    }
    return code;
  }
}
