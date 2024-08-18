import { cleanEnv, str, email } from 'envalid';

export const env = cleanEnv(process.env, {
  ADMIN_EMAIL: email({ desc: 'Email for Moralis Admin App' }),
  ADMIN_PASSWORD: str({ desc: 'Password for Moralis Admin App' }),
  WINSTON_LOG_LEVEL: str({ desc: 'Winston logger level', default: 'info', choices: ['info', 'debug'] }),
});
