import { Module } from '@nestjs/common';
import { FirebaseAdminProvider } from './firebaseadmin.provider';

@Module({
  providers: [FirebaseAdminProvider],
  exports: [FirebaseAdminProvider], // Export the provider so it can be used in other modules
})
export class FirebaseModule {}
