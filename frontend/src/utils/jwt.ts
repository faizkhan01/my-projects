import jwt_decode, { JwtPayload } from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
  const decoded = jwt_decode<JwtPayload>(token);

  if (!decoded.exp) return true;

  const expired = Date.now() >= decoded.exp * 1000;
  return expired;
};
