import type { Request, Response } from "express";

import { env } from "../../../../shared/config/env";
import { AppError } from "../../../../shared/domain/errors/app-error";
import { buildAuthDependencies } from "../../factories/build-auth-dependencies";
import { loginSchema } from "./auth.schemas";

const { loginUseCase, refreshSessionUseCase, logoutUseCase, getCurrentUserUseCase } = buildAuthDependencies();

export const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth/refresh",
  maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
};

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginUseCase.execute(email, password);

    res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "Login exitoso",
      accessToken: result.accessToken,
      user: result.user,
    });
  }

  async refresh(req: Request, res: Response) {
    const currentRefreshToken = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME];

    if (!currentRefreshToken) {
      throw new AppError("Refresh token no encontrado", 401);
    }

    const result = await refreshSessionUseCase.execute(currentRefreshToken);

    res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "Token refrescado",
      accessToken: result.accessToken,
      user: result.user,
    });
  }

  async logout(req: Request, res: Response) {
    const currentRefreshToken = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME];

    if (currentRefreshToken) {
      try {
        await logoutUseCase.execute(currentRefreshToken);
      } catch {
        // limpiar cookie aunque el token no exista o sea inválido
      }
    }

    res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshCookieOptions);

    return res.status(200).json({ message: "Logout exitoso" });
  }

  async me(req: Request, res: Response) {
    const user = await getCurrentUserUseCase.execute(req.auth!.sub);
    return res.status(200).json({ user });
  }
}
