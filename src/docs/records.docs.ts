import { errorResponses, secured, body } from './docUtils';
const uuidParam  = { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } };

export const recordsDocs = {

  '/records': {
    get: {
      tags:        ['Records'],
      summary:     'List financial records',
      description: 'Paginated list with filters and sorting. Admins see all records. Analysts and Viewers see only their own.',
      security:    secured,
      parameters: [
        { name: 'page',       in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit',      in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } },
        { name: 'type',       in: 'query', schema: { type: 'string', enum: ['INCOME', 'EXPENSE'] } },
        { name: 'categoryId', in: 'query', schema: { type: 'string', format: 'uuid' } },
        { name: 'from',       in: 'query', schema: { type: 'string', format: 'date' }, description: 'YYYY-MM-DD' },
        { name: 'to',         in: 'query', schema: { type: 'string', format: 'date' }, description: 'YYYY-MM-DD' },
        { name: 'sortBy',     in: 'query', schema: { type: 'string', enum: ['date', 'amount', 'createdAt'], default: 'date' } },
        { name: 'sortOrder',  in: 'query', schema: { type: 'string', enum: ['asc', 'desc'],                default: 'desc' } },
      ],
      responses: {
        200: {description : 'Records retrieved'},
        ...errorResponses,
      },
    },
    post: {
      tags:        ['Records'],
      summary:     'Create a financial record',
      description: 'Admin only.',
      security:    secured,
      requestBody: body('FinancialRecord'),
      responses: {
        201: {description : 'Record created'},
        ...errorResponses,
      },
    },
  },

  '/records/{id}': {
    get: {
      tags:       ['Records'],
      summary:    'Get record by ID',
      security:   secured,
      parameters: [uuidParam],
      responses: {
        200: {description : 'Record retrieved'},
        ...errorResponses,
      },
    },
    patch: {
      tags:        ['Records'],
      summary:     'Update a record',
      description: 'Admin only. All fields optional — only provided fields are updated.',
      security:    secured,
      parameters:  [uuidParam],
      requestBody: body('FinancialRecord'),
      responses: {
        200: {description : 'Record updated'},
        ...errorResponses,
      },
    },
    delete: {
      tags:        ['Records'],
      summary:     'Delete a record',
      description: 'Admin only. Soft delete — record is retained in the database for audit purposes.',
      security:    secured,
      parameters:  [uuidParam],
      responses: {
        200: {description : 'Record deleted'},
        ...errorResponses,
      },
    },
  },
};