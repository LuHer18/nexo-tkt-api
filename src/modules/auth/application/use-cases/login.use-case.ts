import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

import { env } from "../../../../shared/config/env";
import { AppError } from "../../../../shared/domain/errors/app-error";
import type { AuthRepository, AuthTokens } from "../../domain/auth.repository";
import { parseTtlToMs, signAccessToken, signRefreshToken } from "../../domain/auth-token.service";

const hashToken = async (token: string) => bcrypt.hash(token, 10);

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<AuthTokens> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user || !user.isActive) {
      throw new AppError("Credenciales inválidas", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new AppError("Credenciales inválidas", 401);
    }

    const tokenId = randomUUID();
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, jti: tokenId, type: "refresh" });

    await this.authRepository.createRefreshToken({
      tokenId,
      userId: user.id,
      tokenHash: await hashToken(refreshToken),
      expiresAt: new Date(Date.now() + parseTtlToMs(env.REFRESH_TOKEN_TTL_DAYS)),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
