import { SystemNoId, ValidationError } from "../types";

import { conflict_levels, factions } from "@/lib/lists";

import { economy } from "@/lib/maps";

import { econStrengthMap, econTypeMap } from "@/lib/maps";

type Submission = {
  name?: string;
  faction?: string;
  abandoned?: boolean | string;
  econDescriptor?: string;
  econType?: string;
  econState?: string;
  econStrength?: string;
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

  const sExosuit = submission.exosuit !== undefined ? submission.exosuit === "on" : false;

  const sV3 = submission.abandoned !== undefined ? submission.v3 === "on" : false;

  const sAtlas = submission.atlas !== undefined ? submission.atlas === "on" : false;

  const sBlackhole = submission.blackhole !== undefined ? submission.blackhole === "on" : false;

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
