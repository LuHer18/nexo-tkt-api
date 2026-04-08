import { AppError } from "../../../../shared/domain/errors/app-error";
import type { AuthRepository } from "../../domain/auth.repository";
import { verifyRefreshToken } from "../../domain/auth-token.service";

export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(rawToken: string): Promise<void> {
    const payload = verifyRefreshToken(rawToken);

    if (!payload.jti) {
      throw new AppError("Refresh token inválido", 401);
    }

    await this.authRepository.revokeRefreshToken(payload.jti);
  }
}
