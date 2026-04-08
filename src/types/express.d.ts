import type { JwtPayload } from "../modules/auth/domain/auth.types";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export {};
