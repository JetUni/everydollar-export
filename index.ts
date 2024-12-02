import dotenv from "dotenv";
dotenv.config();

import { fetchAccounts } from "./src/app/account";
import { buildBudgetDates, fetchAllBudgets, fetchBudgetList } from "./src/app/budget";
import { budgetPlanToCsv, budgetsToCsv } from "./src/app/budget-to-csv";
import { fetchAllTransactionsAndPlans, parseTransactionResponses } from "./src/app/transaction";
import { transactionToCsv } from "./src/app/transaction-to-csv";

async function main() {
  try {
    const budgetList = await fetchBudgetList();
    const budgetDates = buildBudgetDates(budgetList);
    const { budgetDetail, budgetPlan, budgetByCategoryId } = await fetchAllBudgets(budgetList, budgetDates);

    const accounts = await fetchAccounts();
    const transactionsResponse = await fetchAllTransactionsAndPlans(budgetDates);
    const transactions = parseTransactionResponses(transactionsResponse, accounts, budgetByCategoryId);

    budgetsToCsv(budgetDetail);
    budgetPlanToCsv(budgetPlan, budgetDates);
    transactionToCsv(transactions);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().then(() => {
  console.log("Finished");
});
