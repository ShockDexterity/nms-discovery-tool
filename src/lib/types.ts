export type Planet = {
  _id: string;
  name: string;
  system: string;
  descriptor: string;
  sentinels: "low" | "high" | "aggressive" | "corrupt";
  moon: boolean;
  resources: {
    agricultural: string;
    stellar: string;
    local: string;
    general: string;
  };
  biome: string;
  exotic: boolean;
  extreme: boolean;
  infested: boolean;
  base: boolean;
  base_name: string;
};

export type PlanetNoId = {
  name: string;
  system: string;
  descriptor: string;
  sentinels: "low" | "high" | "aggressive" | "corrupt";
  moon: boolean;
  resources: {
    agricultural: string;
    stellar: string;
    local: string;
    general: string;
  };
  biome: string;
  exotic: boolean;
  extreme: boolean;
  infested: boolean;
  base: boolean;
  base_name: string;
};

export type System = {
  _id: string;
  name: string;
  faction: string;
  abandoned: boolean;
  economy: {
    descriptor: string;
    type: string;
    state: string;
    strength: string;
  };
  conflict: string;
  exosuit: boolean;
  v3: boolean;
  atlas: boolean;
  blackhole: boolean;
};

export type SystemNoId = {
  name: string;
  faction: string;
  abandoned: boolean;
  economy: {
    descriptor: string;
    type: string;
    state: string;
    strength: string;
  };
  conflict: string;
  exosuit: boolean;
  v3: boolean;
  atlas: boolean;
  blackhole: boolean;
};

export class ValidationError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}
