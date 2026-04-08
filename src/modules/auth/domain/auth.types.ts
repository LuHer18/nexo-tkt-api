export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

export type RefreshPayload = {
  sub: string;
  jti: string;
  type: "refresh";
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

export type AuthenticatedUser = AuthUser & {
  permissions: string[];
};
