import { Account, AccountListResponse, AccountsResponse } from "../models/account.interface";
import { makeEverydollarApiRequest } from "../utils/auth";

export async function fetchAccounts(): Promise<Account[]> {
  const response = await makeEverydollarApiRequest<AccountsResponse[]>("/accounts", { method: "GET" });
  const json = await response.json();

  return json.flatMap((institution: AccountsResponse) => {
    return institution.accounts.map((account: AccountListResponse) => ({
      account: account.name,
      id: account.vendorId,
      institution: institution.name,
    }));
  });
}
