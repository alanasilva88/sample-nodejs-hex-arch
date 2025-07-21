import { Body, Controller, Post } from '@nestjs/common';
import { NewsletterDto } from '../dto/newsletter.dto';
import { CreateNewsletterUseCase } from '../../application/use-cases/create-newsletter.use-case';
import { FirestoreNewsletterRepository } from '../../infrastructure/firestore/newsletter.repository.adapter';

@Controller('api/v1/newsletters')
export class NewsletterController {
  private createNewsletterUseCase: CreateNewsletterUseCase;

  constructor(private readonly repository: FirestoreNewsletterRepository) {
    this.createNewsletterUseCase = new CreateNewsletterUseCase(this.repository);
  }

  @Post()
  async subscribe(@Body() dto: NewsletterDto): Promise<void> {
    await this.createNewsletterUseCase.execute(dto.email);
  }
}
