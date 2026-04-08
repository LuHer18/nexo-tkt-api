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
