import { Prisma } from '@prisma/client';
import prisma from '../../config/db';
import { Errors } from '../../common/utils/apiError';
import { buildPaginationMeta } from '../../common/utils/apiResponse';
import { CreateRecordInput, UpdateRecordInput, RecordsQuery } from './records.schema';
import { FinancialRecordDetail } from './records.types';



export const recordsService = {

  async findAll(query: RecordsQuery, userId: string, isAdmin: boolean) {
    const { page, limit, type, categoryId, from, to, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const orderByColumn: Record<string, string> = {
      date:      'date',
      amount:    'amount',
      createdAt: 'created_at',
    };
    const orderCol = orderByColumn[sortBy] ?? 'date';
    const orderDir = sortOrder === 'asc' ? Prisma.sql`ASC` : Prisma.sql`DESC`;

    const userFilter      = isAdmin     ? Prisma.sql``  : Prisma.sql`AND user_id = ${userId}::uuid`;
    const typeFilter      = type        ? Prisma.sql`AND type = ${type}::"RecordType"` : Prisma.sql``;
    const categoryFilter  = categoryId  ? Prisma.sql`AND category_id = ${categoryId}::uuid` : Prisma.sql``;
    const fromFilter      = from        ? Prisma.sql`AND date >= ${new Date(from)}` : Prisma.sql``;
    const toFilter        = to          ? Prisma.sql`AND date <= ${new Date(to)}` : Prisma.sql``;

    const [records, countResult] = await Promise.all([
      prisma.$queryRaw<FinancialRecordDetail[]>`
        SELECT *
        FROM   v_financial_records_detail
        WHERE  1=1
          ${userFilter}
          ${typeFilter}
          ${categoryFilter}
          ${fromFilter}
          ${toFilter}
        ORDER BY ${Prisma.raw(orderCol)} ${orderDir}
        LIMIT  ${limit}
        OFFSET ${skip}
      `,
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) AS count
        FROM   v_financial_records_detail
        WHERE  1=1
          ${userFilter}
          ${typeFilter}
          ${categoryFilter}
          ${fromFilter}
          ${toFilter}
      `,
    ]);

    const total = Number(countResult[0].count);

    return {
      items: records,
      meta:  buildPaginationMeta(total, page, limit),
    };
  },


  async findById(id: string, userId: string, isAdmin: boolean): Promise<FinancialRecordDetail> {
    const userFilter = isAdmin ? Prisma.sql`` : Prisma.sql`AND user_id = ${userId}::uuid`;

    const rows = await prisma.$queryRaw<FinancialRecordDetail[]>`
      SELECT *
      FROM   v_financial_records_detail
      WHERE  id = ${id}::uuid
        ${userFilter}
      LIMIT  1
    `;

    if (!rows.length) throw Errors.notFound('Financial record');
    return rows[0];
  },


  async assertCategoryExists(categoryId: string): Promise<void> {
    const category = await prisma.category.findFirst({
      where:  { id: categoryId, deletedAt: null },
      select: { id: true },
    });
    if (!category) throw Errors.notFound('Category');
  },


  async create(input: CreateRecordInput, userId: string): Promise<FinancialRecordDetail> {
    await recordsService.assertCategoryExists(input.categoryId);

    const created = await prisma.financialRecord.create({
      data: {
        userId,
        categoryId: input.categoryId,
        amount: input.amount,
        type: input.type,
        date: new Date(input.date),
        notes: input.notes,
      },
    });

    const rows = await prisma.$queryRaw<FinancialRecordDetail[]>`
      SELECT * FROM v_financial_records_detail WHERE id = ${created.id}::uuid LIMIT 1
    `;
    return rows[0];
  },


  async update(
    id:      string,
    input:   UpdateRecordInput,
    userId:  string,
    isAdmin: boolean,
  ): Promise<FinancialRecordDetail> {
    await recordsService.findById(id, userId, isAdmin);

    if (input.categoryId) {
      await recordsService.assertCategoryExists(input.categoryId);
    }

    await prisma.financialRecord.update({
      where: { id },
      data: {
        ...input,
        ...(input.date && { date: new Date(input.date) }),
      },
    });

    const rows = await prisma.$queryRaw<FinancialRecordDetail[]>`
      SELECT * FROM v_financial_records_detail WHERE id = ${id}::uuid LIMIT 1
    `;
    return rows[0];
  },


  async delete(id: string, userId: string, isAdmin: boolean): Promise<void> {
    await recordsService.findById(id, userId, isAdmin);

    await prisma.financialRecord.update({
      where: { id },
      data:  { deletedAt: new Date() },
    });
  },


  async logAudit(
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    entityId: string,
    performedBy: string,
    oldValues?: object,
    newValues?: object,
  ): Promise<void> {
    await prisma.auditLog.create({
      data: {
        entityType:  'FINANCIAL_RECORD',
        entityId,
        action,
        oldValues:   oldValues ?? Prisma.JsonNull,
        newValues:   newValues ?? Prisma.JsonNull,
        performedBy,
      },
    });
  },
};