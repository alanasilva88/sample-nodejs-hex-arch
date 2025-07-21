import { Injectable } from '@nestjs/common';
import { NewsletterRepositoryPort } from '../../domain/ports/newsletter.repository.port';
import { Newsletter } from '../../domain/models/newsletter.entity';
import { FirebaseAdminProvider } from '../../../firebase/firebaseadmin.provider';

@Injectable()
export class FirestoreNewsletterRepository implements NewsletterRepositoryPort {

  constructor(private firebaseAdmin: FirebaseAdminProvider) { }

  async save(newsletter: Newsletter): Promise<void> {
    const db = this.firebaseAdmin.getFirestore();
    await db.collection('newsletters').add({ email: newsletter.email });
  }
}
