import { z } from 'zod';

// Admin Login Schema
export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .refine((val) => val === 'admin' || z.string().email().safeParse(val).success, {
      message: 'Invalid admin email',
    }),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;