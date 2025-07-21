export class LogDbEntity {
  timestamp: Date;
  message: string;
  stack?: string;
  method: string;
  params?: any;
  context?: string;
}