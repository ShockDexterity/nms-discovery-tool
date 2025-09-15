import { SystemNoId, ValidationError } from "../types";

import { conflict_levels, factions } from "@/lib/lists";

import { economy } from "@/lib/maps";

import { econStrengthMap, econTypeMap } from "@/lib/maps";

type Submission = {
  name?: string;
  faction?: string;
  abandoned?: boolean | string;
  econDescriptor?: string;
  econState?: string;
  conflict?: string;
  exosuit?: boolean | string;
  v3?: boolean | string;
  atlas?: boolean | string;
  blackhole?: boolean | string;
};

export function validate_system(submission: Submission): { validSystem?: SystemNoId; warning?: string } {
  if (Object.keys(submission).length === 0) {
    throw new ValidationError("No information provided", 400);
  }

  let warning = "";

  if (!submission.name) {
    throw new ValidationError("No system name provided", 400);
  }
  const sName = submission.name;

  if (!submission.faction) {
    throw new ValidationError("No faction provided", 400);
  } else if (!factions.includes(submission.faction)) {
    throw new ValidationError("Invalid system faction", 400);
  }
  const sFaction = submission.faction;

  const goodAbandonedOptions = ["yes", "abandoned", "true", "on", true];
  const badAbandonedOptions = ["no", "off", "false", false];
  if (submission.abandoned && typeof submission.abandoned === "string") {
    const options = [...goodAbandonedOptions, ...badAbandonedOptions].filter((value) => typeof value === "string");
    if (!options.includes(submission.abandoned)) {
      throw new ValidationError(`An "abandoned" string must be: ${options.join(" ")}`, 400);
    }
  }
  const sAbandoned = submission.abandoned !== undefined ? goodAbandonedOptions.includes(submission.abandoned) : false;

  if (!submission.econDescriptor) {
    throw new ValidationError("No economy type descriptor provided", 400);
  } else if (!economy.descriptors.includes(submission.econDescriptor)) {
    throw new ValidationError("Invalid economy type descriptor", 400);
  }
  const sEconDescriptor = submission.econDescriptor;

  const sEconType = econTypeMap[submission.econDescriptor];

  if (!submission.econState) {
    throw new ValidationError("No economy state provided", 400);
  } else if (!economy.states.includes(submission.econState)) {
    throw new ValidationError("Invalid economy state", 400);
  }
  const sEconState = submission.econState;

  const sEconStrength = econStrengthMap[sEconState];

  if (!submission.conflict) {
    throw new ValidationError("Must provide system conflict level", 400);
  } else if (!conflict_levels.includes(submission.conflict)) {
    throw new ValidationError("Invalid system conflict level", 400);
  }
  const sConflict = submission.conflict;

  let sExosuit;
  if (submission.exosuit === undefined) {
    sExosuit = false;
  } else if (typeof submission.exosuit === "boolean") {
    sExosuit = submission.exosuit;
  } else {
    sExosuit = submission.exosuit === "on";
  }

  let sV3;
  if (submission.v3 === undefined) {
    sV3 = false;
  } else if (typeof submission.v3 === "boolean") {
    sV3 = submission.v3;
  } else {
    sV3 = submission.v3 === "on";
  }

  let sAtlas;
  if (submission.atlas === undefined) {
    sAtlas = false;
  } else if (typeof submission.atlas === "boolean") {
    sAtlas = submission.atlas;
  } else {
    sAtlas = submission.atlas === "on";
  }

  let sBlackhole;
  if (submission.blackhole === undefined) {
    sBlackhole = false;
  } else if (typeof submission.blackhole === "boolean") {
    sBlackhole = submission.blackhole;
  } else {
    sBlackhole = submission.blackhole === "on";
  }

  const returnSystem: SystemNoId = {
    name: sName,
    faction: sFaction,
    abandoned: sAbandoned,
    economy: {
      descriptor: sEconDescriptor,
      type: sEconType,
      state: sEconState,
      strength: sEconStrength,
    },
    conflict: sConflict,
    exosuit: sExosuit,
    v3: sV3,
    atlas: sAtlas,
    blackhole: sBlackhole,
  };

  if (warning && warning !== "") {
    return { warning: warning.trim(), validSystem: returnSystem };
  }

  return { validSystem: returnSystem };
}
