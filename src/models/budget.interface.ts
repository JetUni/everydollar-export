export interface BudgetsListApiResponse {
  _embedded: {
    budget: {
      /**
       * @description A year-month-day formatted date string. Day is always 01
       * @example 2024-12-01
       */
      date: string;
      _links: {
        self: {
          /**
           * @description An urn formatted string
           * @example "urn:everydollar:budget:12345678-9012-3456-7890-123456789012"
           */
          href: string;
        };
      };
    }[];
  };
}

export type BudgetsListApiBudget = BudgetsListApiResponse["_embedded"]["budget"][0];

export interface BudgetsResponse extends Pick<BudgetsListApiBudget, "date"> {
  /**
   * @description The id of the budget in UUID form
   */
  id: string;
}

type Currency = "usd" | string;

interface BudgetAllocation {
  amount: { [key: Currency]: number };
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
  amount_budgeted: { [key: Currency]: number };
  label: string;
  note?: string;
  type: BudgetCategoryType;
  _embedded: {
    allocation: BudgetAllocation[];
  };
}

interface BudgetCategoryIncome extends BudgetCategory {
  type: "income";
}

interface BudgetCategoryExpense extends BudgetCategory {
  type: "expense";
}

interface BudgetCategoryFund extends BudgetCategory {
  type: "sinking_fund";
  starting_balance: { [key: Currency]: number };
}

interface BudgetCategoryDebt extends BudgetCategory {
  type: "debt";
  starting_balance: { [key: Currency]: number };
}

type BudgetGroupType = "income" | "expense" | "debt";

interface BudgetGroup {
  label: string;
  type: BudgetGroupType;
  _embedded: {
    "budget-item": Array<BudgetCategoryDebt | BudgetCategoryExpense | BudgetCategoryFund | BudgetCategoryIncome>;
  };
}

interface BudgetGroupIncome extends BudgetGroup {
  type: "income";
  _embedded: {
    "budget-item": BudgetCategoryIncome[];
  };
}

interface BudgetGroupExpense extends BudgetGroup {
  type: "expense";
  _embedded: {
    "budget-item": Array<BudgetCategoryExpense | BudgetCategoryFund>;
  };
}

interface BudgetGroupDebt extends BudgetGroup {
  type: "debt";
  _embedded: {
    "budget-item": BudgetCategoryDebt[];
  };
}

export interface BudgetApiResponse {
  currency: Currency;
  date: string;
  _embedded: {
    "budget-group": Array<BudgetGroupDebt | BudgetGroupExpense | BudgetGroupIncome>;
  };
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
