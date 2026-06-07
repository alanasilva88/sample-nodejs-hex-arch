import { Inject } from '@nestjs/common';
import { NEWSLETTER_REPOSITORY, NewsletterRepositoryPort } from '../../domain/ports/newsletter.repository.port';
import { Newsletter } from '../../domain/models/newsletter.entity';

export class CreateNewsletterUseCase {
  constructor(
    @Inject(NEWSLETTER_REPOSITORY)
    private readonly newsletterRepository: NewsletterRepositoryPort,
  ) {}

  async execute(email: string): Promise<void> {
    const newsletter = new Newsletter(email);
    await this.newsletterRepository.save(newsletter);
  }
}
