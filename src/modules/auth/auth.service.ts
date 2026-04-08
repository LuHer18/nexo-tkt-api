import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { randomUUID } from "node:crypto";

import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";

type AccessPayload = {
  sub: string;
  email: string;
  role: string;
};

type RefreshPayload = {
  sub: string;
  jti: string;
  type: "refresh";
};

const parseTtlToMs = (days: number) => days * 24 * 60 * 60 * 1000;

const signAccessToken = (payload: AccessPayload) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL as SignOptions["expiresIn"],
  });
};

const signRefreshToken = (payload: RefreshPayload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`,
  });
};

const hashToken = async (token: string) => bcrypt.hash(token, 10);

export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      throw new Error("Credenciales inválidas");
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new Error("Credenciales inválidas");
    }

    const tokenId = randomUUID();

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });

    const refreshToken = signRefreshToken({
      sub: user.id,
      jti: tokenId,
      type: "refresh",
    });

    await prisma.refreshToken.create({
      data: {
        tokenId,
        userId: user.id,
        tokenHash: await hashToken(refreshToken),
        expiresAt: new Date(Date.now() + parseTtlToMs(env.REFRESH_TOKEN_TTL_DAYS)),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role.name,
      },
    };
  },

  async refresh(rawToken: string) {
    const payload = jwt.verify(rawToken, env.REFRESH_TOKEN_SECRET) as RefreshPayload;

    if (payload.type !== "refresh") {
      throw new Error("Refresh token inválido");
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenId: payload.jti },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    if (!storedToken || storedToken.status !== "active" || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new Error("Refresh token inválido o expirado");
    }

    const tokenMatches = await bcrypt.compare(rawToken, storedToken.tokenHash);

    if (!tokenMatches) {
      throw new Error("Refresh token inválido");
    }

    const nextTokenId = randomUUID();

    const accessToken = signAccessToken({
      sub: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role.name,
    });

    const nextRefreshToken = signRefreshToken({
      sub: storedToken.user.id,
      jti: nextTokenId,
      type: "refresh",
    });

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { tokenId: storedToken.tokenId },
        data: {
          status: "consumed",
          revokedAt: new Date(),
          replacedByTokenId: nextTokenId,
        },
      }),
      prisma.refreshToken.create({
        data: {
          tokenId: nextTokenId,
          userId: storedToken.userId,
          tokenHash: await hashToken(nextRefreshToken),
          expiresAt: new Date(Date.now() + parseTtlToMs(env.REFRESH_TOKEN_TTL_DAYS)),
        },
      }),
    ]);

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      user: {
        id: storedToken.user.id,
        fullName: storedToken.user.fullName,
        email: storedToken.user.email,
        role: storedToken.user.role.name,
      },
    };
  },

  async logout(rawToken: string) {
    const payload = jwt.verify(rawToken, env.REFRESH_TOKEN_SECRET) as RefreshPayload;

    await prisma.refreshToken.updateMany({
      where: {
        tokenId: payload.jti,
        status: "active",
      },
      data: {
        status: "revoked",
        revokedAt: new Date(),
      },
    });
  },
};
