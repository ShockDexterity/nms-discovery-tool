"use client";
import React, { act } from "react";

import { Collapse, Divider, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { Create as CreateIcon, FilterList as FilterIcon, Refresh as RefreshIcon } from "@mui/icons-material";

import GridContainer from "@/components/general/GridContainer";
import GridItem from "@/components/general/GridItem";
import SystemCard from "@/components/system/SystemCard";
import SystemFilters from "@/components/system/SystemFilters";

import { System } from "@/lib/types";

import { useRouter } from "next/navigation";

type Props = Readonly<{
  systems_promise: Promise<System[]>;
}>;

const speedSX = { position: "fixed", bottom: 16, left: 16 };

export default function SystemLoader({ systems_promise }: Props) {
  const systems = React.use(systems_promise);

  const [faction, setFaction] = React.useState<string>("");
  const [economy, setEconomy] = React.useState<string>("");
  const [conflict, setConflict] = React.useState<string>("");
  const [atlas, setAtlas] = React.useState<boolean>(false);
  const [blackhole, setBlackhole] = React.useState<boolean>(false);

  const [showFilters, setShowFilters] = React.useState<boolean>(false);

  const router = useRouter();

  const actions = [
    { icon: <CreateIcon />, name: "Add", onclick: () => router.push("/systems/add") },
    { icon: <FilterIcon />, name: "Filter", onclick: () => setShowFilters(!showFilters) },
    { icon: <RefreshIcon />, name: "Refresh", onclick: () => router.refresh() },
  ];

  return (
    <React.Fragment>
      <Collapse in={showFilters} sx={{ width: "100%" }}>
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

        <Divider sx={{ pb: 2, mb: 2, width: "100%" }} />
      </Collapse>

      <GridContainer>
        {systems
          .filter((system) =>
            system_filter(system, {
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

      <SpeedDial ariaLabel="speed dial" direction="right" icon={<SpeedDialIcon />} sx={speedSX}>
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onClick={action.onclick}
            slotProps={{ tooltip: { title: action.name } }}
          />
        ))}
      </SpeedDial>
    </React.Fragment>
  );
}

function system_filter(
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
