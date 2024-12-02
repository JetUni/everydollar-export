export function formatDateForCsv(budgetDate: string) {
  const date = new Date();
  date.setDate(1);
  const [year, month] = budgetDate.split("-");
  date.setMonth(parseInt(month, 10) - 1);
  const dateStr = `${date.toLocaleString("en-us", { month: "short" })} ${year}`;
  return dateStr;
}

export function formatDateForUrlSearchParams(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
