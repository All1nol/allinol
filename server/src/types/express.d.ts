import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// This file has no imports or exports, so the TypeScript compiler treats it as an ambient module
export {}; 