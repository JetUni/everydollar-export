export function formatDateForCsv(budgetDate: string) {
  const date = new Date();
  date.setDate(1);
  const [year, month] = budgetDate.split("-");
  date.setMonth(parseInt(month, 10) - 1);
  const dateStr = `${date.toLocaleString("en-us", { month: "short" })} ${year}`;
  return dateStr;
}
