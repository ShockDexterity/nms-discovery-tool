"use client";
import React from "react";

import { Button, Collapse, Divider, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import CenterBox from "@/components/general/CenterBox";
import GridContainer from "@/components/general/GridContainer";
import GridItem from "@/components/general/GridItem";
import SystemCard from "@/components/system/SystemCard";
import SystemFilters from "@/components/system/SystemFilters";

import { System } from "@/lib/types";

import { useRouter } from "next/navigation";

type Props = Readonly<{
  systems_promise: Promise<System[]>;
}>;

const fabSX = { position: "absolute", top: 16, left: 16 };

export default function SystemLoader({ systems_promise }: Props) {
  const systems = React.use(systems_promise);

  const [faction, setFaction] = React.useState<string>("");
  const [economy, setEconomy] = React.useState<string>("");
  const [conflict, setConflict] = React.useState<string>("");
  const [atlas, setAtlas] = React.useState<boolean>(false);
  const [blackhole, setBlackhole] = React.useState<boolean>(false);

  const [showFilters, setShowFilters] = React.useState<boolean>(false);

  const router = useRouter();

  return (
    <React.Fragment>
      <CenterBox>
        <Button
          variant="outlined"
          onClick={() => {
            setShowFilters(!showFilters);
          }}
        >
          Filters
        </Button>
      </CenterBox>

      <Collapse in={showFilters} sx={{ width: "100%" }}>
        <Divider sx={{ pb: 2, mb: 2, width: "100%" }} />

        <SystemFilters
          faction={faction}
          setFaction={setFaction}
          economy={economy}
          setEconomy={setEconomy}
          conflict={conflict}
          setConflict={setConflict}
          atlas={atlas}
          setAtlas={setAtlas}
          blackhole={blackhole}
          setBlackhole={setBlackhole}
        />
      </Collapse>

      <Divider sx={{ pb: 2, mb: 2, width: "100%" }} />

      <GridContainer>
        {systems
          .filter((system) =>
            planet_filter(system, {
              faction,
              economy,
              conflict,
              atlas,
              blackhole,
            }),
          )
          .map((system) => (
            <GridItem key={system._id}>
              <SystemCard system={system} />
            </GridItem>
          ))}
      </GridContainer>

      <Divider sx={{ pb: 2, mb: 2, width: "100%" }} />

      <CenterBox>
        <Button
          variant="outlined"
          onClick={() => {
            router.refresh();
          }}
        >
          Refresh
        </Button>
      </CenterBox>

      <Fab color="info" sx={fabSX} href="/systems/add">
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
}

function planet_filter(
  system: System,
  filter: { faction: string; economy: string; conflict: string; atlas: boolean; blackhole: boolean },
) {
  const { faction, economy, conflict, atlas, blackhole } = filter;

  if (faction === "" && economy === "" && conflict === "" && !atlas && !blackhole) {
    return true;
  }

  let result = true;

  if (faction !== "") {
    result &&= system.faction === faction;
  }

  if (economy !== "") {
    result &&= system.economy.type === economy;
  }

  if (conflict !== "") {
    result &&= system.conflict === conflict;
  }

  if (atlas) {
    result &&= system.atlas;
  }
  if (blackhole) {
    result &&= system.blackhole;
  }

  return result;
}
