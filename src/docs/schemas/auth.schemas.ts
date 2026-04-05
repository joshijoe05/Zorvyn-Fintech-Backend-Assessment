export const authSchemas = {

  RegisterRequest: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name:     { type: 'string', minLength: 2, maxLength: 100, example: 'Jane Doe' },
      email:    { type: 'string', format: 'email', example: 'jane@example.com' },
      password: { type: 'string', minLength: 8, example: 'Secret@123', description: 'Min 8 chars. Requires uppercase, lowercase, number and special character' },
      role:     { type: 'string', enum: ['ADMIN', 'ANALYST', 'VIEWER'], default: 'VIEWER' },
    },
  },

  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email:    { type: 'string', format: 'email', example: 'jane@example.com' },
      password: { type: 'string', example: 'Secret@123' },
    },
  },

  RefreshRequest: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    },
  },
};