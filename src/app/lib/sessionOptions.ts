import type { SessionOptions } from 'iron-session';

export interface GlueSessionData {
  isLoggedIn: boolean;
  token?: string;
  email?: string;
}

// iron-session의 타입 정의 확장
declare module 'iron-session' {
  interface IronSessionData extends GlueSessionData { }
}

const sessionPassword = process.env.SESSION_PW || 'complex_password_at_least_32_characters_long';

export const ironOptions: SessionOptions = {
  password: sessionPassword,
  cookieName: 'glue_cookie',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
};
