export interface PaginationQuery {
    page?: number;
    limit?: number;
}

export const getPagination = (query: PaginationQuery) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip
    };
};