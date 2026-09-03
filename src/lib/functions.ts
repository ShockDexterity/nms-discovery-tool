import { special_descriptors } from "./lists";

const border = 2;
const borderRadius = `${border}px`;
const width = "100%";

export function biome_border(extreme: boolean, infested: boolean, exotic: boolean): Object {
  if (extreme && infested) {
    return {
      border,
      borderImageSlice: 1,
      borderImageSource: "linear-gradient(to right, #f44336 50%, #66bb6a 50%)",
      borderRadius,
      width,
    } as const;
  } else if (extreme) {
    return {
      border,
      borderColor: "error.main",
      borderRadius,
      width,
    } as const;
  } else if (infested) {
    return {
      border,
      borderColor: "success.main",
      borderRadius,
      width,
    } as const;
  } else if (exotic) {
    return {
      border,
      borderColor: "text.secondary",
      borderRadius,
      width,
    } as const;
  } else {
    return {
      border,
      borderColor: "#1e1e1e",
      borderRadius,
      width,
    } as const;
  }
}

export function descriptor_string(descriptor: string, isMoon: boolean) {
  if (descriptor === "of Light") {
    return isMoon ? "Moon of Light" : "Planet of Light";
  }

  if (special_descriptors.find((d) => d === descriptor)) {
    return descriptor;
  }

  return `${descriptor} ${isMoon ? "Moon" : "Planet"}`;
}

export function system_border(hasAtlas: boolean, hasBlackhole: boolean): Object {
  if (hasAtlas && hasBlackhole) {
    return {
      border,
      borderImageSlice: 1,
      borderImageSource: "linear-gradient(135deg, #f44336 50%, #ce93d8 50%)",
      borderRadius,
      width,
    } as const;
  } else if (hasAtlas) {
    return {
      border,
      borderColor: "error.main",
      borderRadius,
      width,
    } as const;
  } else if (hasBlackhole) {
    return {
      border,
      borderColor: "secondary.main",
      borderRadius,
      width,
    } as const;
  } else {
    return {
      border,
      borderColor: "#1e1e1e",
      borderRadius,
      width,
    } as const;
  }
}
