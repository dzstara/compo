export interface Item<T extends any = null> {
  id: string;
  name: string;
  info: T;
}

export enum PreferenceValue {
  Yes,
  Maybe,
  No,
  Unknown,
}

export enum Strength {
  Strong,
  Weak,
}

export interface Preference {
  member: string;
  activity: string;
  value: PreferenceValue;
}

export interface Parameters {
  members: Item[];
  activities: Item<number>[];
  preferences: Preference[];
  exclusivities: string[][];
  inclusivities: string[][];
  fair: boolean;
}

export type Result = Item<number> & { participatingMembers: Item[] };
