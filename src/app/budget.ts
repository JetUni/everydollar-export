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
  const response = await makeEverydollarApiRequest<BudgetsListApiResponse>("/budgets", {
    method: "GET",
  });
  const json = await response.json();

  const budgetExistence = json.budgetExistence;
  const years = Object.keys(budgetExistence).sort();

  return years.flatMap((year) => {
    const months = Object.keys(budgetExistence[year]);
    return months.map((month) => ({ date: `${year}-${month.padStart(2, "0")}-01`, id: budgetExistence[year][month] }));
  });
}

export async function fetchAllBudgets(budgets: BudgetsResponse[], budgetDates: BudgetDates) {
  if (!budgets.length) {
    throw new Error("Budgets list is empty");
  }
  const budgetDetail: { [date: string]: BudgetDetail[] } = {};
  const budgetPlan: BudgetPlan = {};

  const responses = await Promise.all(
    budgets.map(async (budget) => {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.append("date", budget.date);
      return makeEverydollarApiRequest<BudgetApiResponse>(
        `/budgets/search/getBudgetByDate?${urlSearchParams.toString()}`,
        {
          method: "GET",
        }
      );
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
