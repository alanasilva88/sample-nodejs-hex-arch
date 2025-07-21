import { Module } from '@nestjs/common';
import { FirebaseAdminProvider } from '../firebase/firebaseadmin.provider';
import { LogDbRepository } from './repository/logdb.repository';
import { LogDbService } from './service/logdb.service';

@Module({
  providers: [LogDbService, LogDbRepository, FirebaseAdminProvider],
  exports: [LogDbService, LogDbRepository],
})
export class LogDbModule { }