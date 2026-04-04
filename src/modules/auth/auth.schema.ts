import { z } from 'zod';

const passwordSchema = z
  .string('Password is required' )
  .min(8,   'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(/[A-Z]/,        'Password must contain at least one uppercase letter')
  .regex(/[a-z]/,        'Password must contain at least one lowercase letter')
  .regex(/[0-9]/,        'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');


export const registerSchema = z.object({
  name: z
    .string('Name is required')
    .trim()
    .min(2,   'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string('Email is required')
    .trim()
    .toLowerCase()
    .email('Invalid email format'),
  password: passwordSchema,
  role: z
  .enum(["ADMIN", "ANALYST", "VIEWER"], {
    message: "Role must be ADMIN, ANALYST, or VIEWER",
  })
  .default("VIEWER")
});


export const loginSchema = z.object({
  email: z
    .string('Email is required')
    .trim()
    .toLowerCase()
    .email('Invalid email format'),

  password: z
    .string('Password is required')
    .min(1, 'Password is required'),
});


export const refreshSchema = z.object({
  refreshToken: z
    .string('Refresh token is required')
    .min(1, 'Refresh token is required'),
});


export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput    = z.infer<typeof loginSchema>;
export type RefreshInput  = z.infer<typeof refreshSchema>;