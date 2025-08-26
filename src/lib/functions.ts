import { specialDescriptors } from "./lists";

const border = 2;
const borderRadius = `${border}px`;

export function biome_border(extreme: boolean, infested: boolean, exotic: boolean): Object {
  if (extreme && infested) {
    return {
      border,
      borderImageSlice: 1,
      borderImageSource: "linear-gradient(to right, #f44336 50%, #66bb6a 50%)",
      borderRadius,
    } as const;
  } else if (extreme) {
    return {
      border,
      borderColor: "error.main",
      borderRadius,
    } as const;
  } else if (infested) {
    return {
      border,
      borderColor: "success.main",
      borderRadius,
    } as const;
  } else if (exotic) {
    return {
      border,
      borderColor: "text.secondary",
      borderRadius,
    } as const;
  } else {
    return {
      border,
      borderColor: "#1e1e1e",
      borderRadius,
    } as const;
  }
}

export function getDescriptor(descriptor: string, isMoon: boolean) {
  if (descriptor === "of Light") {
    return isMoon ? "Moon of Light" : "Planet of Light";
  }

  if (specialDescriptors.find((d) => d === descriptor)) {
    return descriptor;
  }

  return `${descriptor} ${isMoon ? "Moon" : "Planet"}`;
}

export function getSystemBorder(hasAtlas: boolean, hasBlackhole: boolean, useDefault = true): Object {
  if (hasAtlas && hasBlackhole) {
    return {
      border,
      borderImageSlice: 1,
      borderImageSource: "linear-gradient(45deg, #f44336 50%, #ce93d8 50%)",
      borderRadius,
    } as const;
  } else if (hasAtlas) {
    return {
      border,
      borderColor: "error.main",
      borderRadius,
    } as const;
  } else if (hasBlackhole) {
    return {
      border,
      borderColor: "secondary.main",
      borderRadius,
    } as const;
  } else if (useDefault) {
    return {
      border,
      borderColor: "black",
      borderRadius,
    } as const;
  } else {
    return {} as const;
  }
}
