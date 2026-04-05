export const categoriesSchemas = {

    Category: {
        type: 'object',
        properties: {
            name:        { type: 'string', example: 'Salary' },
            description: { type: 'string', nullable: true },
        },
    },
};