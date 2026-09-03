import React from "react";

import { Autocomplete, Checkbox, FormControlLabel, TextField } from "@mui/material";

import GridContainer from "@/components/general/GridContainer";
import GridItem from "@/components/general/GridItem";

import { conflict_levels, factions } from "@/lib/lists";
import { economy } from "@/lib/maps";
import CenterBox from "@/components/general/CenterBox";

type Props = {
  faction: string;
  setFaction: React.Dispatch<React.SetStateAction<string>>;

  economy: string;
  setEconomy: React.Dispatch<React.SetStateAction<string>>;

  conflict: string;
  setConflict: React.Dispatch<React.SetStateAction<string>>;

  atlas: boolean;
  setAtlas: React.Dispatch<React.SetStateAction<boolean>>;

  blackhole: boolean;
  setBlackhole: React.Dispatch<React.SetStateAction<boolean>>;
};

const grid_size = { md: 4 };

export default function SystemFilters({
  faction,
  setFaction,
  economy: econ,
  setEconomy,
  conflict,
  setConflict,
  atlas,
  setAtlas,
  blackhole,
  setBlackhole,
}: Props) {
  return (
    <GridContainer>
      <GridItem size={grid_size}>
        <Autocomplete
          clearOnEscape
          options={factions}
          renderInput={(params) => <TextField {...params} label="Faction" name="" size="small" required />}
          value={faction !== "" ? faction : null}
          onInputChange={(event, value, reason) => {
            if (reason === "clear") {
              setFaction("");
            } else {
              setFaction(value);
            }
          }}
        />
      </GridItem>

      <GridItem size={grid_size}>
        <Autocomplete
          clearOnEscape
          options={economy.types}
          renderInput={(params) => <TextField {...params} label="Economy Type" name="" size="small" required />}
          value={econ !== "" ? econ : null}
          onInputChange={(event, value, reason) => {
            if (reason === "clear") {
              setEconomy("");
            } else {
              setEconomy(value);
            }
          }}
        />
      </GridItem>

      <GridItem size={grid_size}>
        <Autocomplete
          clearOnEscape
          options={conflict_levels}
          renderInput={(params) => <TextField {...params} label="Conflict Levels" name="" size="small" required />}
          value={conflict !== "" ? conflict : null}
          onInputChange={(event, value, reason) => {
            if (reason === "clear") {
              setConflict("");
            } else {
              setConflict(value);
            }
          }}
        />
      </GridItem>

      <GridItem size={{ xs: 3, sm: 3, md: 6, lg: 6, xl: 6 }}>
        <CenterBox>
          <FormControlLabel
            label="Has Atlas"
            control={
              <Checkbox
                name=""
                checked={atlas}
                onChange={(event) => {
                  setAtlas(event.target.checked);
                }}
              />
            }
            value={atlas}
          />
        </CenterBox>
      </GridItem>

      <GridItem size={{ xs: 3, sm: 3, md: 6, lg: 6, xl: 6 }}>
        <CenterBox>
          <FormControlLabel
            label="Has Black Hole"
            control={
              <Checkbox
                name=""
                checked={blackhole}
                onChange={(event) => {
                  setBlackhole(event.target.checked);
                }}
              />
            }
          />
        </CenterBox>
      </GridItem>
    </GridContainer>
  );
}
