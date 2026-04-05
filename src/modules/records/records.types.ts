import { RecordType, UserRole } from '@prisma/client';

export interface FinancialRecordDetail {
  id:            string;
  amount:        number;
  type:          RecordType;
  date:          Date;
  notes:         string | null;
  createdAt:     Date;
  updatedAt:     Date;
  categoryId:    string;
  categoryName:  string;
  categoryColor: string | null;
  categoryIcon:  string | null;
  userId:        string;
  userName:      string;
  userEmail:     string;
  userRole:      UserRole;
}