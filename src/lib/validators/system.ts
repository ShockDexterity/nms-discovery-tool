import { SystemNoId, ValidationError } from "../types";

import { conflict_levels, factions, guilds } from "@/lib/lists";

import { economy } from "@/lib/maps";

import { econStrengthMap, econTypeMap } from "@/lib/maps";

type Submission = {
  name?: string;
  faction?: string;
  guild?: string;
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
  const valid_name = submission.name;

  if (!submission.faction) {
    throw new ValidationError("No faction provided", 400);
  } else if (!factions.includes(submission.faction)) {
    throw new ValidationError("Invalid system faction", 400);
  }
  const valid_faction = submission.faction;

  if (!submission.guild) {
    throw new ValidationError("No guild provided", 400);
  } else if (!guilds.includes(submission.guild)) {
    throw new ValidationError("Invalid system guild", 400);
  }
  const valid_guild = submission.guild;

  const goodAbandonedOptions = ["yes", "abandoned", "true", "on", true];
  const badAbandonedOptions = ["no", "off", "false", false];
  if (submission.abandoned && typeof submission.abandoned === "string") {
    const options = [...goodAbandonedOptions, ...badAbandonedOptions].filter((value) => typeof value === "string");
    if (!options.includes(submission.abandoned)) {
      throw new ValidationError(`An "abandoned" string must be: ${options.join(" ")}`, 400);
    }
  }
  const valid_abandoned =
    submission.abandoned !== undefined ? goodAbandonedOptions.includes(submission.abandoned) : false;

  if (!submission.econDescriptor) {
    throw new ValidationError("No economy type descriptor provided", 400);
  } else if (!economy.descriptors.includes(submission.econDescriptor)) {
    throw new ValidationError("Invalid economy type descriptor", 400);
  }
  const valid_econ_descriptor = submission.econDescriptor;

  const valid_econ_type = econTypeMap[submission.econDescriptor];

  if (!submission.econState) {
    throw new ValidationError("No economy state provided", 400);
  } else if (!economy.states.includes(submission.econState)) {
    throw new ValidationError("Invalid economy state", 400);
  }
  const valid_econ_state = submission.econState;

  const valid_econ_strength = econStrengthMap[valid_econ_state];

  if (!submission.conflict) {
    throw new ValidationError("Must provide system conflict level", 400);
  } else if (!conflict_levels.includes(submission.conflict)) {
    throw new ValidationError("Invalid system conflict level", 400);
  }
  const valid_conflict = submission.conflict;

  let valid_exosuit;
  if (submission.exosuit === undefined) {
    valid_exosuit = false;
  } else if (typeof submission.exosuit === "boolean") {
    valid_exosuit = submission.exosuit;
  } else {
    valid_exosuit = submission.exosuit === "on";
  }

  let valid_v3;
  if (submission.v3 === undefined) {
    valid_v3 = false;
  } else if (typeof submission.v3 === "boolean") {
    valid_v3 = submission.v3;
  } else {
    valid_v3 = submission.v3 === "on";
  }

  let valid_atlas;
  if (submission.atlas === undefined) {
    valid_atlas = false;
  } else if (typeof submission.atlas === "boolean") {
    valid_atlas = submission.atlas;
  } else {
    valid_atlas = submission.atlas === "on";
  }

  let valid_blackhole;
  if (submission.blackhole === undefined) {
    valid_blackhole = false;
  } else if (typeof submission.blackhole === "boolean") {
    valid_blackhole = submission.blackhole;
  } else {
    valid_blackhole = submission.blackhole === "on";
  }

  const return_system: SystemNoId = {
    name: valid_name,
    faction: valid_faction,
    guild: valid_guild,
    abandoned: valid_abandoned,
    economy: {
      descriptor: valid_econ_descriptor,
      type: valid_econ_type,
      state: valid_econ_state,
      strength: valid_econ_strength,
    },
    conflict: valid_conflict,
    exosuit: valid_exosuit,
    v3: valid_v3,
    atlas: valid_atlas,
    blackhole: valid_blackhole,
  };

  if (warning && warning !== "") {
    return { warning: warning.trim(), validSystem: return_system };
  }

  return { validSystem: return_system };
}
