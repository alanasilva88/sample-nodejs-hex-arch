import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { NewsletterController } from './interface/controllers/newsletter.controller';
import { FirestoreNewsletterRepository } from './infrastructure/firestore/newsletter.repository.adapter';
import { NewsletterDto } from './interface/dto/newsletter.dto';

describe('NewsletterController (Integration)', () => {
  let app: INestApplication;
  const mockRepository = {
    save: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [NewsletterController],
      providers: [
        {
          provide: FirestoreNewsletterRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 201 for valid email', async () => {
    const dto: NewsletterDto = { email: 'valid@example.com' };
    mockRepository.save.mockResolvedValueOnce(undefined);

    await request(app.getHttpServer())
      .post('/api/v1/newsletters')
      .send(dto)
      .expect(201);

    expect(mockRepository.save).toHaveBeenCalledWith({ email: dto.email });
  });

  it('should return 400 for invalid email', async () => {
    const dto = { email: 'invalid-email' }; // invalid email format

    await request(app.getHttpServer())
      .post('/api/v1/newsletters')
      .send(dto)
      .expect(400);
  });

  it('should return 500 if repository throws error', async () => {
    const dto: NewsletterDto = { email: 'error@example.com' };
    mockRepository.save.mockRejectedValueOnce(new Error('Simulated Firestore failure'));

    await request(app.getHttpServer())
      .post('/api/v1/newsletters')
      .send(dto)
      .expect(500);
  });
});
