import { body, errorResponses, secured } from './docUtils';



export const categoriesDocs = {

  '/categories': {
    get: {
      tags:        ['Categories'],
      summary:     'List all categories',
      description: 'Returns system and custom categories. System categories are listed first.',
      security:    secured,
      responses: {
        200: { description: 'Categories retrieved' },
        ...errorResponses,
      },
    },
    post: {
      tags:        ['Categories'],
      summary:     'Create a category',
      description: 'Creates a custom category. Admin only. System categories are seeded by the application.',
      security:    secured,
      requestBody: body('Category'),
      responses: {
        201: { description: 'Category created' },
        ...errorResponses,
      },
    },
  },

  '/categories/{id}': {
    get: {
      tags:     ['Categories'],
      summary:  'Get category by ID',
      security: secured,
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
      responses: {
        200: { description: 'Category retrieved' },
        ...errorResponses,
      },
    },
    patch: {
      tags:        ['Categories'],
      summary:     'Update a category',
      description: 'Admin only. System categories cannot be modified.',
      security:    secured,
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
      requestBody: body('Category'),
      responses: {
        200: { description: 'Category updated' },
        ...errorResponses,
      },
    },
    delete: {
      tags:        ['Categories'],
      summary:     'Delete a category',
      description: 'Admin only. System categories and categories used by records cannot be deleted.',
      security:    secured,
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
      responses: {
        200: { description: 'Category deleted' },
        ...errorResponses,
      },
    },
  },
};