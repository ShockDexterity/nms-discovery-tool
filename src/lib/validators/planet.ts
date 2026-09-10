import { PlanetNoId, ValidationError } from "@/lib/types";

import { biome_descriptors, biomes, exotic_biomes } from "@/lib/lists";

import {
  resources,
  biomeAgriculturalResourceMap,
  biomeDescriptorMap,
  infestedAgriculturalResourceMap,
  resourceBiomeMap,
  biomeWeatherMap,
} from "@/lib/maps";

type Submission = {
  name?: string;
  system?: string;
  descriptor?: string;
  biome?: string;
  weather?: string;
  moon?: string | boolean;
  agricultural?: string;
  stellar?: string;
  local?: string;
  general?: string;
  sentinels?: string;
  base?: boolean;
  base_name?: string;
};

export function validate_planet(
  submission: Submission,
  edit: boolean = false,
): {
  valid_planet?: PlanetNoId;
  warning?: string;
} {
  if (Object.keys(submission).length === 0) {
    throw new ValidationError("No information provided", 400);
  }

  let warning = null;

  if (!submission.name) {
    throw new ValidationError("Planet name is required", 400);
  }
  const valid_name = submission.name;

  if (!submission.system) {
    throw new ValidationError("Planet's System name is required", 400);
  }
  const valid_system = submission.system;

  if (!submission.descriptor) {
    throw new ValidationError("Biome descriptor is required", 400);
  } else if (!biome_descriptors.includes(submission.descriptor)) {
    throw new ValidationError("Invalid biome descriptor", 400);
  }
  const valid_descriptor = submission.descriptor;

  const goodMoonOptions = ["yes", "on", "true", true];
  const badMoonOptions = ["no", "off", "false", false];
  if (submission.moon && typeof submission.moon === "string") {
    const moonOptions = [...goodMoonOptions, ...badMoonOptions].filter((value) => typeof value === "string");
    if (!moonOptions.includes(submission.moon)) {
      throw new ValidationError(`A "moon" string must be: ${moonOptions.join(" ")}`, 400);
    }
  }
  const valid_moon = submission.moon !== undefined ? goodMoonOptions.includes(submission.moon) : false;

  if (!submission.agricultural) {
    throw new ValidationError("Agricultural resource required", 400);
  } else if (!resources.agricultural.includes(submission.agricultural)) {
    throw new ValidationError("Invalid agricultural resource", 400);
  }
  const valid_agricultural = submission.agricultural;

  if (!submission.stellar) {
    throw new ValidationError("Stellar resource required", 400);
  } else if (!resources.stellar.includes(submission.stellar)) {
    throw new ValidationError("Invalid stellar metal", 400);
  }
  const valid_stellar = submission.stellar;

  if (!submission.local) {
    throw new ValidationError("Biome local resource required", 400);
  } else if (!resources.local.includes(submission.local)) {
    throw new ValidationError("Invalid biome local resource", 400);
  }
  const valid_local = submission.local;

  if (!submission.general) {
    throw new ValidationError("General resource required", 400);
  } else if (!resources.general.includes(submission.general)) {
    throw new ValidationError("Invalid general resource", 400);
  }
  const valid_general = submission.general;

  const valid_resources = {
    agricultural: valid_agricultural,
    stellar: valid_stellar,
    local: valid_local,
    general: valid_general,
  };

  if (!submission.sentinels) {
    throw new ValidationError("Sentinel level is required", 400);
    // } else if (!Object.values(SentinelLevel).includes(submission.sentinels as SentinelLevel)) {
  } else if (
    submission.sentinels !== "low" &&
    submission.sentinels !== "high" &&
    submission.sentinels !== "aggressive" &&
    submission.sentinels !== "corrupt"
  ) {
    throw new ValidationError("Invalid Sentinel level", 400);
  }
  const valid_sentinels = submission.sentinels;

  let valid_biome = "";
  if (edit) {
    if (!submission.biome) {
      throw new ValidationError("Must provide planet Biome when editing", 400);
    } else if (!biomes.includes(submission.biome) && submission.biome !== "Lush / Marsh") {
      throw new ValidationError("Invalid biome", 400);
    }

    const { biome, note } = biome_edit(valid_descriptor, valid_agricultural, valid_local, submission.biome);

    valid_biome = biome;
    if (note) {
      warning = note;
    }
  } else {
    valid_biome = biome_new(valid_descriptor, valid_agricultural, valid_local, submission.weather);
    if (valid_biome.indexOf("/") !== -1) {
      warning = 'Cannot determine if planet is "Lush" or "Marsh".';
    }
  }

  verify_resources(valid_biome, valid_agricultural, valid_local);

  const valid_base = submission.base ?? false;

  const valid_base_name = !valid_base
    ? ""
    : submission.base_name
      ? submission.base_name === ""
        ? "[Unnamed]"
        : submission.base_name
      : "";

  const returnPlanet: PlanetNoId = {
    name: valid_name,
    system: valid_system,
    descriptor: valid_descriptor,
    sentinels: valid_sentinels,
    moon: valid_moon,
    resources: valid_resources,
    biome: valid_biome,
    exotic: exotic_biomes.includes(valid_biome),
    extreme: valid_resources.stellar.startsWith("Activated"),
    infested: valid_biome.includes("Infested"),
    base: valid_base,
    base_name: valid_base_name,
  };

  if (warning && warning !== "") {
    return { warning, valid_planet: returnPlanet };
  }

  return {
    valid_planet: returnPlanet,
  };
}

