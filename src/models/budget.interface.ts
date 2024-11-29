export interface BudgetsListApiResponse {
  budgetExistence: {
    [year: string]: {
      [month: string]: string;
    };
  };
}

export interface BudgetsResponse {
  /**
   * @description A year-month-day formatted date string. Day is always 01
   * @example 2024-12-01
   */
  date: string;
  /**
   * @description The id of the budget in UUID form
   */
  id: string;
}

interface BudgetAllocation {
  amount: number;
  date: string;
  label: string;
  merchant: string;
  /**
   * @description Indicates whether a transaction was split or not
   */
  whole: boolean;
}

type BudgetCategoryType = "income" | "expense" | "sinking_fund" | "debt";

interface BudgetCategory {
  amountBudgeted: number;
  label: string;
  note?: string;
  type: BudgetCategoryType;
  allocations: BudgetAllocation[];
}

interface BudgetCategoryIncome extends BudgetCategory {
  type: "income";
}

interface BudgetCategoryExpense extends BudgetCategory {
  type: "expense";
}

interface BudgetCategoryFund extends BudgetCategory {
  type: "sinking_fund";
  carryOverBalance: number;
  originalStartingBalance: number;
}

interface BudgetCategoryDebt extends BudgetCategory {
  type: "debt";
  carryOverBalance: number;
  originalStartingBalance: number;
}

type BudgetGroupType = "income" | "expense" | "debt";

interface BudgetGroup {
  label: string;
  type: BudgetGroupType;
  budgetItems: Array<BudgetCategoryDebt | BudgetCategoryExpense | BudgetCategoryFund | BudgetCategoryIncome>;
}

interface BudgetGroupIncome extends BudgetGroup {
  type: "income";
  budgetItems: BudgetCategoryIncome[];
}

interface BudgetGroupExpense extends BudgetGroup {
  type: "expense";
  budgetItems: Array<BudgetCategoryExpense | BudgetCategoryFund>;
}

interface BudgetGroupDebt extends BudgetGroup {
  type: "debt";
  budgetItems: BudgetCategoryDebt[];
}

export interface BudgetApiResponse {
  id: string;
  date: string;
  groups: Array<BudgetGroupDebt | BudgetGroupExpense | BudgetGroupIncome>;
}

export interface BudgetDetail {
  group: string;
  category: string;
  groupType: BudgetGroupType;
  categoryType: BudgetCategoryType;
  startingBalance: number;
  amountBudgeted: number;
  amountTracked: number;
  amountRemaining: number;
  note: string;
}

export interface BudgetDates {
  [date: string]: string;
}

export interface BudgetPlan {
  [group: string]: {
    categories: {
      [category: string]: {
        dates: BudgetDates;
        track: "Savings" | "Debt" | "";
        type: "Income" | "Expense";
      };
    };
  };
}
