import { z } from 'zod';

export const createRecordSchema = z.object({
  amount: z
    .number('Amount is required')
    .positive('Amount must be greater than zero'),

  type: z
    .enum(["INCOME","EXPENSE"], {
        error: "Role must be ADMIN, ANALYST, or VIEWER",
    }),

  categoryId: z
    .string({ error: 'Category is required' })
    .uuid('Category ID must be a valid UUID'),

  date: z
    .string({ error: 'Date is required' })
    .date('Date must be a valid date in YYYY-MM-DD format'),

  notes: z
    .string()
    .trim()
    .max(500, 'Notes must not exceed 500 characters')
    .optional(),
});

export const updateRecordSchema = createRecordSchema.partial();

export const recordsQuerySchema = z.object({

  page:  z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),

  type:       z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().uuid().optional(),
  from:       z.string().date('from must be YYYY-MM-DD').optional(),
  to:         z.string().date('to must be YYYY-MM-DD').optional(),

  sortBy:    z.enum(['date', 'amount', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
}).refine(
  (data) => {
    if (data.from && data.to) return data.from <= data.to;
    return true;
  },
  { message: 'from date must be before or equal-to to date', path: ['from'] },
);

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type RecordsQuery      = z.infer<typeof recordsQuerySchema>;