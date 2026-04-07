import { registerAs } from '@nestjs/config';

export type EmailConfig = {
  user: string;
  pass: string;
  from: string;
};

export default registerAs(
  'email',
  (): EmailConfig => ({
    user: process.env.EMAIL_USER ?? '',
    pass: process.env.EMAIL_PASS ?? '',
    from: process.env.EMAIL_FROM ?? 'Ustasi <no-reply@api.ustasi.tech>',
  }),
);
