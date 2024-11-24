import dotenv from "dotenv";
import { buildBudgetDates, fetchAllBudgets, fetchBudgetList } from "./src/app/budget";
import { budgetPlanToCsv, budgetsToCsv } from "./src/app/budget-to-csv";

dotenv.config();

async function main() {
  try {
    const budgetList = await fetchBudgetList();

    const budgetDates = buildBudgetDates(budgetList);

    const { budgetDetail, budgetPlan } = await fetchAllBudgets(budgetList, budgetDates);

    budgetsToCsv(budgetDetail);

    budgetPlanToCsv(budgetPlan, budgetDates);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().then(() => {
  console.log("Finished");
});
