import { CreateNewsletterUseCase } from './create-newsletter.use-case';
import { NewsletterRepositoryPort } from '../../domain/ports/newsletter.repository.port';

describe('CreateNewsletterUseCase', () => {
  let useCase: CreateNewsletterUseCase;
  let repository: NewsletterRepositoryPort;

  const mockRepository: NewsletterRepositoryPort = {
    save: jest.fn(),
  };

  beforeEach(() => {
    repository = mockRepository;
    useCase = new CreateNewsletterUseCase(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call repository.save with a newsletter entity', async () => {
    const email = 'test@example.com';

    await useCase.execute(email);

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledWith({ email });
  });

  it('should throw an error if repository fails', async () => {
    const email = 'error@example.com';
    (repository.save as jest.Mock).mockRejectedValueOnce(new Error('Save failed'));

    await expect(useCase.execute(email)).rejects.toThrow('Save failed');
  });
});
