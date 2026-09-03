import React from "react";

import { Autocomplete, Checkbox, FormControlLabel, TextField } from "@mui/material";

import GridContainer from "@/components/general/GridContainer";
import GridItem from "@/components/general/GridItem";

import { biomes } from "@/lib/lists";
import { resources } from "@/lib/maps";
import CenterBox from "@/components/general/CenterBox";

type Props = {
  boa: string;
  setBoa: React.Dispatch<React.SetStateAction<string>>;

  stellar: string;
  setStellar: React.Dispatch<React.SetStateAction<string>>;

  local: string;
  setLocal: React.Dispatch<React.SetStateAction<string>>;

  general: string;
  setGeneral: React.Dispatch<React.SetStateAction<string>>;

  hasBase: boolean;
  setHasBase: React.Dispatch<React.SetStateAction<boolean>>;
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
  hasBase,
  setHasBase,
}: Props) {
  return (
    <GridContainer>
      <GridItem size={grid_size}>
        <Autocomplete
          clearOnEscape
          options={resources.agricultural.slice(1).concat(biomes)}
          groupBy={(option) => (biomes.includes(option) ? "biome" : "resource")}
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

      <GridItem size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
        <CenterBox>
          <FormControlLabel
            label="Has Base"
            control={
              <Checkbox
                name=""
                checked={hasBase}
                onChange={(event) => {
                  setHasBase(event.target.checked);
                }}
              />
            }
          />
        </CenterBox>
      </GridItem>
    </GridContainer>
  );
}
