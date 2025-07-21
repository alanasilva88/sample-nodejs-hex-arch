// common/utils/common-utils.module.ts
import { Module } from '@nestjs/common';
import { EmailUtil } from './utils/email.util';

@Module({
  providers: [EmailUtil],
  exports: [EmailUtil], // exporta para outros módulos poderem usar
})
export class CommonUtilsModule {}
