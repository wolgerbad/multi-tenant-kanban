import z from 'zod';

const serverSchema = z.object({
  SERVER_URL: z.string(),
  JWT_SECRET: z.string(),
});

export const serverEnv = serverSchema.parse(process.env)
