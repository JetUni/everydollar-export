import { Transaction } from "../models/transaction.interface";
import { saveFile } from "../utils/fs";

export function transactionToCsv(transactions: Transaction[]) {
  const header =
    "Date,Description,Group,Category,Amount,Split Amount,Account,Institution,Transaction ID,Full Description,Budget Date,Note";
  const rows = transactions.map((transaction) => {
    const {
      account,
      amount,
      budgetDate,
      category,
      date,
      description,
      group,
      id,
      institution,
      merchant,
      note,
      splitAmount,
    } = transaction;
    return `${date},"${merchant ?? ""}",${group},${category},${amount},${splitAmount ?? ""},${account ?? ""},${
      institution ?? ""
    },${id},"${description ?? ""}",${budgetDate},"${note ?? ""}"`;
  });

  const filename = "Everydollar Transactions.csv";
  const data = header + "\n" + rows.join("\n");
  saveFile(filename, data);
}
