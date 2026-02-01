import { PublicUser, JwtPayload } from './domain';

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
      tokenPayload?: JwtPayload;
    }
  }
}

export {};