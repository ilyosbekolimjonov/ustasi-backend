import { registerAs } from '@nestjs/config';

export type AppConfig = {
  port: number;
  apiPrefix: string;
  appBaseUrl: string;
  corsOrigins: string[];
  nodeEnv: string;
};

export default registerAs(
  'app',
  (): AppConfig => ({
    port: Number(process.env.PORT ?? 3000),
    apiPrefix: 'api',
    appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:3000',
    corsOrigins: (process.env.CORS_ORIGIN ?? '*')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    nodeEnv: process.env.NODE_ENV ?? 'development',
  }),
);
