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

  const goodExosuitOptions = ["yes", "exosuit", "true", "on", true];
  const badExosuitOptions = ["no", "off", "false", false];
  if (submission.exosuit && typeof submission.exosuit === "string") {
    const options = [...goodExosuitOptions, ...badExosuitOptions].filter((value) => typeof value === "string");
    if (!options.includes(submission.exosuit)) {
      throw new ValidationError(`An "exosuit" string must be: ${options.join(" ")}`, 400);
    }
  }
  const sExosuit = submission.exosuit !== undefined ? goodExosuitOptions.includes(submission.exosuit) : false;

  const goodV3Options = ["yes", "v3", "true", "on", true];
  const badV3Options = ["no", "off", "false", false];
  if (submission.v3 && typeof submission.v3 === "string") {
    const options = [...goodV3Options, ...badV3Options].filter((value) => typeof value === "string");
    if (!options.includes(submission.v3)) {
      throw new ValidationError(`A "v3" string must be: ${options.join(" ")}`, 400);
    }
  }
  const sV3 = submission.abandoned !== undefined ? goodV3Options.includes(submission.abandoned) : false;

  const goodAtlasOptions = ["yes", "atlas", "true", "on", true];
  const badAtlasOptions = ["no", "off", "false", false];
  if (submission.atlas && typeof submission.atlas === "string") {
    const options = [...goodAtlasOptions, ...badAtlasOptions].filter((value) => typeof value === "string");
    if (!options.includes(submission.atlas)) {
      throw new ValidationError(`An "abandoned" string must be: ${options.join(" ")}`, 400);
    }
  }
  const sAtlas = submission.atlas !== undefined ? goodAtlasOptions.includes(submission.atlas) : false;

  const goodBlackHoleOptions = ["yes", "blackhole", "true", "on", true];
  const badBlackHoleOptions = ["no", "off", "false", false];
  if (submission.blackhole && typeof submission.blackhole === "string") {
    const options = [...goodBlackHoleOptions, ...badBlackHoleOptions].filter((value) => typeof value === "string");
    if (!options.includes(submission.blackhole.toLowerCase())) {
      throw new ValidationError(`An "abandoned" string must be: ${options.join(" ")}`, 400);
    }
  }
  const sBlackhole = submission.blackhole !== undefined ? goodBlackHoleOptions.includes(submission.blackhole) : false;

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

function getEconTypeEdit(descriptor: string, type: string): { econType: string; note?: string } {
  if (econTypeMap[descriptor] !== type) {
    return {
      econType: econTypeMap[descriptor],
      note: `${type} did not match descriptor ${descriptor}, overwritten`,
    };
  }
  return { econType: type };
}

function getEconStrengthEdit(state: string, strength: string): { econStrength: string; note?: string } {
  if (econStrengthMap[state] !== strength) {
    return {
      econStrength: econStrengthMap[state],
      note: `${strength} did not match state ${state}, overwritten`,
    };
  }
  return { econStrength: strength };
}
