"use client";
import React from "react";

import {
  Collapse,
  Divider,
  Pagination,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Avatar,
  Button,
  ButtonGroup,
} from "@mui/material";
import { Create as CreateIcon, FilterList as FilterIcon, Refresh as RefreshIcon } from "@mui/icons-material";

import GridContainer from "@/components/general/GridContainer";
import GridItem from "@/components/general/GridItem";
import PlanetCard from "@/components/planet/PlanetCard";
import PlanetFilters from "@/components/planet/PlanetFilters";

import { Planet } from "@/lib/types";

import { useRouter } from "next/navigation";
import CenterBox from "@/components/general/CenterBox";

type Props = Readonly<{
  planets_promise: Promise<Planet[]>;
}>;

const speedSX = { position: "fixed", bottom: 16, left: 16 };

export default function PlanetLoader({ planets_promise }: Props) {
  const planets = React.use(planets_promise);

  const [boa, setBoa] = React.useState<string>("");
  const [stellar, setStellar] = React.useState<string>("");
  const [local, setLocal] = React.useState<string>("");
  const [general, setGeneral] = React.useState<string>("");
  const [hasBase, setHasBase] = React.useState<boolean>(false);

  const [showFilters, setShowFilters] = React.useState<boolean>(false);

  // const [page, setPage] = React.useState<number>(1);
  // const change_page = (e: React.ChangeEvent<unknown>, value: number) => {
  //   setPage(value);
  // };

  const filtered = planets.filter((planet) =>
    planet_filter(planet, {
      boa,
      stellar,
      local,
      general,
      hasBase,
    }),
  );

  // const chunk_size = 12;
  // const [chunk_size, setChunkSize] = React.useState<number>(12);
  // const num_chunks = Math.floor(filtered.length / chunk_size);

  const router = useRouter();

  const actions = [
    { icon: <CreateIcon />, name: "Add", onclick: () => router.push("/planets/add") },
    {
      icon: <FilterIcon />,
      name: "Filter",
      onclick: () => {
        setShowFilters(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    },
    { icon: <RefreshIcon />, name: "Refresh", onclick: () => router.refresh() },
  ];

  return (
    <React.Fragment>
      <Collapse in={showFilters} sx={{ width: "100%" }}>
        <CenterBox>
          <Button variant="outlined" onClick={() => setShowFilters(false)} sx={{ mb: 2 }}>
            Close
          </Button>
        </CenterBox>

        <PlanetFilters
          boa={boa}
          setBoa={setBoa}
          stellar={stellar}
          setStellar={setStellar}
          local={local}
          setLocal={setLocal}
          general={general}
          setGeneral={setGeneral}
          hasBase={hasBase}
          setHasBase={setHasBase}
        />

        <Divider sx={{ pb: 2, mt: 2, width: "100%", color: "text.secondary" }}>Display Amount</Divider>

        {/* <CenterBox>
          <ButtonGroup>
            <Button variant={chunk_size === 6 ? "contained" : "outlined"} onClick={() => setChunkSize(6)}>
              6
            </Button>
            <Button variant={chunk_size === 9 ? "contained" : "outlined"} onClick={() => setChunkSize(9)}>
              9
            </Button>
            <Button variant={chunk_size === 12 ? "contained" : "outlined"} onClick={() => setChunkSize(12)}>
              12
            </Button>
            <Button variant={chunk_size === 15 ? "contained" : "outlined"} onClick={() => setChunkSize(15)}>
              15
            </Button>
            <Button variant={chunk_size === 18 ? "contained" : "outlined"} onClick={() => setChunkSize(18)}>
              18
            </Button>
          </ButtonGroup>
        </CenterBox> */}

        {/* <Divider sx={{ pb: 2, mb: 2, width: "100%" }} /> */}
      </Collapse>

      <GridContainer>
        {/* .slice((page - 1) * chunk_size, page * chunk_size) */}
        {filtered.map((planet) => (
          <GridItem key={planet._id}>
            <PlanetCard planet={planet} />
          </GridItem>
        ))}
      </GridContainer>

      {/* <Stack sx={{ alignItems: "center", mt: 2 }}>
        <Pagination
          count={filtered.length % chunk_size === 0 && filtered.length !== 0 ? num_chunks : num_chunks + 1}
          page={page}
          onChange={change_page}
          boundaryCount={2}
        />
      </Stack> */}

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

function planet_filter(
  planet: Planet,
  filter: { boa: string; stellar: string; local: string; general: string; hasBase: boolean },
) {
  const { boa, stellar, local, general, hasBase } = filter;
  if (boa === "" && stellar === "" && local === "" && general === "" && !hasBase) {
    return true;
  }

  let result = true;

  if (boa !== "") {
    result &&= planet.biome === boa || planet.resources.agricultural === boa;
  }

  if (stellar !== "") {
    result &&= planet.resources.stellar === stellar;
  }

  if (local !== "") {
    result &&= planet.resources.local === local;
  }

  if (general !== "") {
    result &&= planet.resources.general === general;
  }

  if (hasBase) {
    result &&= planet.base;
  }

  return result;
}
