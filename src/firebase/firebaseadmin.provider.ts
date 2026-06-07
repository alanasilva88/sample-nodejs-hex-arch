import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { DataAccessException } from '../common/exceptions/data-access.exception';
import { GENERIC_ERROR_MESSAGES } from '../common/constants/error-messages.constants';

dotenv.config();

@Injectable()
export class FirebaseAdminProvider implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminProvider.name);
  private firestore: FirebaseFirestore.Firestore | undefined;

  onModuleInit() {
    this.validateEnvironmentVariables();
    this.initializeFirebaseAdmin();
  }

  private validateEnvironmentVariables(): void {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      this.logger.error('A variável de ambiente GOOGLE_APPLICATION_CREDENTIALS não está definida.');
    }
    if (!process.env.PROJECT_ID) {
      this.logger.error('A variável de ambiente PROJECT_ID não está definida.');
    }
  }

  private initializeFirebaseAdmin(): void {
    try {
      if (!admin.apps.length) {
        const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS
          ? admin.credential.cert(require(path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS)) as admin.ServiceAccount)
          : applicationDefault();

        initializeApp({
          credential: credentials,
          projectId: process.env.PROJECT_ID
        });

        this.logger.log('Firebase Admin SDK inicializado com sucesso');
      } else {
        this.logger.log('Firebase Admin SDK já estava inicializado, reutilizando a instância.');
      }

      this.firestore = admin.firestore();

      if (!this.firestore) {
        throw new Error('Firestore não foi inicializado corretamente.');
      }

    } catch (error) {
      this.logger.error('Erro de inicialização do Firebase Admin SDK:', error);
      throw new DataAccessException(GENERIC_ERROR_MESSAGES.DATABASE);
    }
  }

  getFirestore(): FirebaseFirestore.Firestore {
    if (!this.firestore) {
      this.logger.error('Firestore ainda não está disponível no FirebaseAdminProvider.');
      throw new DataAccessException(GENERIC_ERROR_MESSAGES.DATABASE);
    }
    return this.firestore;
  }

  getAuth(): admin.auth.Auth {
    return admin.auth();
  }
}