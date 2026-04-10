import { registerAs } from '@nestjs/config';

export type AppConfig = {
  port: number;
  apiPrefix: string;
  appBaseUrl: string;
  corsOrigins: string[];
  nodeEnv: string;
};

export default registerAs('app', (): AppConfig => {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const configuredOrigins = (process.env.CORS_ORIGIN ?? '*')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const devOrigins =
    nodeEnv === 'development'
      ? [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'http://localhost:4001',
          'http://127.0.0.1:4001',
        ]
      : [];

  return {
    port: Number(process.env.PORT ?? 4000),
    apiPrefix: 'api',
    appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:4000',
    corsOrigins: [...new Set([...configuredOrigins, ...devOrigins])],
    nodeEnv,
  };
});
