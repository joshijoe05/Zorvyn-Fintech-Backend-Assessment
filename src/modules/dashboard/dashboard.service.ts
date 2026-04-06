import { Prisma } from "@prisma/client";
import { CategoryTotal, FinancialSummary, TrendPoint } from "./dashboard.types";
import prisma from "../../config/db";


function buildUserFilter(
  role:             string,
  requestingUserId: string,
  filterUserId?:    string,
): Prisma.Sql {
  if (role === 'VIEWER') {
    return Prisma.sql`AND user_id = ${requestingUserId}::uuid`;
  }
  if(filterUserId){
    return Prisma.sql`AND user_id = ${filterUserId}::uuid`;
  }
  return Prisma.sql`AND user_id = ${requestingUserId}::uuid`;
} 
 
export const dashboardService = {
 
 
  async getSummary(
    role:             string,
    requestingUserId: string,
    filterUserId?:    string,
  ): Promise<FinancialSummary> {
    const userFilter = buildUserFilter(role, requestingUserId, filterUserId);
 
    const rows = await prisma.$queryRaw<FinancialSummary[]>`
      SELECT
        user_id        AS "userId",
        user_name      AS "userName",
        user_email     AS "userEmail",
        total_income   AS "totalIncome",
        total_expenses AS "totalExpenses",
        net_balance    AS "netBalance",
        record_count   AS "recordCount"
      FROM v_financial_summary
      WHERE 1=1 ${userFilter}
    `;
    const row = rows[0];
    return {
      ...row,
      totalIncome:   Number(row.totalIncome),
      totalExpenses: Number(row.totalExpenses),
      netBalance:    Number(row.netBalance),
      recordCount:   Number(row.recordCount),
    };
  },
 
 
  async getCategoryTotals(
    role:             string,
    requestingUserId: string,
    filterUserId?:    string,
  ): Promise<CategoryTotal[]> {
    const userFilter = buildUserFilter(role, requestingUserId, filterUserId);
 
    const rows = await prisma.$queryRaw<CategoryTotal[]>`
      SELECT
        user_id        AS "userId",
        category_id    AS "categoryId",
        category_name  AS "categoryName",
        category_color AS "categoryColor",
        category_icon  AS "categoryIcon",
        type,
        total,
        record_count   AS "recordCount"
      FROM v_category_totals
      WHERE 1=1 ${userFilter}
      ORDER BY total DESC
    `;
 
    return rows.map((r) => ({
      ...r,
      total:       Number(r.total),
      recordCount: Number(r.recordCount),
    }));
  },

 
  async getMonthlyTrends(
    role:             string,
    requestingUserId: string,
    months:           number = 12,
    filterUserId?:    string,
  ): Promise<TrendPoint[]> {
    const userFilter = buildUserFilter(role, requestingUserId, filterUserId);
 
    const rows = await prisma.$queryRaw<TrendPoint[]>`
      SELECT
        user_id        AS "userId",
        period_start   AS "periodStart",
        period_label   AS "periodLabel",
        total_income   AS "totalIncome",
        total_expenses AS "totalExpenses",
        net_balance    AS "netBalance",
        record_count   AS "recordCount"
      FROM v_monthly_trends
      WHERE 1=1 ${userFilter}
      LIMIT ${months}
    `;
 
    return rows.map((r) => ({
      ...r,
      totalIncome:   Number(r.totalIncome),
      totalExpenses: Number(r.totalExpenses),
      netBalance:    Number(r.netBalance),
      recordCount:   Number(r.recordCount),
    }));
  },
 
 
  async getWeeklyTrends(
    role:             string,
    requestingUserId: string,
    weeks:            number = 12,
    filterUserId?:    string,
  ): Promise<TrendPoint[]> {
    const userFilter = buildUserFilter(role, requestingUserId, filterUserId);
 
    const rows = await prisma.$queryRaw<TrendPoint[]>`
      SELECT
        user_id        AS "userId",
        period_start   AS "periodStart",
        period_label   AS "periodLabel",
        total_income   AS "totalIncome",
        total_expenses AS "totalExpenses",
        net_balance    AS "netBalance",
        record_count   AS "recordCount"
      FROM v_weekly_trends
      WHERE 1=1 ${userFilter}
      LIMIT ${weeks}
    `;
 
    return rows.map((r) => ({
      ...r,
      totalIncome:   Number(r.totalIncome),
      totalExpenses: Number(r.totalExpenses),
      netBalance:    Number(r.netBalance),
      recordCount:   Number(r.recordCount),
    }));
  },
};