import {
  BudgetApiResponse,
  BudgetDates,
  BudgetDetail,
  BudgetPlan,
  BudgetsListApiResponse,
  BudgetsResponse,
} from "../models/budget.interface";
import { makeEverydollarApiRequest } from "../utils/auth";
import { formatDateForCsv } from "../utils/date";
import { parseBudgetResponse } from "./parse-budget";

/**
 * Use internal Everydollar API to fetch a list of budgets for user.
 */
export async function fetchBudgetList(): Promise<BudgetsResponse[]> {
  const response = await makeEverydollarApiRequest<BudgetsListApiResponse>("/budget/budgets", {
    method: "GET",
  });
  const json = await response.json();

  return json._embedded.budget.map((budget) => ({
    date: budget.date,
    id: budget._links.self.href.split(":").at(-1)!,
  }));
}

export async function fetchAllBudgets(budgets: BudgetsResponse[], budgetDates: BudgetDates) {
  if (!budgets.length) {
    throw new Error("Budgets list is empty");
  }
  const budgetDetail: { [date: string]: BudgetDetail[] } = {};
  const budgetPlan: BudgetPlan = {};

  const responses = await Promise.all(
    budgets.map(async (budget) => {
      return makeEverydollarApiRequest<BudgetApiResponse>(`/budget/budgets/${budget.id}`, {
        method: "GET",
      });
    })
  );
  const budgetApiResponses = await Promise.all(
    responses.map((response) => {
      return response.json();
    })
  );

  budgetApiResponses.forEach((response) => {
    const budgetGroups = parseBudgetResponse(response, budgetPlan, budgetDates);
    budgetDetail[response.date] = budgetGroups.detail;
  });

  return { budgetDetail, budgetPlan };
}

export function buildBudgetDates(budgets: BudgetsResponse[]) {
  const dates: BudgetDates = {};
  budgets.forEach((budget) => {
    const dateStr = formatDateForCsv(budget.date);
    dates[dateStr] = "";
  });
  return dates;
}
