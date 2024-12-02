import { Account } from "../models/account.interface";
import { BudgetDates, PlanByItemId } from "../models/budget.interface";
import { FindByDateRangeResponse } from "../models/transaction.interface";
import { makeEverydollarApiRequest } from "../utils/auth";
import { formatDateForUrlSearchParams } from "../utils/date";

export async function fetchAllTransactionsAndPlans(budgetDates: BudgetDates) {
  const responsesByDateRange = await Promise.all(
    Object.keys(budgetDates).map(async (date) => {
      const startDate = new Date(date);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

      const urlSearchParams = new URLSearchParams();
      urlSearchParams.append("startDate", formatDateForUrlSearchParams(startDate));
      urlSearchParams.append("endDate", formatDateForUrlSearchParams(endDate));

      return makeEverydollarApiRequest<FindByDateRangeResponse>(
        `/transactions/search/findByDateRange?${urlSearchParams.toString()}`,
        { method: "GET" }
      );
    })
  );
  const transactionApiResponses = await Promise.all(responsesByDateRange.map((response) => response.json()));
  return transactionApiResponses;
}

export function parseTransactionResponses(
  responses: FindByDateRangeResponse[],
  accounts: Account[],
  budgetByCategoryId: PlanByItemId
) {
  const accountsById: Record<string, Omit<Account, "id">> = {};
  accounts.reduce((acc, { id, ...account }) => {
    acc[id] = account;
    return acc;
  }, accountsById);

  return responses.flatMap((response) => {
    return response.transactions.flatMap((transaction) => {
      const accountId = transaction.financialAccountId?.replace("fn", "");
      const transactionBase = {
        account: accountId ? accountsById[accountId]?.account : "",
        amount: transaction.amount / 100,
        date: transaction.date,
        deletedAt: transaction.deletedAt,
        description: transaction.description,
        id: transaction.id,
        institution: accountId ? accountsById[accountId]?.institution : "",
        merchant: transaction.merchant,
        note: transaction.note,
      };

      if (transaction.allocations.length <= 1) {
        const allocation = transaction.allocations[0];
        const id = allocation?.budgetItemId?.split(":")?.at(-1);
        const plan = id ? budgetByCategoryId[id] : "";
        return {
          ...transactionBase,
          budgetDate: plan ? plan.date : "",
          category: plan ? plan.categoryLabel : "",
          group: plan ? plan.groupLabel : "",
        };
      } else {
        return transaction.allocations.map((allocation, idx) => {
          const id = allocation.budgetItemId.split(":").at(-1);
          const plan = id ? budgetByCategoryId[id] : "";
          return {
            ...transactionBase,
            id: `split:${transaction.id}[${idx + 1}]`,
            splitAmount: allocation.amount / 100,
            budgetDate: plan ? plan.date : "",
            category: plan ? plan.categoryLabel : "",
            group: plan ? plan.groupLabel : "",
          };
        });
      }
    });
  });
}
