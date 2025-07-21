import { Test, TestingModule } from '@nestjs/testing';
import { NewsletterController } from './newsletter.controller';
import { NewsletterDto } from '../dto/newsletter.dto';
import { FirestoreNewsletterRepository } from '../../infrastructure/firestore/newsletter.repository.adapter';

describe('NewsletterController', () => {
  let controller: NewsletterController;

  const mockRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsletterController],
      providers: [
        {
          provide: FirestoreNewsletterRepository,
          useValue: mockRepository,
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

    mockRepository.save.mockResolvedValueOnce(undefined);

    await controller.subscribe(dto);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledWith({ email: dto.email });
  });

  it('should throw error if repository fails', async () => {
    const dto: NewsletterDto = { email: 'fail@example.com' };
    mockRepository.save.mockRejectedValueOnce(new Error('Firestore error'));

    await expect(controller.subscribe(dto)).rejects.toThrow('Firestore error');
  });
});
