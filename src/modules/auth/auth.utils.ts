import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../../config/env";
import type { JwtPayload, RefreshPayload } from "./auth.types";

export const parseTtlToMs = (days: number) => days * 24 * 60 * 60 * 1000;

export const signAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL as SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (payload: RefreshPayload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as RefreshPayload;
};
