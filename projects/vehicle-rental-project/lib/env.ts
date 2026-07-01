import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().optional(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432'),
  DB_NAME: z.string().default('rv_rental'),
  DB_USER: z.string().default('rv_user'),
  DB_PASSWORD: z.string().optional(),
  AUTH_SECRET: z.string().min(32),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  RESEND_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_').optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
});

const result = schema.safeParse(process.env);
if (!result.success) {
  console.error('Env validation failed:', result.error.flatten().fieldErrors);
  throw new Error('Invalid env config');
}

export const env = result.data;

export const getEnv = {
  db: {
    host: () => env.DB_HOST,
    port: () => parseInt(env.DB_PORT),
    name: () => env.DB_NAME,
    user: () => env.DB_USER,
    password: () => env.DB_PASSWORD,
    url: () => env.DATABASE_URL,
  },
  auth: {
    secret: () => env.AUTH_SECRET,
    googleClientId: () => env.AUTH_GOOGLE_ID,
    googleClientSecret: () => env.AUTH_GOOGLE_SECRET,
  },
  stripe: {
    secretKey: () => env.STRIPE_SECRET_KEY,
    webhookSecret: () => env.STRIPE_WEBHOOK_SECRET,
    publishableKey: () => env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  email: {
    resendApiKey: () => env.RESEND_API_KEY || '',
  },
  app: {
    url: () => env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    isDev: () => env.NODE_ENV === 'development',
    isProd: () => env.NODE_ENV === 'production',
  },
};
