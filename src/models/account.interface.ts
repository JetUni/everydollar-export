export interface AccountListResponse {
  balance: number;
  id: string;
  last4: string;
  name: string;
  vendorId: string;
}

export interface AccountsResponse {
  accounts: AccountListResponse[];
  id: string;
  name: string;
}

export interface Account {
  account: string;
  id: string;
  institution: string;
}
