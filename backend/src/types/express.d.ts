export * from 'express';
import { Multer } from 'multer';

declare module 'express' {
  export interface Request extends Express.Request {
    user: { userId: number; email: string };
  }
}