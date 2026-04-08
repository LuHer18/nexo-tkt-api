import { prisma } from "../../../../shared/infrastructure/database/prisma/client";
import type { AuthRepository, StoredRefreshToken, UserReader, UserRecord } from "../../domain/auth.repository";

const includeRolePermissions = {
  role: {
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  },
} as const;

const mapUserRecord = (user: {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  role: { name: string };
}): UserRecord => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  passwordHash: user.passwordHash,
  isActive: user.isActive,
  role: user.role.name,
});

export class PrismaAuthRepository implements AuthRepository {
  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    return user ? mapUserRecord(user) : null;
  }

  async findStoredRefreshToken(tokenId: string): Promise<StoredRefreshToken | null> {
    const token = await prisma.refreshToken.findUnique({
      where: { tokenId },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    if (!token) return null;

    return {
      tokenId: token.tokenId,
      userId: token.userId,
      tokenHash: token.tokenHash,
      status: token.status,
      revokedAt: token.revokedAt,
      expiresAt: token.expiresAt,
      user: mapUserRecord(token.user),
    };
  }

  async createRefreshToken(input: { tokenId: string; userId: string; tokenHash: string; expiresAt: Date }): Promise<void> {
    await prisma.refreshToken.create({ data: input });
  }

  async consumeRefreshToken(input: { tokenId: string; replacedByTokenId: string }): Promise<void> {
    await prisma.refreshToken.update({
      where: { tokenId: input.tokenId },
      data: {
        status: "consumed",
        revokedAt: new Date(),
        replacedByTokenId: input.replacedByTokenId,
      },
    });
  }

  async revokeRefreshToken(tokenId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        tokenId,
        status: "active",
      },
      data: {
        status: "revoked",
        revokedAt: new Date(),
      },
    });
  }
}

export class PrismaUserReader implements UserReader {
  async getById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: includeRolePermissions,
    });

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
      permissions: user.role.rolePermissions.map((item) => item.permission.code),
    };
  }
}
