import { errorResponses, secured } from "./docUtils";


const userIdParam = {
  name:        'userId',
  in:          'query',
  required:    false,
  description: 'Filter by a specific user (ANALYST and ADMIN only). Viewers always see their own data regardless of this param.',
  schema:      { type: 'string', format: 'uuid' },
};

export const dashboardDocs = {

  '/dashboard/summary': {
    get: {
      tags:        ['Dashboard'],
      summary:     'Financial summary',
      description: `
Returns total income, total expenses, net balance and record count.
- **VIEWER** — always scoped to their own data
- **ANALYST / ADMIN** — current user by default. Use \`?userId=\` to scope to one user.
      `.trim(),
      security:   secured,
      parameters: [userIdParam],
      responses: {
        200: {description: 'Summary retrieved'},
        ...errorResponses,
      },
    },
  },

  '/dashboard/category-totals': {
    get: {
      tags:        ['Dashboard'],
      summary:     'Category totals',
      description: `
Per-category totals split by INCOME and EXPENSE. ANALYST and ADMIN only.

- **ANALYST / ADMIN** — current user by default. Use \`?userId=\` to scope to one user.
      `.trim(),
      security:   secured,
      parameters: [userIdParam],
      responses: {
        200: {description: 'Category totals retrieved'},
        ...errorResponses,
      },
    },
  },

  '/dashboard/trends/monthly': {
    get: {
      tags:        ['Dashboard'],
      summary:     'Monthly trends',
      description: 'Income, expenses and net balance grouped by month.',
      security:    secured,
      parameters: [
        { name: 'months', in: 'query', description: 'Number of months (default 12, max 24)', schema: { type: 'integer', default: 12, maximum: 24 } },
        userIdParam,
      ],
      responses: {
        200: {description: 'Monthly trends retrieved'},
        ...errorResponses,
      },
    },
  },

  '/dashboard/trends/weekly': {
    get: {
      tags:        ['Dashboard'],
      summary:     'Weekly trends',
      description: 'Income, expenses and net balance grouped by ISO week',
      security:    secured,
      parameters: [
        { name: 'weeks', in: 'query', description: 'Number of weeks (default 12, max 52)', schema: { type: 'integer', default: 12, maximum: 52 } },
        userIdParam,
      ],
      responses: {
        200: {description: 'Weekly trends retrieved'},
        ...errorResponses,
      },
    },
  },

};