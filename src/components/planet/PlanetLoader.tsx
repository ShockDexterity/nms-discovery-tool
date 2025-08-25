"use client";
import React from "react";

import { Typography } from "@mui/material";

import { Planet } from "@/lib/types";
import GridContainer from "@/components/general/GridContainer";
import GridItem from "@/components/general/GridItem";

type Props = Readonly<{
  planets_promise: Promise<Planet[]>;
}>;

export default function PlanetLoader({ planets_promise }: Props) {
  const planets = React.use(planets_promise);

  return (
    <GridContainer>
      {planets.map((planet) => (
        <GridItem>
          <Typography>{planet.name}</Typography>
        </GridItem>
      ))}
    </GridContainer>
  );
}