function biome_new(desc: string, agriculture: string, local: string, weather: string = ""): string {
  switch (desc) {
    case "Abandoned":
    case "Desolate":
      if (agriculture === "None") {
        return "Dead";
      } else if (agriculture === "Cactus Flesh") {
        return "Barren";
      } else {
        throw new ValidationError(`Descriptor "${desc}" cannot have agricultural resource "${agriculture}"`, 400);
      }
    case "Corrupted":
      if (agriculture === "None") {
        return "Glitch";
      } else if (agriculture === "Solanium") {
        return "Infested Scorched";
      } else {
        throw new ValidationError(`Descriptor "${desc}" cannot have agricultural resource "${agriculture}"`, 400);
      }

    case "Infested":
      if (infestedAgriculturalResourceMap[agriculture]) {
        return infestedAgriculturalResourceMap[agriculture];
      } else {
        throw new ValidationError(`Descriptor "${desc}" cannot have agricultural resource "${agriculture}"`, 400);
      }

    case "Tropical":
      if (agriculture === "None") {
        return "Marsh";
      } else if (agriculture === "Star Bulb") {
        console.log(desc, agriculture, local, weather);

        if (local === "Faecium" || local === "Mordite" || biomeWeatherMap.marsh.includes(weather)) {
          return "Marsh";
        } else if (biomeWeatherMap.lush.includes(weather)) {
          return "Lush";
        } else {
          // Weather was either 'Humid' or empty
          return "Lush / Marsh";
        }
      } else {
        throw new ValidationError(`Descriptor "${desc}" cannot have agricultural resource "${agriculture}"`, 400);
      }

    default:
      return biomeDescriptorMap[desc];
  }
}

function biome_edit(desc: string, agriculture: string, local: string, biome: string): { biome: string; note?: string } {
  switch (desc) {
    case "Abandoned":
    case "Desolate":
      if (agriculture === "None") {
        if (biome === "Dead") {
          return { biome };
        } else {
          return {
            biome: "Dead",
            note: `"${biome}" was invalid, overwritten to "Dead"`,
          };
        }
      } else if (agriculture === "Cactus Flesh") {
        if (biome == "Barren") {
          return { biome };
        } else {
          return {
            biome: "Dead",
            note: `"${biome}" was invalid, overwritten to "Barren"`,
          };
        }
      } else {
        throw new ValidationError(`Descriptor "${desc}" cannot have agricultural resource "${agriculture}"`, 400);
      }
    case "Corrupted":
      if (agriculture === "None") {
        if (biome === "Glitch") {
          return { biome };
        } else {
          return {
            biome: "Glitch",
            note: `"${biome}" was invalid, overwritten to "Glitch"`,
          };
        }
      } else if (agriculture === "Solanium") {
        if (biome === "Infested Scorched") {
          return { biome };
        } else {
          return {
            biome: "Infested Scorched",
            note: `"${biome}" was invalid, overwritten to "Infested Scorched"`,
          };
        }
      } else {
        throw new ValidationError(`Descriptor "${desc}" cannot have agricultural resource "${agriculture}"`, 400);
      }

    case "Infested":
      if (infestedAgriculturalResourceMap[agriculture] === biome) {
        return { biome };
      } else {
        throw new ValidationError(`Descriptor "${desc}" cannot have agricultural resource "${agriculture}"`, 400);
      }

    case "Tropical":
      if (agriculture === "None") {
        if (biome === "Marsh") {
          return { biome };
        } else {
          return {
            biome: "Marsh",
            note: `"${biome}" was invalid, overwritten to "Marsh"`,
          };
        }
      } else if (agriculture === "Star Bulb") {
        if (local === "Faecium" || local === "Mordite") {
          if (biome === "Marsh") {
            return { biome };
          } else {
            return {
              biome: "Marsh",
              note: `"${biome}" was invalid, overwritten to "Marsh"`,
            };
          }
        } else if (biome === "Lush" || biome === "Marsh") {
          return { biome };
        } else {
          throw new ValidationError('A planet with "Star Bulb" must be a "Marsh" or "Lush Biome"', 400);
        }
      } else {
        throw new ValidationError(`Descriptor "${desc}" cannot have agricultural resource "${agriculture}"`, 400);
      }

    default:
      if (biome === biomeDescriptorMap[desc]) {
        return { biome };
      } else {
        return {
          biome: biomeDescriptorMap[desc],
          note: `"${biome}" was invalid, overwritten to "${biomeDescriptorMap[desc]}"`,
        };
      }
  }
}

function verify_resources(biome: string, agriculture: string, local: string) {
  if (biome in biomeAgriculturalResourceMap) {
    if (agriculture !== biomeAgriculturalResourceMap[biome]) {
      throw new ValidationError(`Biome "${biome}" cannot have agricultural resource "${agriculture}"`, 400);
    }
  } else if (biome === "Lush / Marsh") {
    if (agriculture !== "Star Bulb") {
      throw new ValidationError(`Biome "${biome}" cannot have agricultural resource "${agriculture}"`, 400);
    }
  } else if (biome === "Marsh") {
    if (agriculture !== "Star Bulb" && agriculture !== "None") {
      throw new ValidationError(`Biome "${biome}" cannot have agricultural resource "${agriculture}"`, 400);
    }
  } else {
    if (agriculture !== "None") {
      throw new ValidationError(`Biome "${biome}" cannot have agricultural resource "${agriculture}"`, 400);
    }
  }

  if (local in resourceBiomeMap) {
    if (!resourceBiomeMap[local].includes(biome)) {
      throw new ValidationError(`"${local}" cannot be in the "${biome}" biome`, 400);
    }
  }
}
