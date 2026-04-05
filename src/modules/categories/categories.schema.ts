import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string('Name is required')
    .trim()
    .min(2,   'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),

  description: z
    .string()
    .trim()
    .max(255, 'Description must not exceed 255 characters')
    .optional(),

  color: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code e.g. #4CAF50')
    .optional(),

  icon: z
    .string()
    .trim()
    .max(50, 'Icon name must not exceed 50 characters')
    .optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;