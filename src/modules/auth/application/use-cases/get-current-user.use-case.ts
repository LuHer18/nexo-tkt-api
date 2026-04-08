import { AppError } from "../../../../shared/domain/errors/app-error";
import type { UserReader } from "../../domain/auth.repository";

export class GetCurrentUserUseCase {
  constructor(private readonly userReader: UserReader) {}

  async execute(userId: string) {
    const user = await this.userReader.getById(userId);

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    return user;
  }
}
