import { BudgetApiResponse, BudgetDates, BudgetDetail, BudgetPlan } from "../models/budget.interface";
import { formatDateForCsv } from "../utils/date";

export function parseBudgetResponse(
  budget: BudgetApiResponse,
  budgetPlan: BudgetPlan,
  budgetDates: BudgetDates
): { detail: BudgetDetail[]; plan: BudgetPlan } {
  const currency = budget.currency;
  const dateStr = formatDateForCsv(budget.date);

  return budget._embedded["budget-group"].reduce<{ detail: BudgetDetail[]; plan: BudgetPlan }>(
    (acc, group) => {
      const details = group._embedded["budget-item"].map<BudgetDetail>((category) => {
        let startingBalance = 0,
          amountBudgeted,
          amountTracked,
          amountRemaining;

        if ("starting_balance" in category) {
          startingBalance = category.starting_balance[currency];
        }
        amountBudgeted = category.amount_budgeted[currency];
        amountTracked = category._embedded.allocation.reduce((sum, allocation) => {
          sum += allocation.amount[currency];
          return sum;
        }, 0);
        if (category.type === "income") {
          amountRemaining = startingBalance + amountBudgeted - amountTracked;
        } else if (category.type === "debt") {
          amountRemaining = startingBalance + amountBudgeted + (amountBudgeted + amountTracked);
        } else {
          amountRemaining = startingBalance + amountBudgeted + amountTracked;
        }

        if (!acc.plan[group.label]) {
          acc.plan[group.label] = { categories: {} };
        }
        if (!acc.plan[group.label].categories[category.label]) {
          acc.plan[group.label].categories[category.label] = {
            dates: { ...budgetDates },
            track: "",
            type: category.type === "income" ? "Income" : "Expense",
          };
        }
        const track = category.type === "sinking_fund" ? "Savings" : category.type === "debt" ? "Debt" : "";
        acc.plan[group.label].categories[category.label].dates[dateStr] = `${amountBudgeted / 100}`;
        acc.plan[group.label].categories[category.label].track = track;

        return {
          group: group.label,
          category: category.label,
          groupType: group.type,
          categoryType: category.type,
          startingBalance: startingBalance / 100,
          amountBudgeted: amountBudgeted / 100,
          amountTracked: amountTracked / 100,
          amountRemaining: amountRemaining / 100,
          note: category.note || "",
        };
      });
      acc.detail.push(...details);

      return acc;
    },
    { detail: [], plan: budgetPlan }
  );
}
