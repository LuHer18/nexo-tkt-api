import { GetCurrentUserUseCase } from "../application/use-cases/get-current-user.use-case";
import { LoginUseCase } from "../application/use-cases/login.use-case";
import { LogoutUseCase } from "../application/use-cases/logout.use-case";
import { RefreshSessionUseCase } from "../application/use-cases/refresh-session.use-case";
import { PrismaAuthRepository, PrismaUserReader } from "../infrastructure/repositories/prisma-auth.repository";

const authRepository = new PrismaAuthRepository();
const userReader = new PrismaUserReader();

export const buildAuthDependencies = () => ({
  authRepository,
  userReader,
  loginUseCase: new LoginUseCase(authRepository),
  refreshSessionUseCase: new RefreshSessionUseCase(authRepository),
  logoutUseCase: new LogoutUseCase(authRepository),
  getCurrentUserUseCase: new GetCurrentUserUseCase(userReader),
});
