export const EVERYDOLLAR_API_BASE_URL = "https://api.everydollar.com";

export const makeAuthorizationHeader = (token: string) => `Bearer ${token}`;

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

export const makeEverydollarApiRequest = async <T>(path: string, options: RequestInit): Promise<TypedResponse<T>> => {
  const userToken = process.env.EVERYDOLLAR_USER_TOKEN;

  if (!userToken) {
    throw new Error("User Token not found");
  }

  const url = `${EVERYDOLLAR_API_BASE_URL}${path}`;
  const Authorization = `Bearer ${userToken}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error(response.statusText);
      process.exit(1);
    }

    throw new Error(`Request failed with status ${response.status}`);
  }

  return response as TypedResponse<T>;
};
