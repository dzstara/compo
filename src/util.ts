import { Item } from "./types";

export function id<T>(...items: Item<T>[]): string {
  return items.map((i) => i.id).join("/");
}

export function resize<T>(arr: T[], newSize: number, defaultValue: T) {
  if (arr.length === newSize) return arr;
  if (arr.length > newSize) return arr.slice(0, newSize);

  return [
    ...arr,
    ...Array({ length: newSize - arr.length }).map(() => clone(defaultValue)),
  ];
}

export function toggle<T>(arr: T[], value: T, state: boolean) {
  if (state) return [...arr, value];
  return arr.filter((i) => i !== value);
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
