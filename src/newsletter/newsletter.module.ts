import { Module } from '@nestjs/common';
import { NewsletterController } from './interface/controllers/newsletter.controller';
import { FirestoreNewsletterRepository } from './infrastructure/firestore/newsletter.repository.adapter';
import { CreateNewsletterUseCase } from './application/use-cases/create-newsletter.use-case';
import { FirebaseModule } from '../firebase/firebase.module';
import { NEWSLETTER_REPOSITORY } from './domain/ports/newsletter.repository.port';

@Module({
  imports: [FirebaseModule],
  controllers: [NewsletterController],
  providers: [
    {
      provide: NEWSLETTER_REPOSITORY,
      useClass: FirestoreNewsletterRepository,
    },
    CreateNewsletterUseCase,
  ],
})
export class NewsletterModule {}
