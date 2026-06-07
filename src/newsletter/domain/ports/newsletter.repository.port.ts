import { Newsletter } from '../models/newsletter.entity';

export const NEWSLETTER_REPOSITORY = 'NewsletterRepository';

export interface NewsletterRepositoryPort {
  save(newsletter: Newsletter): Promise<void>;
}
