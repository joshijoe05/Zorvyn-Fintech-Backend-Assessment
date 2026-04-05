import { RecordType } from "@prisma/client";

export interface FinancialSummary {
  userId:        string;
  userName:      string;
  userEmail:     string;
  totalIncome:   number;
  totalExpenses: number;
  netBalance:    number;
  recordCount:   number;
}
 
export interface CategoryTotal {
  userId:        string;
  categoryId:    string;
  categoryName:  string;
  categoryColor: string | null;
  categoryIcon:  string | null;
  type:          RecordType | null;
  total:         number;
  recordCount:   number;
}
 
export interface TrendPoint {
  userId:        string;
  periodStart:   Date;
  periodLabel:   string;
  totalIncome:   number;
  totalExpenses: number;
  netBalance:    number;
  recordCount:   number;
}