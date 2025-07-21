import { Module } from '@nestjs/common';
import { NewsletterController } from './interface/controllers/newsletter.controller';
import { FirestoreNewsletterRepository } from './infrastructure/firestore/newsletter.repository.adapter';
import { FirebaseAdminProvider } from '../firebase/firebaseadmin.provider';

@Module({
  controllers: [NewsletterController],
  providers: [FirestoreNewsletterRepository, FirebaseAdminProvider],
})
export class NewsletterModule {}
