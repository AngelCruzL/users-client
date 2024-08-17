import { Authority, TokenPayload } from '../types';

export function tokenPayloadAdapter(rawPayload: string): TokenPayload {
  const payload = JSON.parse(atob(rawPayload));
  const authorities = JSON.parse(payload.authorities).map(
    (a: { authority: Authority }) => {
      return a.authority;
    },
  );

  return {
    ...payload,
    authorities,
  };
}
