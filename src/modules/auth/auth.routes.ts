import { Router } from "express";

import { env } from "../../config/env";
import { requireAuth } from "./auth.middleware";
import { authService } from "./auth.service";
import { loginSchema } from "./auth.schemas";

export const authRouter = Router();

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth/refresh",
  maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
};

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);

    res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, refreshCookieOptions);

    res.status(200).json({
      message: "Login exitoso",
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo iniciar sesión";

    res.status(401).json({ message });
  }
});

authRouter.post("/refresh", async (req, res) => {
  try {
    const currentRefreshToken = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME];

    if (!currentRefreshToken) {
      return res.status(401).json({ message: "Refresh token no encontrado" });
    }

    const result = await authService.refresh(currentRefreshToken);

    res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "Token refrescado",
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshCookieOptions);

    const message = error instanceof Error ? error.message : "No se pudo refrescar la sesión";

    return res.status(401).json({ message });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    const currentRefreshToken = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME];

    if (currentRefreshToken) {
      await authService.logout(currentRefreshToken);
    }
  } catch {
    // siempre limpiar cookie aunque el token ya no exista o sea inválido
  }

  res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshCookieOptions);

  return res.status(200).json({
    message: "Logout exitoso",
  });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.auth!.sub);

    return res.status(200).json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo obtener el usuario";
    return res.status(404).json({ message });
  }
});
