import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

import { env } from "../../../../shared/config/env";
import { AppError } from "../../../../shared/domain/errors/app-error";
import type { AuthRepository, AuthTokens } from "../../domain/auth.repository";
import { parseTtlToMs, signAccessToken, signRefreshToken, verifyRefreshToken } from "../../domain/auth-token.service";

const hashToken = async (token: string) => bcrypt.hash(token, 10);

export class RefreshSessionUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(rawToken: string): Promise<AuthTokens> {
    const payload = verifyRefreshToken(rawToken);

    if (payload.type !== "refresh") {
      throw new AppError("Refresh token inválido", 401);
    }

    const storedToken = await this.authRepository.findStoredRefreshToken(payload.jti);

    if (!storedToken || storedToken.status !== "active" || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new AppError("Refresh token inválido o expirado", 401);
    }

    const tokenMatches = await bcrypt.compare(rawToken, storedToken.tokenHash);

    if (!tokenMatches) {
      throw new AppError("Refresh token inválido", 401);
    }

    const nextTokenId = randomUUID();
    const accessToken = signAccessToken({
      sub: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });
    const refreshToken = signRefreshToken({
      sub: storedToken.user.id,
      jti: nextTokenId,
      type: "refresh",
    });

    await this.authRepository.consumeRefreshToken({ tokenId: storedToken.tokenId, replacedByTokenId: nextTokenId });
    await this.authRepository.createRefreshToken({
      tokenId: nextTokenId,
      userId: storedToken.userId,
      tokenHash: await hashToken(refreshToken),
      expiresAt: new Date(Date.now() + parseTtlToMs(env.REFRESH_TOKEN_TTL_DAYS)),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: storedToken.user.id,
        fullName: storedToken.user.fullName,
        email: storedToken.user.email,
        role: storedToken.user.role,
      },
    };
  }
}
