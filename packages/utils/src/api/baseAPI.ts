import { Body } from "@repo/types";

type BaseAPIOptions = RequestInit & {
  baseURL: string;
  cookies?(): string;
};

export class BaseAPI {
  private baseURL: string;
  private defaults: RequestInit;
  private cookies?(): string;

  constructor({ baseURL, cookies, ...options }: BaseAPIOptions) {
    this.baseURL = baseURL;
    this.defaults = options;
    this.cookies = cookies;
  }

  private async handleRequest<T>(
    url: string,
    { headers, ...options }: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...this.defaults,
      ...options,
      headers: {
        "Content-Type": "application/json",
        Cookie: this.cookies?.() ?? "",
        ...headers,
      },
    });

    const body = (await response.json()) as Body<T>;

    if (!response.ok && body.error) {
      throw new Error(
        // `${body.error.message || "Something went wrong."} ${process.env.ENV === "development" ? `${options.method} ${this.baseURL}${url}` : ""}`,
        body.error.message || "Something went wrong.",
      );
    }

    return body.data;
  }

  get<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.handleRequest<T>(url, {
      ...options,
      method: "GET",
    });
  }

  post<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    return this.handleRequest<T>(url, {
      ...options,
      body: JSON.stringify(data),
      method: "POST",
    });
  }

  put<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    return this.handleRequest<T>(url, {
      ...options,
      body: JSON.stringify(data),
      method: "PUT",
    });
  }

  patch<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    return this.handleRequest<T>(url, {
      ...options,
      body: JSON.stringify(data),
      method: "PATCH",
    });
  }

  delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.handleRequest<T>(url, {
      ...options,
      method: "DELETE",
    });
  }
}
