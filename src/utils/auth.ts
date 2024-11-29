import { CookieJar } from "tough-cookie";

export const EVERYDOLLAR_APP_API_BASE_URL = "https://www.everydollar.com/app/api";

export const makeAuthorizationHeader = (token: string) => `Bearer ${token}`;

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

const cookieJar = new CookieJar();
if (!process.env.SESSION) {
  throw new Error("SESSION not found");
}
cookieJar.setCookieSync(`SESSION=${process.env.SESSION}; Path=/app; Secure; HttpOnly;`, "https://www.everydollar.com");

export const makeEverydollarApiRequest = async <T>(path: string, options: RequestInit): Promise<TypedResponse<T>> => {
  const url = `${EVERYDOLLAR_APP_API_BASE_URL}${path}`;
  const headers = {
    ...options.headers,
    Cookie: cookieJar
      .getCookiesSync(url)
      .map((cookie) => cookie.toString())
      .join("; "),
  };
  const response = await fetch(url, {
    ...options,
    headers,
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
