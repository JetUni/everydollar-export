import { BudgetDates, BudgetDetail, BudgetPlan } from "../models/budget.interface";
import { saveFile } from "../utils/fs";

export function budgetPlanToCsv(budgetPlan: BudgetPlan, dates: BudgetDates) {
  const header =
    "Category,Category Sort Order,Group,Group Sort Order,Track,Type,Hide From Reports," +
    Object.keys(dates).join(",") +
    "\n";
  const rows = Object.entries(budgetPlan)
    .map(([groupName, group], groupIdx) => {
      return Object.entries(group.categories)
        .map(([categoryName, category], categoryIdx) => {
          const { track, type } = category;
          const dateCols = Object.values(category.dates).join(",");
          return `${categoryName},${categoryIdx + 1},${groupName},${groupIdx + 1},${track},${type},,` + dateCols;
        })
        .join("\n");
    })
    .join("\n");

  const filename = "Everydollar Budget Plan.csv";
  const data = header + rows;
  saveFile(filename, data);
}

export function budgetToCsv(budget: BudgetDetail[]): string {
  const header =
    "Category,Category Type,Group,Group Type,Starting Balance,Amount Budgeted,Amount Tracked,Amount Remaining,Note";
  const rows = budget.map((detail) => {
    const {
      category,
      categoryType,
      group,
      groupType,
      startingBalance,
      amountBudgeted,
      amountTracked,
      amountRemaining,
      note,
    } = detail;
    return `${category},${categoryType},${group},${groupType},${startingBalance},${amountBudgeted},${amountTracked},${amountRemaining},"${note}"`;
  });
  return header + "\n" + rows.join("\n");
}

export function budgetsToCsv(budgets: { [date: string]: BudgetDetail[] }) {
  Object.entries(budgets).forEach(([date, budget]) => {
    const filename = `Everydollar Budget ${date}.csv`;
    const data = budgetToCsv(budget);
    saveFile(filename, data);
  });
}
