"use client";
import React from "react";

import { Button, Collapse, Divider, Fab } from "@mui/material";

import GridContainer from "@/components/general/GridContainer";
import GridItem from "@/components/general/GridItem";
import PlanetCard from "@/components/planet/PlanetCard";

import { Planet } from "@/lib/types";
import { Add as AddIcon } from "@mui/icons-material";
import PlanetFilters from "@/components/planet/PlanetFilters";
import CenterBox from "@/components/general/CenterBox";

type Props = Readonly<{
  planets_promise: Promise<Planet[]>;
}>;

const fabSX = { position: "absolute", bottom: 16, right: 16 };

export default function PlanetLoader({ planets_promise }: Props) {
  const planets = React.use(planets_promise);

  const [boa, setBoa] = React.useState<string>("");
  const [stellar, setStellar] = React.useState<string>("");
  const [local, setLocal] = React.useState<string>("");
  const [general, setGeneral] = React.useState<string>("");
  const [showFilters, setShowFilters] = React.useState<boolean>(false);

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

      <Divider sx={{ pb: 2, mb: 2, width: "100%" }} />

      <Collapse in={showFilters} sx={{ width: "100%" }}>
        <PlanetFilters
          boa={boa}
          setBoa={setBoa}
          stellar={stellar}
          setStellar={setStellar}
          local={local}
          setLocal={setLocal}
          general={general}
          setGeneral={setGeneral}
        />

        <Divider sx={{ pb: 2, mb: 2, width: "100%" }} />
      </Collapse>

      <GridContainer>
        {planets
          .filter((planet) =>
            planet_filter(planet, {
              boa,
              stellar,
              local,
              general,
            }),
          )
          .map((planet) => (
            <GridItem key={planet._id}>
              <PlanetCard planet={planet} />
            </GridItem>
          ))}
      </GridContainer>

      <Divider sx={{ pb: 2, mb: 2, width: "100%" }} />

      <CenterBox>
        <Button variant="outlined" onClick={() => {}}>
          Refresh
        </Button>
      </CenterBox>

      <Fab color="primary" sx={fabSX} href="/planets/add">
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
}

function planet_filter(planet: Planet, filter: { boa: string; stellar: string; local: string; general: string }) {
  const { boa, stellar, local, general } = filter;
  if (boa === "" && stellar === "" && local === "" && general === "") {
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

  return result;
}
