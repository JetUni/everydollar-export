interface TransactionAllocation {
  amount: number;
  budgetId: string;
  budgetItemId: string;
  date: string;
  id: string;
  label: string;
  merchant: string;
  whole: boolean;
}

interface TransactionListResponse {
  allocations: TransactionAllocation[];
  amount: number;
  date: string;
  deletedAt: string | null;
  description: string | null;
  financialAccountId: string | null;
  id: string;
  merchant: string;
  note: string | null;
}

export interface FindByDateRangeResponse {
  startDate: string;
  endDate: string;
  transactions: TransactionListResponse[];
}

export interface Transaction {
  budgetDate: string;
  category: string;
  group: string;
  account: string | null;
  amount: number;
  date: string;
  deletedAt: string | null;
  description: string | null;
  id: string;
  institution: string | null;
  merchant: string;
  note: string | null;
  splitAmount?: number;
}
