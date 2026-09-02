import React from "react";

import { Autocomplete, TextField } from "@mui/material";

import GridContainer from "@/components/general/GridContainer";
import GridItem from "@/components/general/GridItem";

import { biomes } from "@/lib/lists";
import { resources } from "@/lib/maps";

type Props = {
  boa: string;
  setBoa: React.Dispatch<React.SetStateAction<string>>;

  stellar: string;
  setStellar: React.Dispatch<React.SetStateAction<string>>;

  local: string;
  setLocal: React.Dispatch<React.SetStateAction<string>>;

  general: string;
  setGeneral: React.Dispatch<React.SetStateAction<string>>;
};

const grid_size = { sm: 6, md: 4, lg: 3 };

export default function PlanetFilters({
  boa,
  setBoa,
  stellar,
  setStellar,
  local,
  setLocal,
  general,
  setGeneral,
}: Props) {
  return (
    <GridContainer>
      <GridItem size={grid_size}>
        <Autocomplete
          clearOnEscape
          options={biomes.concat(resources.agricultural)}
          renderInput={(params) => <TextField {...params} label="Biome/Agricultural" name="" size="small" required />}
          value={boa !== "" ? boa : null}
          onInputChange={(event, value, reason) => {
            if (reason === "clear") {
              setBoa("");
            } else {
              setBoa(value);
            }
          }}
        />
      </GridItem>

      <GridItem size={grid_size}>
        <Autocomplete
          clearOnEscape
          options={resources.stellar}
          renderInput={(params) => <TextField {...params} label="Stellar Metal" name="" size="small" required />}
          value={stellar !== "" ? stellar : null}
          onInputChange={(event, value, reason) => {
            if (reason === "clear") {
              setStellar("");
            } else {
              setStellar(value);
            }
          }}
        />
      </GridItem>

      <GridItem size={grid_size}>
        <Autocomplete
          clearOnEscape
          options={resources.local}
          renderInput={(params) => <TextField {...params} label="Local Resource" name="" size="small" required />}
          value={local !== "" ? local : null}
          onInputChange={(event, value, reason) => {
            if (reason === "clear") {
              setLocal("");
            } else {
              setLocal(value);
            }
          }}
        />
      </GridItem>

      <GridItem size={grid_size}>
        <Autocomplete
          clearOnEscape
          options={resources.general}
          renderInput={(params) => <TextField {...params} label="General Resource" name="" size="small" required />}
          value={general !== "" ? general : null}
          onInputChange={(event, value, reason) => {
            if (reason === "clear") {
              setGeneral("");
            } else {
              setGeneral(value);
            }
          }}
        />
      </GridItem>
    </GridContainer>
  );
}
