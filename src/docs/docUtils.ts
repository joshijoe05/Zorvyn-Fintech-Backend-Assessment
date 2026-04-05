export const body = (ref: string) => ({
  required: true,
  content: { 'application/json': { schema: { $ref: `#/components/schemas/${ref}` } } },
});


export const errorResponses = {
  400: { description: 'Validation failed' },
  401: { description: 'Unauthenticated' },
  403: { description: 'Forbidden' },
  409: { description: 'Conflict' },
  500: { description: 'Internal server error' },
};

export const secured = [{ bearerAuth: [] }];