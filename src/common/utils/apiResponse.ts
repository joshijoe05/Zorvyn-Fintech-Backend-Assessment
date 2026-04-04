import { Response } from "express";
export class ApiResponse<T> {
    public statusCode: number;
    public success: boolean;
    public message: string;
    public data?: T;
    public errors?:    Record<string, string[]> | string[];

    constructor(
        statusCode: number,
        data?: T,
        message: string = "success",
        errors?:    Record<string, string[]> | string[],
    ) {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
        if (errors) this.errors = errors;
    }
}

export function sendResponse<T>(res: Response, response: ApiResponse<T>): Response {
  return res.status(response.statusCode).json(response);
}


// Pagination Response
export interface PaginationMeta {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
  hasNext:    boolean;
  hasPrev:    boolean;
}
 
export interface PaginatedData<T> {
  items: T[];
  meta:  PaginationMeta;
}
 
export function buildPaginationMeta(
  total: number,
  page:  number,
  limit: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}