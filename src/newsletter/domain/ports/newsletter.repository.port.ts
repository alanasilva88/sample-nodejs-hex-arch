import { Newsletter } from '../models/newsletter.entity';

export interface NewsletterRepositoryPort {
  save(newsletter: Newsletter): Promise<void>;
}
