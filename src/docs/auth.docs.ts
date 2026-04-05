import { body, errorResponses, secured } from "./docUtils";



export const authDocs = {

  '/auth/register': {
    post: {
      tags:        ['Auth'],
      summary:     'Register a new user',
      description: 'Creates a new account. Role defaults to VIEWER if not provided.',
      requestBody: body('RegisterRequest'),
      responses: {
        201: {description : 'Account created successfully'},
        ...errorResponses,
      },
    },
  },

  '/auth/login': {
    post: {
      tags:        ['Auth'],
      summary:     'Login',
      description: 'Authenticates with email and password. Returns a fresh token pair.',
      requestBody: body('LoginRequest'),
      responses: {
        200: {description : 'Login successful'},
        ...errorResponses,
      },
    },
  },

  '/auth/refresh': {
    post: {
      tags:        ['Auth'],
      summary:     'Refresh tokens',
      description: 'Exchanges a valid refresh token for a new pair. Old token is revoked immediately.',
      requestBody: body('RefreshRequest'),
      responses: {
        200: {description : 'Tokens refreshed'},
        ...errorResponses,
      },
    },
  },

  '/auth/logout': {
    post: {
      tags:        ['Auth'],
      summary:     'Logout',
      description: 'Revokes the refresh token. Access token expires naturally.',
      security:    secured,
      requestBody: body('RefreshRequest'),
      responses: {
        200: {description : 'Logged out successfully'},
        ...errorResponses,
      },
    },
  },
};