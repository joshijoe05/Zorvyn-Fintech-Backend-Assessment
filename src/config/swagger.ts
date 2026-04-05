import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../config/env";
import { authDocs } from "../docs/auth.docs";
import { authSchemas } from "../docs/schemas/auth.schemas";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Zorvyn Fintech API",
            version: "1.0.0",
        },
        servers: [
            { url: `http://localhost:${env.PORT}/api/v1`, description: "Local development server" },
        ],
        components: {
            schemas: {
                ...authSchemas,
            },
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        tags: [
            { name: 'Auth',       description: 'Authentication — login, logout, token refresh' },
            { name: 'Users',      description: 'User management (Admin only)' },
            { name: 'Records',    description: 'Financial records — CRUD and filtering' },
            { name: 'Categories', description: 'Record categories management' },
            { name: 'Dashboard',  description: 'Aggregated analytics and insights' },
        ],
        paths: {
            ...authDocs,
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);