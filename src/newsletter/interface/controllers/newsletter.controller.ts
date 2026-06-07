import { Body, Controller, Post } from '@nestjs/common';
import { NewsletterDto } from '../dto/newsletter.dto';
import { CreateNewsletterUseCase } from '../../application/use-cases/create-newsletter.use-case';

@Controller('api/v1/newsletters')
export class NewsletterController {
  constructor(
    private readonly createNewsletterUseCase: CreateNewsletterUseCase,
  ) {}

  @Post()
  async subscribe(@Body() dto: NewsletterDto): Promise<void> {
    await this.createNewsletterUseCase.execute(dto.email);
  }
}
