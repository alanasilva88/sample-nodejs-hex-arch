import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { CommonUtilsModule } from "./common/common-utils.module";
import { FirebaseModule } from "./firebase/firebase.module";
import { OpenAiModule } from "./openai/openai.module";
import { ConfigModule } from "@nestjs/config";
import { NewsletterModule } from "./newsletter/newsletter.module";
import { HealthModule } from "./health/health.module";

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,    // Janela de 60 segundos (1 minuto)
        limit: 100, // Permitir até 100 requisições por IP por minuto
      },
    ]),
    FirebaseModule,
    OpenAiModule,
    CommonUtilsModule,
    NewsletterModule,
    HealthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
