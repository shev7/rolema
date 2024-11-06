import { CookieStore } from "@repo/types";
import { CookieOptions } from "express";

type OnSet = (
  name: string,
  value: string,
  options?: Partial<CookieOptions>,
) => void;

export class FakeCookieStore implements CookieStore {
  private name: string;
  private value: string;
  private onSet?: OnSet;

  constructor(name: string, value: string, onSet?: OnSet) {
    this.name = name;
    this.value = value;
    this.onSet = onSet;
  }

  set(name: string, value: string, options?: Partial<CookieOptions>) {
    this.onSet?.(name, value, options);
  }

  get() {
    return {
      name: this.name,
      value: this.value,
    };
  }
}

export const createCookieStore = (name: string, value: string, onSet?: OnSet) =>
  new FakeCookieStore(name, value, onSet);
