"use client";
import React from "react";

import { Button, Collapse, Divider, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import CenterBox from "@/components/general/CenterBox";
import GridContainer from "@/components/general/GridContainer";
import GridItem from "@/components/general/GridItem";
import PlanetCard from "@/components/planet/PlanetCard";
import PlanetFilters from "@/components/planet/PlanetFilters";

import { Planet } from "@/lib/types";

import { useRouter } from "next/navigation";

type Props = Readonly<{
  planets_promise: Promise<Planet[]>;
}>;

const fabSX = { position: "absolute", top: 16, left: 16 };

export default function PlanetLoader({ planets_promise }: Props) {
  const planets = React.use(planets_promise);

  const [boa, setBoa] = React.useState<string>("");
  const [stellar, setStellar] = React.useState<string>("");
  const [local, setLocal] = React.useState<string>("");
  const [general, setGeneral] = React.useState<string>("");

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
      </Collapse>

      <Divider sx={{ pb: 2, mb: 2, width: "100%" }} />

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
        <Button
          variant="outlined"
          onClick={() => {
            router.refresh();
          }}
        >
          Refresh
        </Button>
      </CenterBox>

      <Fab color="info" sx={fabSX} href="/planets/add">
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
