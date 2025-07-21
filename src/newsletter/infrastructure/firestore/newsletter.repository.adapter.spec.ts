import { FirestoreNewsletterRepository } from './newsletter.repository.adapter';
import { FirebaseAdminProvider } from '../../../firebase/firebaseadmin.provider';
import { Firestore } from '@google-cloud/firestore';
import { Newsletter } from '../../domain/models/newsletter.entity';

describe('FirestoreNewsletterRepository', () => {
  let repository: FirestoreNewsletterRepository;
  let addMock: jest.Mock;

  beforeEach(() => {
    addMock = jest.fn();

    const mockDb = {
      collection: jest.fn().mockReturnValue({
        add: addMock,
      }),
    };

    const mockFirebaseAdminProvider: Partial<FirebaseAdminProvider> = {
      getFirestore: () => mockDb as unknown as Firestore,
    };

    repository = new FirestoreNewsletterRepository(mockFirebaseAdminProvider as FirebaseAdminProvider);
  });

  it('should save newsletter to Firestore', async () => {
    const newsletter = new Newsletter('test@example.com');
    await repository.save(newsletter);

    expect(addMock).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('should throw error if Firestore add fails', async () => {
    addMock.mockRejectedValueOnce(new Error('Firestore error'));
    const newsletter = new Newsletter('fail@example.com');

    await expect(repository.save(newsletter)).rejects.toThrow('Firestore error');
  });
});
