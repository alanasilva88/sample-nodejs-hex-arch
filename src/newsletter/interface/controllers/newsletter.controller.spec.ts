import { Test, TestingModule } from '@nestjs/testing';
import { NewsletterController } from './newsletter.controller';
import { NewsletterDto } from '../dto/newsletter.dto';
import { CreateNewsletterUseCase } from '../../application/use-cases/create-newsletter.use-case';

describe('NewsletterController', () => {
  let controller: NewsletterController;

  const mockCreateNewsletterUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsletterController],
      providers: [
        {
          provide: CreateNewsletterUseCase,
          useValue: mockCreateNewsletterUseCase,
        },
      ],
    }).compile();

    controller = module.get<NewsletterController>(NewsletterController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call CreateNewsletterUseCase with valid email', async () => {
    const dto: NewsletterDto = { email: 'test@example.com' };

    mockCreateNewsletterUseCase.execute.mockResolvedValueOnce(undefined);

    await controller.subscribe(dto);

    expect(mockCreateNewsletterUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockCreateNewsletterUseCase.execute).toHaveBeenCalledWith(dto.email);
  });

  it('should throw error if use case fails', async () => {
    const dto: NewsletterDto = { email: 'fail@example.com' };
    mockCreateNewsletterUseCase.execute.mockRejectedValueOnce(new Error('Use case error'));

    await expect(controller.subscribe(dto)).rejects.toThrow('Use case error');
  });
});
