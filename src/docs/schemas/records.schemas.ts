export const recordsSchema = {
    FinancialRecord: {
        type: 'object',
        properties: {
            amount:        { type: 'number', example: 1500.00 },
            type:          { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            date:          { type: 'string', format: 'date', example: '2024-03-15' },
            notes:         { type: 'string', nullable: true, example: 'Monthly salary' },
            categoryId:    { type: 'string', format: 'uuid' }
        },
    },
};