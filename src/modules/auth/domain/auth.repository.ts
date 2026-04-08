import type { AuthenticatedUser, AuthUser } from "./auth.types";

export type UserRecord = {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  role: string;
};

export type StoredRefreshToken = {
  tokenId: string;
  userId: string;
  tokenHash: string;
  status: "active" | "revoked" | "consumed";
  revokedAt: Date | null;
  expiresAt: Date;
  user: UserRecord;
};

export interface AuthRepository {
  findUserByEmail(email: string): Promise<UserRecord | null>;
  findStoredRefreshToken(tokenId: string): Promise<StoredRefreshToken | null>;
  createRefreshToken(input: { tokenId: string; userId: string; tokenHash: string; expiresAt: Date }): Promise<void>;
  consumeRefreshToken(input: { tokenId: string; replacedByTokenId: string }): Promise<void>;
  revokeRefreshToken(tokenId: string): Promise<void>;
}

export interface UserReader {
  getById(userId: string): Promise<AuthenticatedUser | null>;
}

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};
