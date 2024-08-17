export interface TokenPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
  isAdmin: boolean;
  authorities: Authority[];
}

export enum Authority {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USER',
}
